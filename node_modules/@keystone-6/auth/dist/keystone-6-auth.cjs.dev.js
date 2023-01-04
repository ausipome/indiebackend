'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var _objectWithoutProperties = require('@babel/runtime/helpers/objectWithoutProperties');
var _objectSpread = require('@babel/runtime/helpers/objectSpread2');
var fields = require('@keystone-6/core/fields');
var types = require('@keystone-6/core/types');
var graphql = require('graphql');
var core = require('@keystone-6/core');
var crypto = require('crypto');

async function validateSecret(secretFieldImpl, identityField, identity, secretField, secret, dbItemAPI) {
  const item = await dbItemAPI.findOne({
    where: {
      [identityField]: identity
    }
  });
  if (!item || !item[secretField]) {
    // See "Identity Protection" in the README as to why this is a thing
    await secretFieldImpl.generateHash('simulated-password-to-counter-timing-attack');
    return {
      success: false
    };
  } else if (await secretFieldImpl.compare(secret, item[secretField])) {
    // Authenticated!
    return {
      success: true,
      item
    };
  } else {
    return {
      success: false
    };
  }
}

function getBaseAuthSchema(_ref) {
  let {
    listKey,
    identityField,
    secretField,
    gqlNames,
    secretFieldImpl,
    base
  } = _ref;
  const ItemAuthenticationWithPasswordSuccess = core.graphql.object()({
    name: gqlNames.ItemAuthenticationWithPasswordSuccess,
    fields: {
      sessionToken: core.graphql.field({
        type: core.graphql.nonNull(core.graphql.String)
      }),
      item: core.graphql.field({
        type: core.graphql.nonNull(base.object(listKey))
      })
    }
  });
  const ItemAuthenticationWithPasswordFailure = core.graphql.object()({
    name: gqlNames.ItemAuthenticationWithPasswordFailure,
    fields: {
      message: core.graphql.field({
        type: core.graphql.nonNull(core.graphql.String)
      })
    }
  });
  const AuthenticationResult = core.graphql.union({
    name: gqlNames.ItemAuthenticationWithPasswordResult,
    types: [ItemAuthenticationWithPasswordSuccess, ItemAuthenticationWithPasswordFailure],
    resolveType(val) {
      if ('sessionToken' in val) {
        return gqlNames.ItemAuthenticationWithPasswordSuccess;
      }
      return gqlNames.ItemAuthenticationWithPasswordFailure;
    }
  });
  const extension = {
    query: {
      authenticatedItem: core.graphql.field({
        type: core.graphql.union({
          name: 'AuthenticatedItem',
          types: [base.object(listKey)],
          resolveType: (root, context) => {
            var _context$session;
            return (_context$session = context.session) === null || _context$session === void 0 ? void 0 : _context$session.listKey;
          }
        }),
        resolve(root, args, _ref2) {
          let {
            session,
            db
          } = _ref2;
          if (typeof (session === null || session === void 0 ? void 0 : session.itemId) === 'string' && typeof session.listKey === 'string') {
            return db[session.listKey].findOne({
              where: {
                id: session.itemId
              }
            });
          }
          return null;
        }
      })
    },
    mutation: {
      [gqlNames.authenticateItemWithPassword]: core.graphql.field({
        type: AuthenticationResult,
        args: {
          [identityField]: core.graphql.arg({
            type: core.graphql.nonNull(core.graphql.String)
          }),
          [secretField]: core.graphql.arg({
            type: core.graphql.nonNull(core.graphql.String)
          })
        },
        async resolve(root, _ref3, context) {
          let {
            [identityField]: identity,
            [secretField]: secret
          } = _ref3;
          if (!context.sessionStrategy) {
            throw new Error('No session implementation available on context');
          }
          const dbItemAPI = context.sudo().db[listKey];
          const result = await validateSecret(secretFieldImpl, identityField, identity, secretField, secret, dbItemAPI);
          if (!result.success) {
            return {
              code: 'FAILURE',
              message: 'Authentication failed.'
            };
          }

          // Update system state
          const sessionToken = await context.sessionStrategy.start({
            data: {
              listKey,
              itemId: result.item.id
            },
            context
          });
          return {
            sessionToken,
            item: result.item
          };
        }
      })
    }
  };
  return {
    extension,
    ItemAuthenticationWithPasswordSuccess
  };
}

function getInitFirstItemSchema(_ref) {
  let {
    listKey,
    fields,
    itemData,
    gqlNames,
    graphQLSchema,
    ItemAuthenticationWithPasswordSuccess
  } = _ref;
  const createInputConfig = graphql.assertInputObjectType(graphQLSchema.getType(`${listKey}CreateInput`)).toConfig();
  const fieldsSet = new Set(fields);
  const initialCreateInput = core.graphql.wrap.inputObject(new graphql.GraphQLInputObjectType(_objectSpread(_objectSpread({}, createInputConfig), {}, {
    fields: Object.fromEntries(Object.entries(createInputConfig.fields).filter(_ref2 => {
      let [fieldKey] = _ref2;
      return fieldsSet.has(fieldKey);
    })),
    name: gqlNames.CreateInitialInput
  })));
  return {
    mutation: {
      [gqlNames.createInitialItem]: core.graphql.field({
        type: core.graphql.nonNull(ItemAuthenticationWithPasswordSuccess),
        args: {
          data: core.graphql.arg({
            type: core.graphql.nonNull(initialCreateInput)
          })
        },
        async resolve(rootVal, _ref3, context) {
          let {
            data
          } = _ref3;
          if (!context.sessionStrategy) {
            throw new Error('No session implementation available on context');
          }
          const dbItemAPI = context.sudo().db[listKey];

          // should approximate hasInitFirstItemConditions
          const count = await dbItemAPI.count({});
          if (count !== 0) {
            throw new Error('Initial items can only be created when no items exist in that list');
          }

          // Update system state
          // this is strictly speaking incorrect. the db API will do GraphQL coercion on a value which has already been coerced
          // (this is also mostly fine, the chance that people are using things where
          // the input value can't round-trip like the Upload scalar here is quite low)
          const item = await dbItemAPI.createOne({
            data: _objectSpread(_objectSpread({}, data), itemData)
          });
          const sessionToken = await context.sessionStrategy.start({
            data: {
              listKey,
              itemId: item.id.toString()
            },
            context
          });
          return {
            item,
            sessionToken
          };
        }
      })
    }
  };
}

function generateToken(length) {
  return crypto.randomBytes(length) // Generates N*8 bits of data
  .toString('base64') // Groups by 6-bits and encodes as ascii chars in [A-Za-z0-9+/] and '=' for padding (~8/6 * N chars)
  .replace(/[^a-zA-Z0-9]/g, '') // Removes any '+', '/' (62, 63) and '=' chars as often require escaping (eg. in urls)
  .slice(0, length); // Shortens the string, so we now have ~6*N bits of data (it's actually log2(62)*N = 5.954*N)
}

// TODO: Auth token mutations may leak user identities due to timing attacks :(
// We don't (currently) make any effort to mitigate the time taken to record the new token or sent the email when successful
async function createAuthToken(identityField, identity, dbItemAPI) {
  const item = await dbItemAPI.findOne({
    where: {
      [identityField]: identity
    }
  });
  if (item) {
    return {
      success: true,
      itemId: item.id,
      token: generateToken(20)
    };
  } else {
    return {
      success: false
    };
  }
}

// The tokensValidForMins config is from userland so could be anything; make it sane
function sanitiseValidForMinsConfig(input) {
  const parsed = Number.parseFloat(input);
  // > 10 seconds, < 24 hrs, default 10 mins
  return parsed ? Math.max(1 / 6, Math.min(parsed, 60 * 24)) : 10;
}
async function validateAuthToken(listKey, secretFieldImpl, tokenType, identityField, identity, tokenValidMins, token, dbItemAPI) {
  const result = await validateSecret(secretFieldImpl, identityField, identity, `${tokenType}Token`, token, dbItemAPI);
  if (!result.success) {
    // Could be due to:
    // - Missing identity
    // - Missing secret
    // - Secret mismatch.
    return {
      success: false,
      code: 'FAILURE'
    };
  }

  // Now that we know the identity and token are valid, we can always return 'helpful' errors and stop worrying about protecting identities.
  const {
    item
  } = result;
  const fieldKeys = {
    issuedAt: `${tokenType}IssuedAt`,
    redeemedAt: `${tokenType}RedeemedAt`
  };

  // Check that the token has not been redeemed already
  if (item[fieldKeys.redeemedAt]) {
    return {
      success: false,
      code: 'TOKEN_REDEEMED'
    };
  }

  // Check that the token has not expired
  if (!item[fieldKeys.issuedAt] || typeof item[fieldKeys.issuedAt].getTime !== 'function') {
    throw new Error(`Error redeeming authToken: field ${listKey}.${fieldKeys.issuedAt} isn't a valid Date object.`);
  }
  const elapsedMins = (Date.now() - item[fieldKeys.issuedAt].getTime()) / (1000 * 60);
  const validForMins = sanitiseValidForMinsConfig(tokenValidMins);
  if (elapsedMins > validForMins) {
    return {
      success: false,
      code: 'TOKEN_EXPIRED'
    };
  }

  // Authenticated!
  return {
    success: true,
    item
  };
}

function getAuthTokenErrorMessage(_ref) {
  let {
    code
  } = _ref;
  switch (code) {
    case 'FAILURE':
      return 'Auth token redemption failed.';
    case 'TOKEN_EXPIRED':
      return 'The auth token provided has expired.';
    case 'TOKEN_REDEEMED':
      return 'Auth tokens are single use and the auth token provided has already been redeemed.';
  }
}

const errorCodes$1 = ['FAILURE', 'TOKEN_EXPIRED', 'TOKEN_REDEEMED'];
const PasswordResetRedemptionErrorCode = core.graphql.enum({
  name: 'PasswordResetRedemptionErrorCode',
  values: core.graphql.enumValues(errorCodes$1)
});
function getPasswordResetSchema(_ref) {
  let {
    listKey,
    identityField,
    secretField,
    gqlNames,
    passwordResetLink,
    passwordResetTokenSecretFieldImpl
  } = _ref;
  const getResult = name => core.graphql.object()({
    name,
    fields: {
      code: core.graphql.field({
        type: core.graphql.nonNull(PasswordResetRedemptionErrorCode)
      }),
      message: core.graphql.field({
        type: core.graphql.nonNull(core.graphql.String)
      })
    }
  });
  const ValidateItemPasswordResetTokenResult = getResult(gqlNames.ValidateItemPasswordResetTokenResult);
  const RedeemItemPasswordResetTokenResult = getResult(gqlNames.RedeemItemPasswordResetTokenResult);
  return {
    mutation: {
      [gqlNames.sendItemPasswordResetLink]: core.graphql.field({
        type: core.graphql.nonNull(core.graphql.Boolean),
        args: {
          [identityField]: core.graphql.arg({
            type: core.graphql.nonNull(core.graphql.String)
          })
        },
        async resolve(rootVal, _ref2, context) {
          let {
            [identityField]: identity
          } = _ref2;
          const dbItemAPI = context.sudo().db[listKey];
          const tokenType = 'passwordReset';
          const result = await createAuthToken(identityField, identity, dbItemAPI);

          // Update system state
          if (result.success) {
            // Save the token and related info back to the item
            const {
              token,
              itemId
            } = result;
            await dbItemAPI.updateOne({
              where: {
                id: `${itemId}`
              },
              data: {
                [`${tokenType}Token`]: token,
                [`${tokenType}IssuedAt`]: new Date().toISOString(),
                [`${tokenType}RedeemedAt`]: null
              }
            });
            await passwordResetLink.sendToken({
              itemId,
              identity,
              token,
              context
            });
          }
          return true;
        }
      }),
      [gqlNames.redeemItemPasswordResetToken]: core.graphql.field({
        type: RedeemItemPasswordResetTokenResult,
        args: {
          [identityField]: core.graphql.arg({
            type: core.graphql.nonNull(core.graphql.String)
          }),
          token: core.graphql.arg({
            type: core.graphql.nonNull(core.graphql.String)
          }),
          [secretField]: core.graphql.arg({
            type: core.graphql.nonNull(core.graphql.String)
          })
        },
        async resolve(rootVal, _ref3, context) {
          let {
            [identityField]: identity,
            token,
            [secretField]: secret
          } = _ref3;
          const dbItemAPI = context.sudo().db[listKey];
          const tokenType = 'passwordReset';
          const result = await validateAuthToken(listKey, passwordResetTokenSecretFieldImpl, tokenType, identityField, identity, passwordResetLink.tokensValidForMins, token, dbItemAPI);
          if (!result.success) {
            return {
              code: result.code,
              message: getAuthTokenErrorMessage({
                code: result.code
              })
            };
          }

          // Update system state
          const itemId = result.item.id;
          // Save the token and related info back to the item
          await dbItemAPI.updateOne({
            where: {
              id: itemId
            },
            data: {
              [`${tokenType}RedeemedAt`]: new Date().toISOString()
            }
          });

          // Save the provided secret. Do this as a separate step as password validation
          // may fail, in which case we still want to mark the token as redeemed
          // (NB: Is this *really* what we want? -TL)
          await dbItemAPI.updateOne({
            where: {
              id: itemId
            },
            data: {
              [secretField]: secret
            }
          });
          return null;
        }
      })
    },
    query: {
      [gqlNames.validateItemPasswordResetToken]: core.graphql.field({
        type: ValidateItemPasswordResetTokenResult,
        args: {
          [identityField]: core.graphql.arg({
            type: core.graphql.nonNull(core.graphql.String)
          }),
          token: core.graphql.arg({
            type: core.graphql.nonNull(core.graphql.String)
          })
        },
        async resolve(rootVal, _ref4, context) {
          let {
            [identityField]: identity,
            token
          } = _ref4;
          const dbItemAPI = context.sudo().db[listKey];
          const tokenType = 'passwordReset';
          const result = await validateAuthToken(listKey, passwordResetTokenSecretFieldImpl, tokenType, identityField, identity, passwordResetLink.tokensValidForMins, token, dbItemAPI);
          if (!result.success) {
            return {
              code: result.code,
              message: getAuthTokenErrorMessage({
                code: result.code
              })
            };
          }
          return null;
        }
      })
    }
  };
}

const errorCodes = ['FAILURE', 'TOKEN_EXPIRED', 'TOKEN_REDEEMED'];
const MagicLinkRedemptionErrorCode = core.graphql.enum({
  name: 'MagicLinkRedemptionErrorCode',
  values: core.graphql.enumValues(errorCodes)
});
function getMagicAuthLinkSchema(_ref) {
  let {
    listKey,
    identityField,
    gqlNames,
    magicAuthLink,
    magicAuthTokenSecretFieldImpl,
    base
  } = _ref;
  const RedeemItemMagicAuthTokenFailure = core.graphql.object()({
    name: gqlNames.RedeemItemMagicAuthTokenFailure,
    fields: {
      code: core.graphql.field({
        type: core.graphql.nonNull(MagicLinkRedemptionErrorCode)
      }),
      message: core.graphql.field({
        type: core.graphql.nonNull(core.graphql.String)
      })
    }
  });
  const RedeemItemMagicAuthTokenSuccess = core.graphql.object()({
    name: gqlNames.RedeemItemMagicAuthTokenSuccess,
    fields: {
      token: core.graphql.field({
        type: core.graphql.nonNull(core.graphql.String)
      }),
      item: core.graphql.field({
        type: core.graphql.nonNull(base.object(listKey))
      })
    }
  });
  const RedeemItemMagicAuthTokenResult = core.graphql.union({
    name: gqlNames.RedeemItemMagicAuthTokenResult,
    types: [RedeemItemMagicAuthTokenSuccess, RedeemItemMagicAuthTokenFailure],
    resolveType(val) {
      return 'token' in val ? gqlNames.RedeemItemMagicAuthTokenSuccess : gqlNames.RedeemItemMagicAuthTokenFailure;
    }
  });
  return {
    mutation: {
      [gqlNames.sendItemMagicAuthLink]: core.graphql.field({
        type: core.graphql.nonNull(core.graphql.Boolean),
        args: {
          [identityField]: core.graphql.arg({
            type: core.graphql.nonNull(core.graphql.String)
          })
        },
        async resolve(rootVal, _ref2, context) {
          let {
            [identityField]: identity
          } = _ref2;
          const dbItemAPI = context.sudo().db[listKey];
          const tokenType = 'magicAuth';
          const result = await createAuthToken(identityField, identity, dbItemAPI);

          // Update system state
          if (result.success) {
            // Save the token and related info back to the item
            const {
              token,
              itemId
            } = result;
            await dbItemAPI.updateOne({
              where: {
                id: `${itemId}`
              },
              data: {
                [`${tokenType}Token`]: token,
                [`${tokenType}IssuedAt`]: new Date().toISOString(),
                [`${tokenType}RedeemedAt`]: null
              }
            });
            await magicAuthLink.sendToken({
              itemId,
              identity,
              token,
              context
            });
          }
          return true;
        }
      }),
      [gqlNames.redeemItemMagicAuthToken]: core.graphql.field({
        type: core.graphql.nonNull(RedeemItemMagicAuthTokenResult),
        args: {
          [identityField]: core.graphql.arg({
            type: core.graphql.nonNull(core.graphql.String)
          }),
          token: core.graphql.arg({
            type: core.graphql.nonNull(core.graphql.String)
          })
        },
        async resolve(rootVal, _ref3, context) {
          let {
            [identityField]: identity,
            token
          } = _ref3;
          if (!context.sessionStrategy) {
            throw new Error('No session implementation available on context');
          }
          const dbItemAPI = context.sudo().db[listKey];
          const tokenType = 'magicAuth';
          const result = await validateAuthToken(listKey, magicAuthTokenSecretFieldImpl, tokenType, identityField, identity, magicAuthLink.tokensValidForMins, token, dbItemAPI);
          if (!result.success) {
            return {
              code: result.code,
              message: getAuthTokenErrorMessage({
                code: result.code
              })
            };
          }
          // Update system state
          // Save the token and related info back to the item
          await dbItemAPI.updateOne({
            where: {
              id: result.item.id
            },
            data: {
              [`${tokenType}RedeemedAt`]: new Date().toISOString()
            }
          });
          const sessionToken = await context.sessionStrategy.start({
            data: {
              listKey,
              itemId: result.item.id.toString()
            },
            context
          });
          return {
            token: sessionToken,
            item: result.item
          };
        }
      })
    }
  };
}

function assertSecretFieldImpl(impl, listKey, secretField) {
  if (!impl || typeof impl.compare !== 'function' || impl.compare.length < 2 || typeof impl.generateHash !== 'function') {
    const s = JSON.stringify(secretField);
    let msg = `A createAuth() invocation for the "${listKey}" list specifies ${s} as its secretField, but the field type doesn't implement the required functionality.`;
    throw new Error(msg);
  }
}
function getSecretFieldImpl(schema, listKey, fieldKey) {
  var _gqlOutputType$getFie, _gqlOutputType$getFie2;
  const gqlOutputType = graphql.assertObjectType(schema.getType(listKey));
  const secretFieldImpl = (_gqlOutputType$getFie = gqlOutputType.getFields()) === null || _gqlOutputType$getFie === void 0 ? void 0 : (_gqlOutputType$getFie2 = _gqlOutputType$getFie[fieldKey].extensions) === null || _gqlOutputType$getFie2 === void 0 ? void 0 : _gqlOutputType$getFie2.keystoneSecretField;
  assertSecretFieldImpl(secretFieldImpl, listKey, fieldKey);
  return secretFieldImpl;
}
const getSchemaExtension = _ref => {
  let {
    identityField,
    listKey,
    secretField,
    gqlNames,
    initFirstItem,
    passwordResetLink,
    magicAuthLink,
    sessionData
  } = _ref;
  return core.graphql.extend(base => {
    const uniqueWhereInputType = graphql.assertInputObjectType(base.schema.getType(`${listKey}WhereUniqueInput`));
    const identityFieldOnUniqueWhere = uniqueWhereInputType.getFields()[identityField];
    if ((identityFieldOnUniqueWhere === null || identityFieldOnUniqueWhere === void 0 ? void 0 : identityFieldOnUniqueWhere.type) !== graphql.GraphQLString && (identityFieldOnUniqueWhere === null || identityFieldOnUniqueWhere === void 0 ? void 0 : identityFieldOnUniqueWhere.type) !== graphql.GraphQLID) {
      throw new Error(`createAuth was called with an identityField of ${identityField} on the list ${listKey} ` + `but that field doesn't allow being searched uniquely with a String or ID. ` + `You should likely add \`isIndexed: 'unique'\` ` + `to the field at ${listKey}.${identityField}`);
    }
    const baseSchema = getBaseAuthSchema({
      identityField,
      listKey,
      secretField,
      gqlNames,
      secretFieldImpl: getSecretFieldImpl(base.schema, listKey, secretField),
      base
    });

    // technically this will incorrectly error if someone has a schema extension that adds a field to the list output type
    // and then wants to fetch that field with `sessionData` but it's extremely unlikely someone will do that since if
    // they want to add a GraphQL field, they'll probably use a virtual field
    const query = `query($id: ID!) { ${types.getGqlNames({
      listKey,
      // this isn't used to get the itemQueryName and we don't know it here
      pluralGraphQLName: ''
    }).itemQueryName}(where: { id: $id }) { ${sessionData} } }`;
    let ast;
    try {
      ast = graphql.parse(query);
    } catch (err) {
      throw new Error(`The query to get session data has a syntax error, the sessionData option in your createAuth usage is likely incorrect\n${err}`);
    }
    const errors = graphql.validate(base.schema, ast);
    if (errors.length) {
      throw new Error(`The query to get session data has validation errors, the sessionData option in your createAuth usage is likely incorrect\n${errors.join('\n')}`);
    }
    return [baseSchema.extension, initFirstItem && getInitFirstItemSchema({
      listKey,
      fields: initFirstItem.fields,
      itemData: initFirstItem.itemData,
      gqlNames,
      graphQLSchema: base.schema,
      ItemAuthenticationWithPasswordSuccess: baseSchema.ItemAuthenticationWithPasswordSuccess
    }), passwordResetLink && getPasswordResetSchema({
      identityField,
      listKey,
      secretField,
      passwordResetLink,
      gqlNames,
      passwordResetTokenSecretFieldImpl: getSecretFieldImpl(base.schema, listKey, 'passwordResetToken')
    }), magicAuthLink && getMagicAuthLinkSchema({
      identityField,
      listKey,
      magicAuthLink,
      gqlNames,
      magicAuthTokenSecretFieldImpl: getSecretFieldImpl(base.schema, listKey, 'magicAuthToken'),
      base
    })].filter(x => x !== undefined);
  });
};

const signinTemplate = _ref => {
  let {
    gqlNames,
    identityField,
    secretField
  } = _ref;
  // -- TEMPLATE START
  return `import { getSigninPage } from '@keystone-6/auth/pages/SigninPage'

export default getSigninPage(${JSON.stringify({
    identityField: identityField,
    secretField: secretField,
    mutationName: gqlNames.authenticateItemWithPassword,
    successTypename: gqlNames.ItemAuthenticationWithPasswordSuccess,
    failureTypename: gqlNames.ItemAuthenticationWithPasswordFailure
  })});
`;
  // -- TEMPLATE END
};

const initTemplate = _ref => {
  let {
    listKey,
    initFirstItem
  } = _ref;
  // -- TEMPLATE START
  return `import { getInitPage } from '@keystone-6/auth/pages/InitPage';

const fieldPaths = ${JSON.stringify(initFirstItem.fields)};

export default getInitPage(${JSON.stringify({
    listKey,
    fieldPaths: initFirstItem.fields,
    enableWelcome: !initFirstItem.skipKeystoneWelcome
  })});
`;
  // -- TEMPLATE END
};

const _excluded = ["get"];

/**
 * createAuth function
 *
 * Generates config for Keystone to implement standard auth features.
 */
function createAuth(_ref) {
  let {
    listKey,
    secretField,
    initFirstItem,
    identityField,
    magicAuthLink,
    passwordResetLink,
    sessionData = 'id'
  } = _ref;
  const gqlNames = {
    // Core
    authenticateItemWithPassword: `authenticate${listKey}WithPassword`,
    ItemAuthenticationWithPasswordResult: `${listKey}AuthenticationWithPasswordResult`,
    ItemAuthenticationWithPasswordSuccess: `${listKey}AuthenticationWithPasswordSuccess`,
    ItemAuthenticationWithPasswordFailure: `${listKey}AuthenticationWithPasswordFailure`,
    // Initial data
    CreateInitialInput: `CreateInitial${listKey}Input`,
    createInitialItem: `createInitial${listKey}`,
    // Password reset
    sendItemPasswordResetLink: `send${listKey}PasswordResetLink`,
    SendItemPasswordResetLinkResult: `Send${listKey}PasswordResetLinkResult`,
    validateItemPasswordResetToken: `validate${listKey}PasswordResetToken`,
    ValidateItemPasswordResetTokenResult: `Validate${listKey}PasswordResetTokenResult`,
    redeemItemPasswordResetToken: `redeem${listKey}PasswordResetToken`,
    RedeemItemPasswordResetTokenResult: `Redeem${listKey}PasswordResetTokenResult`,
    // Magic auth
    sendItemMagicAuthLink: `send${listKey}MagicAuthLink`,
    SendItemMagicAuthLinkResult: `Send${listKey}MagicAuthLinkResult`,
    redeemItemMagicAuthToken: `redeem${listKey}MagicAuthToken`,
    RedeemItemMagicAuthTokenResult: `Redeem${listKey}MagicAuthTokenResult`,
    RedeemItemMagicAuthTokenSuccess: `Redeem${listKey}MagicAuthTokenSuccess`,
    RedeemItemMagicAuthTokenFailure: `Redeem${listKey}MagicAuthTokenFailure`
  };

  /**
   * fields
   *
   * Fields added to the auth list.
   */
  const fieldConfig = {
    access: () => false,
    ui: {
      createView: {
        fieldMode: 'hidden'
      },
      itemView: {
        fieldMode: 'hidden'
      },
      listView: {
        fieldMode: 'hidden'
      }
    }
  };
  // These field names have to follow this format so that for e.g
  // validateAuthToken() behaves correctly.
  const tokenFields = tokenType => ({
    [`${tokenType}Token`]: fields.password(_objectSpread({}, fieldConfig)),
    [`${tokenType}IssuedAt`]: fields.timestamp(_objectSpread({}, fieldConfig)),
    [`${tokenType}RedeemedAt`]: fields.timestamp(_objectSpread({}, fieldConfig))
  });
  const fields$1 = _objectSpread(_objectSpread({}, passwordResetLink && tokenFields('passwordReset')), magicAuthLink && tokenFields('magicAuth'));

  /**
   * getAdditionalFiles
   *
   * This function adds files to be generated into the Admin UI build. Must be added to the
   * ui.getAdditionalFiles config.
   *
   * The signin page is always included, and the init page is included when initFirstItem is set
   */
  const authGetAdditionalFiles = () => {
    const filesToWrite = [{
      mode: 'write',
      src: signinTemplate({
        gqlNames,
        identityField,
        secretField
      }),
      outputPath: 'pages/signin.js'
    }];
    if (initFirstItem) {
      filesToWrite.push({
        mode: 'write',
        src: initTemplate({
          listKey,
          initFirstItem
        }),
        outputPath: 'pages/init.js'
      });
    }
    return filesToWrite;
  };

  /**
   * publicAuthPages
   *
   * Must be added to the ui.publicPages config
   */
  const authPublicPages = ['/signin'];

  /**
   * extendGraphqlSchema
   *
   * Must be added to the extendGraphqlSchema config. Can be composed.
   */
  const extendGraphqlSchema = getSchemaExtension({
    identityField,
    listKey,
    secretField,
    gqlNames,
    initFirstItem,
    passwordResetLink,
    magicAuthLink,
    sessionData
  });

  /**
   * validateConfig
   *
   * Validates the provided auth config; optional step when integrating auth
   */
  const validateConfig = keystoneConfig => {
    const listConfig = keystoneConfig.lists[listKey];
    if (listConfig === undefined) {
      const msg = `A createAuth() invocation specifies the list "${listKey}" but no list with that key has been defined.`;
      throw new Error(msg);
    }

    // TODO: Check for String-like typing for identityField? How?
    // TODO: Validate that the identifyField is unique.
    // TODO: If this field isn't required, what happens if I try to log in as `null`?
    const identityFieldConfig = listConfig.fields[identityField];
    if (identityFieldConfig === undefined) {
      const i = JSON.stringify(identityField);
      const msg = `A createAuth() invocation for the "${listKey}" list specifies ${i} as its identityField but no field with that key exists on the list.`;
      throw new Error(msg);
    }

    // TODO: We could make the secret field optional to disable the standard id/secret auth and password resets (ie. magic links only)
    const secretFieldConfig = listConfig.fields[secretField];
    if (secretFieldConfig === undefined) {
      const s = JSON.stringify(secretField);
      const msg = `A createAuth() invocation for the "${listKey}" list specifies ${s} as its secretField but no field with that key exists on the list.`;
      throw new Error(msg);
    }

    // TODO: Could also validate initFirstItem.itemData keys?
    for (const field of (initFirstItem === null || initFirstItem === void 0 ? void 0 : initFirstItem.fields) || []) {
      if (listConfig.fields[field] === undefined) {
        const f = JSON.stringify(field);
        const msg = `A createAuth() invocation for the "${listKey}" list specifies the field ${f} in initFirstItem.fields array but no field with that key exist on the list.`;
        throw new Error(msg);
      }
    }
  };

  /**
   * withItemData
   *
   * Automatically injects a session.data value with the authenticated item
   */
  const withItemData = _sessionStrategy => {
    const {
        get
      } = _sessionStrategy,
      sessionStrategy = _objectWithoutProperties(_sessionStrategy, _excluded);
    return _objectSpread(_objectSpread({}, sessionStrategy), {}, {
      get: async _ref2 => {
        let {
          context
        } = _ref2;
        const session = await get({
          context
        });
        const sudoContext = context.sudo();
        if (!session || !session.listKey || session.listKey !== listKey || !session.itemId || !sudoContext.query[session.listKey]) {
          return;
        }
        try {
          const data = await sudoContext.query[listKey].findOne({
            where: {
              id: session.itemId
            },
            query: sessionData
          });
          if (!data) return;
          return _objectSpread(_objectSpread({}, session), {}, {
            itemId: session.itemId,
            listKey,
            data
          });
        } catch (e) {
          // TODO: the assumption is this should only be from an invalid sessionData configuration
          //   it could be something else though, either way, result is a bad session
          return;
        }
      }
    });
  };
  async function hasInitFirstItemConditions(context) {
    // do nothing if they aren't using this feature
    if (!initFirstItem) return false;

    // if they have a session, there is no initialisation necessary
    if (context.session) return false;
    const count = await context.sudo().db[listKey].count({});
    return count === 0;
  }
  async function authMiddleware(_ref3) {
    let {
      context,
      isValidSession: wasAccessAllowed
    } = _ref3;
    const {
      req
    } = context;
    const {
      pathname
    } = new URL(req.url, 'http://_');

    // redirect to init if initFirstItem conditions are met
    if (pathname !== '/init' && (await hasInitFirstItemConditions(context))) {
      return {
        kind: 'redirect',
        to: '/init'
      };
    }

    // redirect to / if attempting to /init and initFirstItem conditions are not met
    if (pathname === '/init' && !(await hasInitFirstItemConditions(context))) {
      return {
        kind: 'redirect',
        to: '/'
      };
    }

    // don't redirect if we have access
    if (wasAccessAllowed) return;

    // otherwise, redirect to signin
    if (pathname === '/') return {
      kind: 'redirect',
      to: '/signin'
    };
    return {
      kind: 'redirect',
      to: `/signin?from=${encodeURIComponent(req.url)}`
    };
  }
  function defaultIsAccessAllowed(_ref4) {
    let {
      session,
      sessionStrategy
    } = _ref4;
    return session !== undefined;
  }

  /**
   * withAuth
   *
   * Automatically extends your configuration with a prescriptive implementation.
   */
  const withAuth = keystoneConfig => {
    var _ui;
    validateConfig(keystoneConfig);
    let {
      ui
    } = keystoneConfig;
    if (!((_ui = ui) !== null && _ui !== void 0 && _ui.isDisabled)) {
      const {
        getAdditionalFiles = [],
        isAccessAllowed = defaultIsAccessAllowed,
        pageMiddleware,
        publicPages = []
      } = ui || {};
      ui = _objectSpread(_objectSpread({}, ui), {}, {
        publicPages: [...publicPages, ...authPublicPages],
        getAdditionalFiles: [...getAdditionalFiles, authGetAdditionalFiles],
        isAccessAllowed: async context => {
          if (await hasInitFirstItemConditions(context)) return true;
          return isAccessAllowed(context);
        },
        pageMiddleware: async args => {
          const shouldRedirect = await authMiddleware(args);
          if (shouldRedirect) return shouldRedirect;
          return pageMiddleware === null || pageMiddleware === void 0 ? void 0 : pageMiddleware(args);
        }
      });
    }
    if (!keystoneConfig.session) throw new TypeError('Missing .session configuration');
    const session = withItemData(keystoneConfig.session);
    const existingExtendGraphQLSchema = keystoneConfig.extendGraphqlSchema;
    const listConfig = keystoneConfig.lists[listKey];
    return _objectSpread(_objectSpread({}, keystoneConfig), {}, {
      ui,
      session,
      lists: _objectSpread(_objectSpread({}, keystoneConfig.lists), {}, {
        [listKey]: _objectSpread(_objectSpread({}, listConfig), {}, {
          fields: _objectSpread(_objectSpread({}, listConfig.fields), fields$1)
        })
      }),
      extendGraphqlSchema: existingExtendGraphQLSchema ? schema => existingExtendGraphQLSchema(extendGraphqlSchema(schema)) : extendGraphqlSchema
    });
  };
  return {
    withAuth
  };
}

exports.createAuth = createAuth;
