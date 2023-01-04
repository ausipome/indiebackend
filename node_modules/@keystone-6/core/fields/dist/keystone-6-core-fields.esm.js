import _objectSpread from '@babel/runtime/helpers/esm/objectSpread2';
import _objectWithoutProperties from '@babel/runtime/helpers/esm/objectWithoutProperties';
import { u as userInputError } from '../../dist/graphql-errors-e6d55894.esm.js';
import { Q as QueryMode, f as fieldType, o as orderDirectionEnum } from '../../dist/next-fields-d3605624.esm.js';
import { D as DateTime$3, a as Decimal$3, B as BigInt$3, f as field, U as Upload, J as JSON$1, C as CalendarDay } from '../../dist/graphql-ts-schema-9020a95a.esm.js';
import { inputObject, arg, list, nonNull, String as String$3, Boolean as Boolean$3, Int as Int$3, Float as Float$3, enum as enum$1, enumValues, ID } from '@graphql-ts/schema/api-without-context';
import { h as humanize } from '../../dist/utils-e5778e55.esm.js';
import Decimal$4 from 'decimal.js';
import { object } from '@graphql-ts/schema/api-with-context';
import { SUPPORTED_IMAGE_EXTENSIONS } from '../types/image/utils/dist/keystone-6-core-fields-types-image-utils.esm.js';
import { j as jsonFieldTypePolyfilledForSQLite } from '../../dist/json-field-type-polyfill-for-sqlite-9b687746.esm.js';
import bcryptjs from 'bcryptjs';
import dumbPasswords from 'dumb-passwords';
import { g as getAdminMetaForRelationshipField } from '../../dist/createAdminMeta-6f70c326.esm.js';
import inflection from 'inflection';
import { getNamedType, isLeafType } from 'graphql';
import { g as getGqlNames } from '../../dist/core-c6bc4160.esm.js';
import 'apollo-server-errors';
import '@graphql-ts/schema';
import 'graphql-upload/GraphQLUpload.js';
import '@graphql-ts/extend';
import 'path';

function hasReadAccessControl(access) {
  if (access === undefined) {
    return false;
  }
  return typeof access === 'function' || typeof access.read === 'function';
}
function hasCreateAccessControl(access) {
  if (access === undefined) {
    return false;
  }
  return typeof access === 'function' || typeof access.create === 'function';
}
function getResolvedIsNullable(validation, db) {
  if ((db === null || db === void 0 ? void 0 : db.isNullable) === false) {
    return false;
  }
  if ((db === null || db === void 0 ? void 0 : db.isNullable) === undefined && validation !== null && validation !== void 0 && validation.isRequired) {
    return false;
  }
  return true;
}
function assertReadIsNonNullAllowed(meta, config, resolvedIsNullable) {
  var _config$graphql, _config$graphql$read;
  if ((_config$graphql = config.graphql) !== null && _config$graphql !== void 0 && (_config$graphql$read = _config$graphql.read) !== null && _config$graphql$read !== void 0 && _config$graphql$read.isNonNull) {
    if (resolvedIsNullable) {
      throw new Error(`The field at ${meta.listKey}.${meta.fieldKey} sets graphql.read.isNonNull: true but not validation.isRequired: true or db.isNullable: false.\n` + `Set validation.isRequired: true or db.isNullable: false or disable graphql.read.isNonNull`);
    }
    if (hasReadAccessControl(config.access)) {
      throw new Error(`The field at ${meta.listKey}.${meta.fieldKey} sets graphql.read.isNonNull: true and has read access control, this is not allowed.\n` + 'Either disable graphql.read.isNonNull or read access control.');
    }
  }
}
function assertCreateIsNonNullAllowed(meta, config) {
  var _config$graphql2, _config$graphql2$crea;
  if ((_config$graphql2 = config.graphql) !== null && _config$graphql2 !== void 0 && (_config$graphql2$crea = _config$graphql2.create) !== null && _config$graphql2$crea !== void 0 && _config$graphql2$crea.isNonNull && hasCreateAccessControl(config.access)) {
    throw new Error(`The field at ${meta.listKey}.${meta.fieldKey} sets graphql.create.isNonNull: true and has create access control, this is not allowed.\n` + 'Either disable graphql.create.isNonNull or create access control.');
  }
}

// yes, these two types have the fields but they're semantically different types
// (even though, yes, having EnumFilter by defined as EnumNullableFilter<Enum>, would be the same type but names would show up differently in editors for example)

function enumFilters(enumType) {
  const optional = inputObject({
    name: `${enumType.graphQLType.name}NullableFilter`,
    fields: () => ({
      equals: arg({
        type: enumType
      }),
      in: arg({
        type: list(nonNull(enumType))
      }),
      notIn: arg({
        type: list(nonNull(enumType))
      }),
      not: arg({
        type: optional
      })
    })
  });
  const required = inputObject({
    name: `${enumType.graphQLType.name}Filter`,
    fields: () => ({
      equals: arg({
        type: enumType
      }),
      in: arg({
        type: list(nonNull(enumType))
      }),
      notIn: arg({
        type: list(nonNull(enumType))
      }),
      not: arg({
        type: optional
      })
    })
  });
  const many = inputObject({
    name: `${enumType.graphQLType.name}NullableListFilter`,
    fields: () => ({
      // can be null
      equals: arg({
        type: list(nonNull(enumType))
      }),
      // can be null
      has: arg({
        type: enumType
      }),
      hasEvery: arg({
        type: list(nonNull(enumType))
      }),
      hasSome: arg({
        type: list(nonNull(enumType))
      }),
      isEmpty: arg({
        type: enumType
      })
    })
  });
  return {
    optional,
    required,
    many
  };
}

// Do not manually modify this file, it is automatically generated by the package at /prisma-utils in this repo.
const StringNullableFilter$2 = inputObject({
  name: 'StringNullableFilter',
  fields: () => ({
    // can be null
    equals: arg({
      type: String$3
    }),
    // can be null
    in: arg({
      type: list(nonNull(String$3))
    }),
    // can be null
    notIn: arg({
      type: list(nonNull(String$3))
    }),
    lt: arg({
      type: String$3
    }),
    lte: arg({
      type: String$3
    }),
    gt: arg({
      type: String$3
    }),
    gte: arg({
      type: String$3
    }),
    contains: arg({
      type: String$3
    }),
    startsWith: arg({
      type: String$3
    }),
    endsWith: arg({
      type: String$3
    }),
    mode: arg({
      type: QueryMode
    }),
    // can be null
    not: arg({
      type: NestedStringNullableFilter$2
    })
  })
});
const NestedStringNullableFilter$2 = inputObject({
  name: 'NestedStringNullableFilter',
  fields: () => ({
    // can be null
    equals: arg({
      type: String$3
    }),
    // can be null
    in: arg({
      type: list(nonNull(String$3))
    }),
    // can be null
    notIn: arg({
      type: list(nonNull(String$3))
    }),
    lt: arg({
      type: String$3
    }),
    lte: arg({
      type: String$3
    }),
    gt: arg({
      type: String$3
    }),
    gte: arg({
      type: String$3
    }),
    contains: arg({
      type: String$3
    }),
    startsWith: arg({
      type: String$3
    }),
    endsWith: arg({
      type: String$3
    }),
    // can be null
    not: arg({
      type: NestedStringNullableFilter$2
    })
  })
});
const StringFilter$2 = inputObject({
  name: 'StringFilter',
  fields: () => ({
    equals: arg({
      type: String$3
    }),
    in: arg({
      type: list(nonNull(String$3))
    }),
    notIn: arg({
      type: list(nonNull(String$3))
    }),
    lt: arg({
      type: String$3
    }),
    lte: arg({
      type: String$3
    }),
    gt: arg({
      type: String$3
    }),
    gte: arg({
      type: String$3
    }),
    contains: arg({
      type: String$3
    }),
    startsWith: arg({
      type: String$3
    }),
    endsWith: arg({
      type: String$3
    }),
    mode: arg({
      type: QueryMode
    }),
    not: arg({
      type: NestedStringFilter$2
    })
  })
});
const NestedStringFilter$2 = inputObject({
  name: 'NestedStringFilter',
  fields: () => ({
    equals: arg({
      type: String$3
    }),
    in: arg({
      type: list(nonNull(String$3))
    }),
    notIn: arg({
      type: list(nonNull(String$3))
    }),
    lt: arg({
      type: String$3
    }),
    lte: arg({
      type: String$3
    }),
    gt: arg({
      type: String$3
    }),
    gte: arg({
      type: String$3
    }),
    contains: arg({
      type: String$3
    }),
    startsWith: arg({
      type: String$3
    }),
    endsWith: arg({
      type: String$3
    }),
    not: arg({
      type: NestedStringFilter$2
    })
  })
});
const StringNullableListFilter = inputObject({
  name: 'StringNullableListFilter',
  fields: () => ({
    // can be null
    equals: arg({
      type: list(nonNull(String$3))
    }),
    // can be null
    has: arg({
      type: String$3
    }),
    hasEvery: arg({
      type: list(nonNull(String$3))
    }),
    hasSome: arg({
      type: list(nonNull(String$3))
    }),
    isEmpty: arg({
      type: Boolean$3
    })
  })
});
const BoolNullableFilter$2 = inputObject({
  name: 'BooleanNullableFilter',
  fields: () => ({
    // can be null
    equals: arg({
      type: Boolean$3
    }),
    // can be null
    not: arg({
      type: BoolNullableFilter$2
    })
  })
});
const BoolFilter$2 = inputObject({
  name: 'BooleanFilter',
  fields: () => ({
    equals: arg({
      type: Boolean$3
    }),
    not: arg({
      type: BoolFilter$2
    })
  })
});
const BoolNullableListFilter = inputObject({
  name: 'BooleanNullableListFilter',
  fields: () => ({
    // can be null
    equals: arg({
      type: list(nonNull(Boolean$3))
    }),
    // can be null
    has: arg({
      type: Boolean$3
    }),
    hasEvery: arg({
      type: list(nonNull(Boolean$3))
    }),
    hasSome: arg({
      type: list(nonNull(Boolean$3))
    }),
    isEmpty: arg({
      type: Boolean$3
    })
  })
});
const IntNullableFilter$2 = inputObject({
  name: 'IntNullableFilter',
  fields: () => ({
    // can be null
    equals: arg({
      type: Int$3
    }),
    // can be null
    in: arg({
      type: list(nonNull(Int$3))
    }),
    // can be null
    notIn: arg({
      type: list(nonNull(Int$3))
    }),
    lt: arg({
      type: Int$3
    }),
    lte: arg({
      type: Int$3
    }),
    gt: arg({
      type: Int$3
    }),
    gte: arg({
      type: Int$3
    }),
    // can be null
    not: arg({
      type: IntNullableFilter$2
    })
  })
});
const IntFilter$2 = inputObject({
  name: 'IntFilter',
  fields: () => ({
    equals: arg({
      type: Int$3
    }),
    in: arg({
      type: list(nonNull(Int$3))
    }),
    notIn: arg({
      type: list(nonNull(Int$3))
    }),
    lt: arg({
      type: Int$3
    }),
    lte: arg({
      type: Int$3
    }),
    gt: arg({
      type: Int$3
    }),
    gte: arg({
      type: Int$3
    }),
    not: arg({
      type: IntFilter$2
    })
  })
});
const IntNullableListFilter = inputObject({
  name: 'IntNullableListFilter',
  fields: () => ({
    // can be null
    equals: arg({
      type: list(nonNull(Int$3))
    }),
    // can be null
    has: arg({
      type: Int$3
    }),
    hasEvery: arg({
      type: list(nonNull(Int$3))
    }),
    hasSome: arg({
      type: list(nonNull(Int$3))
    }),
    isEmpty: arg({
      type: Boolean$3
    })
  })
});
const FloatNullableFilter$2 = inputObject({
  name: 'FloatNullableFilter',
  fields: () => ({
    // can be null
    equals: arg({
      type: Float$3
    }),
    // can be null
    in: arg({
      type: list(nonNull(Float$3))
    }),
    // can be null
    notIn: arg({
      type: list(nonNull(Float$3))
    }),
    lt: arg({
      type: Float$3
    }),
    lte: arg({
      type: Float$3
    }),
    gt: arg({
      type: Float$3
    }),
    gte: arg({
      type: Float$3
    }),
    // can be null
    not: arg({
      type: FloatNullableFilter$2
    })
  })
});
const FloatFilter$2 = inputObject({
  name: 'FloatFilter',
  fields: () => ({
    equals: arg({
      type: Float$3
    }),
    in: arg({
      type: list(nonNull(Float$3))
    }),
    notIn: arg({
      type: list(nonNull(Float$3))
    }),
    lt: arg({
      type: Float$3
    }),
    lte: arg({
      type: Float$3
    }),
    gt: arg({
      type: Float$3
    }),
    gte: arg({
      type: Float$3
    }),
    not: arg({
      type: FloatFilter$2
    })
  })
});
const FloatNullableListFilter = inputObject({
  name: 'FloatNullableListFilter',
  fields: () => ({
    // can be null
    equals: arg({
      type: list(nonNull(Float$3))
    }),
    // can be null
    has: arg({
      type: Float$3
    }),
    hasEvery: arg({
      type: list(nonNull(Float$3))
    }),
    hasSome: arg({
      type: list(nonNull(Float$3))
    }),
    isEmpty: arg({
      type: Boolean$3
    })
  })
});
const DateTimeNullableFilter$2 = inputObject({
  name: 'DateTimeNullableFilter',
  fields: () => ({
    // can be null
    equals: arg({
      type: DateTime$3
    }),
    // can be null
    in: arg({
      type: list(nonNull(DateTime$3))
    }),
    // can be null
    notIn: arg({
      type: list(nonNull(DateTime$3))
    }),
    lt: arg({
      type: DateTime$3
    }),
    lte: arg({
      type: DateTime$3
    }),
    gt: arg({
      type: DateTime$3
    }),
    gte: arg({
      type: DateTime$3
    }),
    // can be null
    not: arg({
      type: DateTimeNullableFilter$2
    })
  })
});
const DateTimeFilter$2 = inputObject({
  name: 'DateTimeFilter',
  fields: () => ({
    equals: arg({
      type: DateTime$3
    }),
    in: arg({
      type: list(nonNull(DateTime$3))
    }),
    notIn: arg({
      type: list(nonNull(DateTime$3))
    }),
    lt: arg({
      type: DateTime$3
    }),
    lte: arg({
      type: DateTime$3
    }),
    gt: arg({
      type: DateTime$3
    }),
    gte: arg({
      type: DateTime$3
    }),
    not: arg({
      type: DateTimeFilter$2
    })
  })
});
const DateTimeNullableListFilter = inputObject({
  name: 'DateTimeNullableListFilter',
  fields: () => ({
    // can be null
    equals: arg({
      type: list(nonNull(DateTime$3))
    }),
    // can be null
    has: arg({
      type: DateTime$3
    }),
    hasEvery: arg({
      type: list(nonNull(DateTime$3))
    }),
    hasSome: arg({
      type: list(nonNull(DateTime$3))
    }),
    isEmpty: arg({
      type: Boolean$3
    })
  })
});
const DecimalNullableFilter$2 = inputObject({
  name: 'DecimalNullableFilter',
  fields: () => ({
    // can be null
    equals: arg({
      type: Decimal$3
    }),
    // can be null
    in: arg({
      type: list(nonNull(Decimal$3))
    }),
    // can be null
    notIn: arg({
      type: list(nonNull(Decimal$3))
    }),
    lt: arg({
      type: Decimal$3
    }),
    lte: arg({
      type: Decimal$3
    }),
    gt: arg({
      type: Decimal$3
    }),
    gte: arg({
      type: Decimal$3
    }),
    // can be null
    not: arg({
      type: DecimalNullableFilter$2
    })
  })
});
const DecimalFilter$2 = inputObject({
  name: 'DecimalFilter',
  fields: () => ({
    equals: arg({
      type: Decimal$3
    }),
    in: arg({
      type: list(nonNull(Decimal$3))
    }),
    notIn: arg({
      type: list(nonNull(Decimal$3))
    }),
    lt: arg({
      type: Decimal$3
    }),
    lte: arg({
      type: Decimal$3
    }),
    gt: arg({
      type: Decimal$3
    }),
    gte: arg({
      type: Decimal$3
    }),
    not: arg({
      type: DecimalFilter$2
    })
  })
});
const DecimalNullableListFilter = inputObject({
  name: 'DecimalNullableListFilter',
  fields: () => ({
    // can be null
    equals: arg({
      type: list(nonNull(Decimal$3))
    }),
    // can be null
    has: arg({
      type: Decimal$3
    }),
    hasEvery: arg({
      type: list(nonNull(Decimal$3))
    }),
    hasSome: arg({
      type: list(nonNull(Decimal$3))
    }),
    isEmpty: arg({
      type: Boolean$3
    })
  })
});
const BigIntNullableFilter$2 = inputObject({
  name: 'BigIntNullableFilter',
  fields: () => ({
    // can be null
    equals: arg({
      type: BigInt$3
    }),
    // can be null
    in: arg({
      type: list(nonNull(BigInt$3))
    }),
    // can be null
    notIn: arg({
      type: list(nonNull(BigInt$3))
    }),
    lt: arg({
      type: BigInt$3
    }),
    lte: arg({
      type: BigInt$3
    }),
    gt: arg({
      type: BigInt$3
    }),
    gte: arg({
      type: BigInt$3
    }),
    // can be null
    not: arg({
      type: BigIntNullableFilter$2
    })
  })
});
const BigIntFilter$2 = inputObject({
  name: 'BigIntFilter',
  fields: () => ({
    equals: arg({
      type: BigInt$3
    }),
    in: arg({
      type: list(nonNull(BigInt$3))
    }),
    notIn: arg({
      type: list(nonNull(BigInt$3))
    }),
    lt: arg({
      type: BigInt$3
    }),
    lte: arg({
      type: BigInt$3
    }),
    gt: arg({
      type: BigInt$3
    }),
    gte: arg({
      type: BigInt$3
    }),
    not: arg({
      type: BigIntFilter$2
    })
  })
});
const BigIntNullableListFilter = inputObject({
  name: 'BigIntNullableListFilter',
  fields: () => ({
    // can be null
    equals: arg({
      type: list(nonNull(BigInt$3))
    }),
    // can be null
    has: arg({
      type: BigInt$3
    }),
    hasEvery: arg({
      type: list(nonNull(BigInt$3))
    }),
    hasSome: arg({
      type: list(nonNull(BigInt$3))
    }),
    isEmpty: arg({
      type: Boolean$3
    })
  })
});
const String$2 = {
  optional: StringNullableFilter$2,
  required: StringFilter$2,
  many: StringNullableListFilter
};
const Boolean$2 = {
  optional: BoolNullableFilter$2,
  required: BoolFilter$2,
  many: BoolNullableListFilter
};
const Int$2 = {
  optional: IntNullableFilter$2,
  required: IntFilter$2,
  many: IntNullableListFilter
};
const Float$2 = {
  optional: FloatNullableFilter$2,
  required: FloatFilter$2,
  many: FloatNullableListFilter
};
const DateTime$2 = {
  optional: DateTimeNullableFilter$2,
  required: DateTimeFilter$2,
  many: DateTimeNullableListFilter
};
const Decimal$2 = {
  optional: DecimalNullableFilter$2,
  required: DecimalFilter$2,
  many: DecimalNullableListFilter
};
const BigInt$2 = {
  optional: BigIntNullableFilter$2,
  required: BigIntFilter$2,
  many: BigIntNullableListFilter
};

var postgresql = /*#__PURE__*/Object.freeze({
  __proto__: null,
  String: String$2,
  Boolean: Boolean$2,
  Int: Int$2,
  Float: Float$2,
  DateTime: DateTime$2,
  Decimal: Decimal$2,
  BigInt: BigInt$2,
  'enum': enumFilters
});

// Do not manually modify this file, it is automatically generated by the package at /prisma-utils in this repo.
const StringNullableFilter$1 = inputObject({
  name: 'StringNullableFilter',
  fields: () => ({
    // can be null
    equals: arg({
      type: String$3
    }),
    // can be null
    in: arg({
      type: list(nonNull(String$3))
    }),
    // can be null
    notIn: arg({
      type: list(nonNull(String$3))
    }),
    lt: arg({
      type: String$3
    }),
    lte: arg({
      type: String$3
    }),
    gt: arg({
      type: String$3
    }),
    gte: arg({
      type: String$3
    }),
    contains: arg({
      type: String$3
    }),
    startsWith: arg({
      type: String$3
    }),
    endsWith: arg({
      type: String$3
    }),
    // can be null
    not: arg({
      type: NestedStringNullableFilter$1
    })
  })
});
const NestedStringNullableFilter$1 = inputObject({
  name: 'NestedStringNullableFilter',
  fields: () => ({
    // can be null
    equals: arg({
      type: String$3
    }),
    // can be null
    in: arg({
      type: list(nonNull(String$3))
    }),
    // can be null
    notIn: arg({
      type: list(nonNull(String$3))
    }),
    lt: arg({
      type: String$3
    }),
    lte: arg({
      type: String$3
    }),
    gt: arg({
      type: String$3
    }),
    gte: arg({
      type: String$3
    }),
    contains: arg({
      type: String$3
    }),
    startsWith: arg({
      type: String$3
    }),
    endsWith: arg({
      type: String$3
    }),
    // can be null
    not: arg({
      type: NestedStringNullableFilter$1
    })
  })
});
const StringFilter$1 = inputObject({
  name: 'StringFilter',
  fields: () => ({
    equals: arg({
      type: String$3
    }),
    in: arg({
      type: list(nonNull(String$3))
    }),
    notIn: arg({
      type: list(nonNull(String$3))
    }),
    lt: arg({
      type: String$3
    }),
    lte: arg({
      type: String$3
    }),
    gt: arg({
      type: String$3
    }),
    gte: arg({
      type: String$3
    }),
    contains: arg({
      type: String$3
    }),
    startsWith: arg({
      type: String$3
    }),
    endsWith: arg({
      type: String$3
    }),
    not: arg({
      type: NestedStringFilter$1
    })
  })
});
const NestedStringFilter$1 = inputObject({
  name: 'NestedStringFilter',
  fields: () => ({
    equals: arg({
      type: String$3
    }),
    in: arg({
      type: list(nonNull(String$3))
    }),
    notIn: arg({
      type: list(nonNull(String$3))
    }),
    lt: arg({
      type: String$3
    }),
    lte: arg({
      type: String$3
    }),
    gt: arg({
      type: String$3
    }),
    gte: arg({
      type: String$3
    }),
    contains: arg({
      type: String$3
    }),
    startsWith: arg({
      type: String$3
    }),
    endsWith: arg({
      type: String$3
    }),
    not: arg({
      type: NestedStringFilter$1
    })
  })
});
const BoolNullableFilter$1 = inputObject({
  name: 'BooleanNullableFilter',
  fields: () => ({
    // can be null
    equals: arg({
      type: Boolean$3
    }),
    // can be null
    not: arg({
      type: BoolNullableFilter$1
    })
  })
});
const BoolFilter$1 = inputObject({
  name: 'BooleanFilter',
  fields: () => ({
    equals: arg({
      type: Boolean$3
    }),
    not: arg({
      type: BoolFilter$1
    })
  })
});
const IntNullableFilter$1 = inputObject({
  name: 'IntNullableFilter',
  fields: () => ({
    // can be null
    equals: arg({
      type: Int$3
    }),
    // can be null
    in: arg({
      type: list(nonNull(Int$3))
    }),
    // can be null
    notIn: arg({
      type: list(nonNull(Int$3))
    }),
    lt: arg({
      type: Int$3
    }),
    lte: arg({
      type: Int$3
    }),
    gt: arg({
      type: Int$3
    }),
    gte: arg({
      type: Int$3
    }),
    // can be null
    not: arg({
      type: IntNullableFilter$1
    })
  })
});
const IntFilter$1 = inputObject({
  name: 'IntFilter',
  fields: () => ({
    equals: arg({
      type: Int$3
    }),
    in: arg({
      type: list(nonNull(Int$3))
    }),
    notIn: arg({
      type: list(nonNull(Int$3))
    }),
    lt: arg({
      type: Int$3
    }),
    lte: arg({
      type: Int$3
    }),
    gt: arg({
      type: Int$3
    }),
    gte: arg({
      type: Int$3
    }),
    not: arg({
      type: IntFilter$1
    })
  })
});
const FloatNullableFilter$1 = inputObject({
  name: 'FloatNullableFilter',
  fields: () => ({
    // can be null
    equals: arg({
      type: Float$3
    }),
    // can be null
    in: arg({
      type: list(nonNull(Float$3))
    }),
    // can be null
    notIn: arg({
      type: list(nonNull(Float$3))
    }),
    lt: arg({
      type: Float$3
    }),
    lte: arg({
      type: Float$3
    }),
    gt: arg({
      type: Float$3
    }),
    gte: arg({
      type: Float$3
    }),
    // can be null
    not: arg({
      type: FloatNullableFilter$1
    })
  })
});
const FloatFilter$1 = inputObject({
  name: 'FloatFilter',
  fields: () => ({
    equals: arg({
      type: Float$3
    }),
    in: arg({
      type: list(nonNull(Float$3))
    }),
    notIn: arg({
      type: list(nonNull(Float$3))
    }),
    lt: arg({
      type: Float$3
    }),
    lte: arg({
      type: Float$3
    }),
    gt: arg({
      type: Float$3
    }),
    gte: arg({
      type: Float$3
    }),
    not: arg({
      type: FloatFilter$1
    })
  })
});
const DateTimeNullableFilter$1 = inputObject({
  name: 'DateTimeNullableFilter',
  fields: () => ({
    // can be null
    equals: arg({
      type: DateTime$3
    }),
    // can be null
    in: arg({
      type: list(nonNull(DateTime$3))
    }),
    // can be null
    notIn: arg({
      type: list(nonNull(DateTime$3))
    }),
    lt: arg({
      type: DateTime$3
    }),
    lte: arg({
      type: DateTime$3
    }),
    gt: arg({
      type: DateTime$3
    }),
    gte: arg({
      type: DateTime$3
    }),
    // can be null
    not: arg({
      type: DateTimeNullableFilter$1
    })
  })
});
const DateTimeFilter$1 = inputObject({
  name: 'DateTimeFilter',
  fields: () => ({
    equals: arg({
      type: DateTime$3
    }),
    in: arg({
      type: list(nonNull(DateTime$3))
    }),
    notIn: arg({
      type: list(nonNull(DateTime$3))
    }),
    lt: arg({
      type: DateTime$3
    }),
    lte: arg({
      type: DateTime$3
    }),
    gt: arg({
      type: DateTime$3
    }),
    gte: arg({
      type: DateTime$3
    }),
    not: arg({
      type: DateTimeFilter$1
    })
  })
});
const DecimalNullableFilter$1 = inputObject({
  name: 'DecimalNullableFilter',
  fields: () => ({
    // can be null
    equals: arg({
      type: Decimal$3
    }),
    // can be null
    in: arg({
      type: list(nonNull(Decimal$3))
    }),
    // can be null
    notIn: arg({
      type: list(nonNull(Decimal$3))
    }),
    lt: arg({
      type: Decimal$3
    }),
    lte: arg({
      type: Decimal$3
    }),
    gt: arg({
      type: Decimal$3
    }),
    gte: arg({
      type: Decimal$3
    }),
    // can be null
    not: arg({
      type: DecimalNullableFilter$1
    })
  })
});
const DecimalFilter$1 = inputObject({
  name: 'DecimalFilter',
  fields: () => ({
    equals: arg({
      type: Decimal$3
    }),
    in: arg({
      type: list(nonNull(Decimal$3))
    }),
    notIn: arg({
      type: list(nonNull(Decimal$3))
    }),
    lt: arg({
      type: Decimal$3
    }),
    lte: arg({
      type: Decimal$3
    }),
    gt: arg({
      type: Decimal$3
    }),
    gte: arg({
      type: Decimal$3
    }),
    not: arg({
      type: DecimalFilter$1
    })
  })
});
const BigIntNullableFilter$1 = inputObject({
  name: 'BigIntNullableFilter',
  fields: () => ({
    // can be null
    equals: arg({
      type: BigInt$3
    }),
    // can be null
    in: arg({
      type: list(nonNull(BigInt$3))
    }),
    // can be null
    notIn: arg({
      type: list(nonNull(BigInt$3))
    }),
    lt: arg({
      type: BigInt$3
    }),
    lte: arg({
      type: BigInt$3
    }),
    gt: arg({
      type: BigInt$3
    }),
    gte: arg({
      type: BigInt$3
    }),
    // can be null
    not: arg({
      type: BigIntNullableFilter$1
    })
  })
});
const BigIntFilter$1 = inputObject({
  name: 'BigIntFilter',
  fields: () => ({
    equals: arg({
      type: BigInt$3
    }),
    in: arg({
      type: list(nonNull(BigInt$3))
    }),
    notIn: arg({
      type: list(nonNull(BigInt$3))
    }),
    lt: arg({
      type: BigInt$3
    }),
    lte: arg({
      type: BigInt$3
    }),
    gt: arg({
      type: BigInt$3
    }),
    gte: arg({
      type: BigInt$3
    }),
    not: arg({
      type: BigIntFilter$1
    })
  })
});
const String$1 = {
  optional: StringNullableFilter$1,
  required: StringFilter$1
};
const Boolean$1 = {
  optional: BoolNullableFilter$1,
  required: BoolFilter$1
};
const Int$1 = {
  optional: IntNullableFilter$1,
  required: IntFilter$1
};
const Float$1 = {
  optional: FloatNullableFilter$1,
  required: FloatFilter$1
};
const DateTime$1 = {
  optional: DateTimeNullableFilter$1,
  required: DateTimeFilter$1
};
const Decimal$1 = {
  optional: DecimalNullableFilter$1,
  required: DecimalFilter$1
};
const BigInt$1 = {
  optional: BigIntNullableFilter$1,
  required: BigIntFilter$1
};

var sqlite = /*#__PURE__*/Object.freeze({
  __proto__: null,
  String: String$1,
  Boolean: Boolean$1,
  Int: Int$1,
  Float: Float$1,
  DateTime: DateTime$1,
  Decimal: Decimal$1,
  BigInt: BigInt$1,
  'enum': enumFilters
});

// Do not manually modify this file, it is automatically generated by the package at /prisma-utils in this repo.
const StringNullableFilter = inputObject({
  name: 'StringNullableFilter',
  fields: () => ({
    // can be null
    equals: arg({
      type: String$3
    }),
    // can be null
    in: arg({
      type: list(nonNull(String$3))
    }),
    // can be null
    notIn: arg({
      type: list(nonNull(String$3))
    }),
    lt: arg({
      type: String$3
    }),
    lte: arg({
      type: String$3
    }),
    gt: arg({
      type: String$3
    }),
    gte: arg({
      type: String$3
    }),
    contains: arg({
      type: String$3
    }),
    startsWith: arg({
      type: String$3
    }),
    endsWith: arg({
      type: String$3
    }),
    // can be null
    not: arg({
      type: NestedStringNullableFilter
    })
  })
});
const NestedStringNullableFilter = inputObject({
  name: 'NestedStringNullableFilter',
  fields: () => ({
    // can be null
    equals: arg({
      type: String$3
    }),
    // can be null
    in: arg({
      type: list(nonNull(String$3))
    }),
    // can be null
    notIn: arg({
      type: list(nonNull(String$3))
    }),
    lt: arg({
      type: String$3
    }),
    lte: arg({
      type: String$3
    }),
    gt: arg({
      type: String$3
    }),
    gte: arg({
      type: String$3
    }),
    contains: arg({
      type: String$3
    }),
    startsWith: arg({
      type: String$3
    }),
    endsWith: arg({
      type: String$3
    }),
    // can be null
    not: arg({
      type: NestedStringNullableFilter
    })
  })
});
const StringFilter = inputObject({
  name: 'StringFilter',
  fields: () => ({
    equals: arg({
      type: String$3
    }),
    in: arg({
      type: list(nonNull(String$3))
    }),
    notIn: arg({
      type: list(nonNull(String$3))
    }),
    lt: arg({
      type: String$3
    }),
    lte: arg({
      type: String$3
    }),
    gt: arg({
      type: String$3
    }),
    gte: arg({
      type: String$3
    }),
    contains: arg({
      type: String$3
    }),
    startsWith: arg({
      type: String$3
    }),
    endsWith: arg({
      type: String$3
    }),
    not: arg({
      type: NestedStringFilter
    })
  })
});
const NestedStringFilter = inputObject({
  name: 'NestedStringFilter',
  fields: () => ({
    equals: arg({
      type: String$3
    }),
    in: arg({
      type: list(nonNull(String$3))
    }),
    notIn: arg({
      type: list(nonNull(String$3))
    }),
    lt: arg({
      type: String$3
    }),
    lte: arg({
      type: String$3
    }),
    gt: arg({
      type: String$3
    }),
    gte: arg({
      type: String$3
    }),
    contains: arg({
      type: String$3
    }),
    startsWith: arg({
      type: String$3
    }),
    endsWith: arg({
      type: String$3
    }),
    not: arg({
      type: NestedStringFilter
    })
  })
});
const BoolNullableFilter = inputObject({
  name: 'BooleanNullableFilter',
  fields: () => ({
    // can be null
    equals: arg({
      type: Boolean$3
    }),
    // can be null
    not: arg({
      type: BoolNullableFilter
    })
  })
});
const BoolFilter = inputObject({
  name: 'BooleanFilter',
  fields: () => ({
    equals: arg({
      type: Boolean$3
    }),
    not: arg({
      type: BoolFilter
    })
  })
});
const IntNullableFilter = inputObject({
  name: 'IntNullableFilter',
  fields: () => ({
    // can be null
    equals: arg({
      type: Int$3
    }),
    // can be null
    in: arg({
      type: list(nonNull(Int$3))
    }),
    // can be null
    notIn: arg({
      type: list(nonNull(Int$3))
    }),
    lt: arg({
      type: Int$3
    }),
    lte: arg({
      type: Int$3
    }),
    gt: arg({
      type: Int$3
    }),
    gte: arg({
      type: Int$3
    }),
    // can be null
    not: arg({
      type: IntNullableFilter
    })
  })
});
const IntFilter = inputObject({
  name: 'IntFilter',
  fields: () => ({
    equals: arg({
      type: Int$3
    }),
    in: arg({
      type: list(nonNull(Int$3))
    }),
    notIn: arg({
      type: list(nonNull(Int$3))
    }),
    lt: arg({
      type: Int$3
    }),
    lte: arg({
      type: Int$3
    }),
    gt: arg({
      type: Int$3
    }),
    gte: arg({
      type: Int$3
    }),
    not: arg({
      type: IntFilter
    })
  })
});
const FloatNullableFilter = inputObject({
  name: 'FloatNullableFilter',
  fields: () => ({
    // can be null
    equals: arg({
      type: Float$3
    }),
    // can be null
    in: arg({
      type: list(nonNull(Float$3))
    }),
    // can be null
    notIn: arg({
      type: list(nonNull(Float$3))
    }),
    lt: arg({
      type: Float$3
    }),
    lte: arg({
      type: Float$3
    }),
    gt: arg({
      type: Float$3
    }),
    gte: arg({
      type: Float$3
    }),
    // can be null
    not: arg({
      type: FloatNullableFilter
    })
  })
});
const FloatFilter = inputObject({
  name: 'FloatFilter',
  fields: () => ({
    equals: arg({
      type: Float$3
    }),
    in: arg({
      type: list(nonNull(Float$3))
    }),
    notIn: arg({
      type: list(nonNull(Float$3))
    }),
    lt: arg({
      type: Float$3
    }),
    lte: arg({
      type: Float$3
    }),
    gt: arg({
      type: Float$3
    }),
    gte: arg({
      type: Float$3
    }),
    not: arg({
      type: FloatFilter
    })
  })
});
const DateTimeNullableFilter = inputObject({
  name: 'DateTimeNullableFilter',
  fields: () => ({
    // can be null
    equals: arg({
      type: DateTime$3
    }),
    // can be null
    in: arg({
      type: list(nonNull(DateTime$3))
    }),
    // can be null
    notIn: arg({
      type: list(nonNull(DateTime$3))
    }),
    lt: arg({
      type: DateTime$3
    }),
    lte: arg({
      type: DateTime$3
    }),
    gt: arg({
      type: DateTime$3
    }),
    gte: arg({
      type: DateTime$3
    }),
    // can be null
    not: arg({
      type: DateTimeNullableFilter
    })
  })
});
const DateTimeFilter = inputObject({
  name: 'DateTimeFilter',
  fields: () => ({
    equals: arg({
      type: DateTime$3
    }),
    in: arg({
      type: list(nonNull(DateTime$3))
    }),
    notIn: arg({
      type: list(nonNull(DateTime$3))
    }),
    lt: arg({
      type: DateTime$3
    }),
    lte: arg({
      type: DateTime$3
    }),
    gt: arg({
      type: DateTime$3
    }),
    gte: arg({
      type: DateTime$3
    }),
    not: arg({
      type: DateTimeFilter
    })
  })
});
const DecimalNullableFilter = inputObject({
  name: 'DecimalNullableFilter',
  fields: () => ({
    // can be null
    equals: arg({
      type: Decimal$3
    }),
    // can be null
    in: arg({
      type: list(nonNull(Decimal$3))
    }),
    // can be null
    notIn: arg({
      type: list(nonNull(Decimal$3))
    }),
    lt: arg({
      type: Decimal$3
    }),
    lte: arg({
      type: Decimal$3
    }),
    gt: arg({
      type: Decimal$3
    }),
    gte: arg({
      type: Decimal$3
    }),
    // can be null
    not: arg({
      type: DecimalNullableFilter
    })
  })
});
const DecimalFilter = inputObject({
  name: 'DecimalFilter',
  fields: () => ({
    equals: arg({
      type: Decimal$3
    }),
    in: arg({
      type: list(nonNull(Decimal$3))
    }),
    notIn: arg({
      type: list(nonNull(Decimal$3))
    }),
    lt: arg({
      type: Decimal$3
    }),
    lte: arg({
      type: Decimal$3
    }),
    gt: arg({
      type: Decimal$3
    }),
    gte: arg({
      type: Decimal$3
    }),
    not: arg({
      type: DecimalFilter
    })
  })
});
const BigIntNullableFilter = inputObject({
  name: 'BigIntNullableFilter',
  fields: () => ({
    // can be null
    equals: arg({
      type: BigInt$3
    }),
    // can be null
    in: arg({
      type: list(nonNull(BigInt$3))
    }),
    // can be null
    notIn: arg({
      type: list(nonNull(BigInt$3))
    }),
    lt: arg({
      type: BigInt$3
    }),
    lte: arg({
      type: BigInt$3
    }),
    gt: arg({
      type: BigInt$3
    }),
    gte: arg({
      type: BigInt$3
    }),
    // can be null
    not: arg({
      type: BigIntNullableFilter
    })
  })
});
const BigIntFilter = inputObject({
  name: 'BigIntFilter',
  fields: () => ({
    equals: arg({
      type: BigInt$3
    }),
    in: arg({
      type: list(nonNull(BigInt$3))
    }),
    notIn: arg({
      type: list(nonNull(BigInt$3))
    }),
    lt: arg({
      type: BigInt$3
    }),
    lte: arg({
      type: BigInt$3
    }),
    gt: arg({
      type: BigInt$3
    }),
    gte: arg({
      type: BigInt$3
    }),
    not: arg({
      type: BigIntFilter
    })
  })
});
const String = {
  optional: StringNullableFilter,
  required: StringFilter
};
const Boolean = {
  optional: BoolNullableFilter,
  required: BoolFilter
};
const Int = {
  optional: IntNullableFilter,
  required: IntFilter
};
const Float = {
  optional: FloatNullableFilter,
  required: FloatFilter
};
const DateTime = {
  optional: DateTimeNullableFilter,
  required: DateTimeFilter
};
const Decimal = {
  optional: DecimalNullableFilter,
  required: DecimalFilter
};
const BigInt = {
  optional: BigIntNullableFilter,
  required: BigIntFilter
};

var mysql = /*#__PURE__*/Object.freeze({
  __proto__: null,
  String: String,
  Boolean: Boolean,
  Int: Int,
  Float: Float,
  DateTime: DateTime,
  Decimal: Decimal,
  BigInt: BigInt,
  'enum': enumFilters
});

const _excluded$e = ["mode"];
const objectEntriesButAssumeNoExtraProperties = Object.entries;
function internalResolveFilter(entries, mode) {
  const entry = entries.shift();
  if (entry === undefined) return {};
  const [key, val] = entry;
  if (val == null) {
    return {
      AND: [{
        [key]: val
      }, internalResolveFilter(entries, mode)]
    };
  }
  switch (key) {
    case 'equals':
    case 'lt':
    case 'lte':
    case 'gt':
    case 'gte':
    case 'in':
    case 'contains':
    case 'startsWith':
    case 'endsWith':
      {
        return {
          AND: [{
            [key]: val,
            mode
          }, {
            not: null
          }, internalResolveFilter(entries, mode)]
        };
      }
    case 'notIn':
      {
        return {
          AND: [{
            NOT: [internalResolveFilter(objectEntriesButAssumeNoExtraProperties({
              in: val
            }), mode)]
          }, internalResolveFilter(entries, mode)]
        };
      }
    case 'not':
      {
        return {
          AND: [{
            NOT: [internalResolveFilter(objectEntriesButAssumeNoExtraProperties(val), mode)]
          }, internalResolveFilter(entries, mode)]
        };
      }
  }
}
function resolveCommon(val) {
  if (val === null) return null;
  return internalResolveFilter(objectEntriesButAssumeNoExtraProperties(val), undefined);
}
function resolveString(val) {
  if (val === null) return null;
  let {
      mode
    } = val,
    rest = _objectWithoutProperties(val, _excluded$e);
  return internalResolveFilter(objectEntriesButAssumeNoExtraProperties(rest), mode);
}

var filters = /*#__PURE__*/Object.freeze({
  __proto__: null,
  postgresql: postgresql,
  sqlite: sqlite,
  mysql: mysql,
  resolveCommon: resolveCommon,
  resolveString: resolveString
});

const _excluded$d = ["defaultValue"];
const checkbox = function () {
  let _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  let {
      defaultValue = false
    } = _ref,
    config = _objectWithoutProperties(_ref, _excluded$d);
  return meta => {
    var _config$db, _config$graphql, _config$graphql$creat, _config$graphql2, _config$graphql2$crea, _config$graphql3, _config$graphql3$read;
    if (config.isIndexed === 'unique') {
      throw Error("isIndexed: 'unique' is not a supported option for field type checkbox");
    }
    assertReadIsNonNullAllowed(meta, config, false);
    assertCreateIsNonNullAllowed(meta, config);
    return fieldType({
      kind: 'scalar',
      mode: 'required',
      scalar: 'Boolean',
      default: {
        kind: 'literal',
        value: defaultValue
      },
      map: (_config$db = config.db) === null || _config$db === void 0 ? void 0 : _config$db.map
    })(_objectSpread(_objectSpread({}, config), {}, {
      input: {
        where: {
          arg: arg({
            type: filters[meta.provider].Boolean.required
          })
        },
        create: {
          arg: arg({
            type: (_config$graphql = config.graphql) !== null && _config$graphql !== void 0 && (_config$graphql$creat = _config$graphql.create) !== null && _config$graphql$creat !== void 0 && _config$graphql$creat.isNonNull ? nonNull(Boolean$3) : Boolean$3,
            defaultValue: (_config$graphql2 = config.graphql) !== null && _config$graphql2 !== void 0 && (_config$graphql2$crea = _config$graphql2.create) !== null && _config$graphql2$crea !== void 0 && _config$graphql2$crea.isNonNull ? defaultValue : undefined
          }),
          resolve(val) {
            if (val === null) {
              throw userInputError('Checkbox fields cannot be set to null');
            }
            return val !== null && val !== void 0 ? val : defaultValue;
          }
        },
        update: {
          arg: arg({
            type: Boolean$3
          }),
          resolve(val) {
            if (val === null) {
              throw userInputError('Checkbox fields cannot be set to null');
            }
            return val;
          }
        },
        orderBy: {
          arg: arg({
            type: orderDirectionEnum
          })
        }
      },
      output: field({
        type: (_config$graphql3 = config.graphql) !== null && _config$graphql3 !== void 0 && (_config$graphql3$read = _config$graphql3.read) !== null && _config$graphql3$read !== void 0 && _config$graphql3$read.isNonNull ? nonNull(Boolean$3) : Boolean$3
      }),
      __ksTelemetryFieldTypeName: '@keystone-6/checkbox',
      views: '@keystone-6/core/fields/types/checkbox/views',
      getAdminMeta: () => ({
        defaultValue
      })
    }));
  };
};

const _excluded$c = ["isIndexed", "precision", "scale", "validation", "defaultValue"];
function parseDecimalValueOption(meta, value, name) {
  let decimal;
  try {
    decimal = new Decimal$4(value);
  } catch (err) {
    throw new Error(`The decimal field at ${meta.listKey}.${meta.fieldKey} specifies ${name}: ${value}, this is not valid decimal value.`);
  }
  if (!decimal.isFinite()) {
    throw new Error(`The decimal field at ${meta.listKey}.${meta.fieldKey} specifies ${name}: ${value} which is not finite but ${name} must be finite.`);
  }
  return decimal;
}
const decimal = function () {
  let _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  let {
      isIndexed,
      precision = 18,
      scale = 4,
      validation,
      defaultValue
    } = _ref,
    config = _objectWithoutProperties(_ref, _excluded$c);
  return meta => {
    var _config$label, _config$db, _config$graphql, _config$graphql$creat, _config$graphql2, _config$graphql2$crea, _config$graphql3, _config$graphql3$read;
    if (meta.provider === 'sqlite') {
      throw new Error('The decimal field does not support sqlite');
    }
    if (!Number.isInteger(scale)) {
      throw new Error(`The scale for decimal fields must be an integer but the scale for the decimal field at ${meta.listKey}.${meta.fieldKey} is not an integer`);
    }
    if (!Number.isInteger(precision)) {
      throw new Error(`The precision for decimal fields must be an integer but the precision for the decimal field at ${meta.listKey}.${meta.fieldKey} is not an integer`);
    }
    if (scale > precision) {
      throw new Error(`The scale configured for decimal field at ${meta.listKey}.${meta.fieldKey} (${scale}) ` + `must not be larger than the field's precision (${precision})`);
    }
    const fieldLabel = (_config$label = config.label) !== null && _config$label !== void 0 ? _config$label : humanize(meta.fieldKey);
    const max = (validation === null || validation === void 0 ? void 0 : validation.max) === undefined ? undefined : parseDecimalValueOption(meta, validation.max, 'validation.max');
    const min = (validation === null || validation === void 0 ? void 0 : validation.min) === undefined ? undefined : parseDecimalValueOption(meta, validation.min, 'validation.min');
    if (min !== undefined && max !== undefined && max.lessThan(min)) {
      throw new Error(`The decimal field at ${meta.listKey}.${meta.fieldKey} specifies a validation.max that is less than the validation.min, and therefore has no valid options`);
    }
    const parsedDefaultValue = defaultValue === undefined ? undefined : parseDecimalValueOption(meta, defaultValue, 'defaultValue');
    const isNullable = getResolvedIsNullable(validation, config.db);
    assertReadIsNonNullAllowed(meta, config, isNullable);
    assertCreateIsNonNullAllowed(meta, config);
    const mode = isNullable === false ? 'required' : 'optional';
    const index = isIndexed === true ? 'index' : isIndexed || undefined;
    const dbField = {
      kind: 'scalar',
      mode,
      scalar: 'Decimal',
      nativeType: `Decimal(${precision}, ${scale})`,
      index,
      default: defaultValue === undefined ? undefined : {
        kind: 'literal',
        value: defaultValue
      },
      map: (_config$db = config.db) === null || _config$db === void 0 ? void 0 : _config$db.map
    };
    return fieldType(dbField)(_objectSpread(_objectSpread({}, config), {}, {
      hooks: _objectSpread(_objectSpread({}, config.hooks), {}, {
        async validateInput(args) {
          var _config$hooks, _config$hooks$validat;
          const val = args.resolvedData[meta.fieldKey];
          if (val === null && (validation !== null && validation !== void 0 && validation.isRequired || isNullable === false)) {
            args.addValidationError(`${fieldLabel} is required`);
          }
          if (val != null) {
            if (min !== undefined && val.lessThan(min)) {
              args.addValidationError(`${fieldLabel} must be greater than or equal to ${min}`);
            }
            if (max !== undefined && val.greaterThan(max)) {
              args.addValidationError(`${fieldLabel} must be less than or equal to ${max}`);
            }
          }
          await ((_config$hooks = config.hooks) === null || _config$hooks === void 0 ? void 0 : (_config$hooks$validat = _config$hooks.validateInput) === null || _config$hooks$validat === void 0 ? void 0 : _config$hooks$validat.call(_config$hooks, args));
        }
      }),
      input: {
        uniqueWhere: isIndexed === 'unique' ? {
          arg: arg({
            type: Decimal$3
          })
        } : undefined,
        where: {
          arg: arg({
            type: filters[meta.provider].Decimal[mode]
          }),
          resolve: mode === 'optional' ? resolveCommon : undefined
        },
        create: {
          arg: arg({
            type: (_config$graphql = config.graphql) !== null && _config$graphql !== void 0 && (_config$graphql$creat = _config$graphql.create) !== null && _config$graphql$creat !== void 0 && _config$graphql$creat.isNonNull ? nonNull(Decimal$3) : Decimal$3,
            defaultValue: (_config$graphql2 = config.graphql) !== null && _config$graphql2 !== void 0 && (_config$graphql2$crea = _config$graphql2.create) !== null && _config$graphql2$crea !== void 0 && _config$graphql2$crea.isNonNull ? parsedDefaultValue : undefined
          }),
          resolve(val) {
            if (val === undefined) {
              return parsedDefaultValue !== null && parsedDefaultValue !== void 0 ? parsedDefaultValue : null;
            }
            return val;
          }
        },
        update: {
          arg: arg({
            type: Decimal$3
          })
        },
        orderBy: {
          arg: arg({
            type: orderDirectionEnum
          })
        }
      },
      output: field({
        type: (_config$graphql3 = config.graphql) !== null && _config$graphql3 !== void 0 && (_config$graphql3$read = _config$graphql3.read) !== null && _config$graphql3$read !== void 0 && _config$graphql3$read.isNonNull ? nonNull(Decimal$3) : Decimal$3,
        resolve(_ref2) {
          let {
            value
          } = _ref2;
          if (value === null) {
            return null;
          }
          const val = new Decimal$4(value);
          val.scaleToPrint = scale;
          return val;
        }
      }),
      __ksTelemetryFieldTypeName: '@keystone-6/decimal',
      views: '@keystone-6/core/fields/types/decimal/views',
      getAdminMeta: () => {
        var _validation$isRequire, _validation$max, _validation$min;
        return {
          defaultValue: defaultValue !== null && defaultValue !== void 0 ? defaultValue : null,
          precision,
          scale,
          validation: {
            isRequired: (_validation$isRequire = validation === null || validation === void 0 ? void 0 : validation.isRequired) !== null && _validation$isRequire !== void 0 ? _validation$isRequire : false,
            max: (_validation$max = validation === null || validation === void 0 ? void 0 : validation.max) !== null && _validation$max !== void 0 ? _validation$max : null,
            min: (_validation$min = validation === null || validation === void 0 ? void 0 : validation.min) !== null && _validation$min !== void 0 ? _validation$min : null
          }
        };
      }
    }));
  };
};

const FileFieldInput = inputObject({
  name: 'FileFieldInput',
  fields: {
    upload: arg({
      type: nonNull(Upload)
    })
  }
});
const inputArg$1 = arg({
  type: FileFieldInput
});
const FileFieldOutput = object()({
  name: 'FileFieldOutput',
  fields: {
    filename: field({
      type: nonNull(String$3)
    }),
    filesize: field({
      type: nonNull(Int$3)
    }),
    url: field({
      type: nonNull(String$3),
      resolve(data, args, context) {
        return context.files(data.storage).getUrl(data.filename);
      }
    })
  }
});
async function inputResolver$1(storage, data, context) {
  if (data === null || data === undefined) {
    return {
      filename: data,
      filesize: data
    };
  }
  const upload = await data.upload;
  return context.files(storage).getDataFromStream(upload.createReadStream(), upload.filename);
}
const file = config => meta => {
  const storage = meta.getStorage(config.storage);
  if (!storage) {
    throw new Error(`${meta.listKey}.${meta.fieldKey} has storage set to ${config.storage}, but no storage configuration was found for that key`);
  }
  if ('isIndexed' in config) {
    throw Error("isIndexed: 'unique' is not a supported option for field type file");
  }
  return fieldType({
    kind: 'multi',
    fields: {
      filesize: {
        kind: 'scalar',
        scalar: 'Int',
        mode: 'optional'
      },
      filename: {
        kind: 'scalar',
        scalar: 'String',
        mode: 'optional'
      }
    }
  })(_objectSpread(_objectSpread({}, config), {}, {
    hooks: storage.preserve ? config.hooks : _objectSpread(_objectSpread({}, config.hooks), {}, {
      async beforeOperation(args) {
        var _config$hooks, _config$hooks$beforeO;
        await ((_config$hooks = config.hooks) === null || _config$hooks === void 0 ? void 0 : (_config$hooks$beforeO = _config$hooks.beforeOperation) === null || _config$hooks$beforeO === void 0 ? void 0 : _config$hooks$beforeO.call(_config$hooks, args));
        if (args.operation === 'update' || args.operation === 'delete') {
          const filenameKey = `${meta.fieldKey}_filename`;
          const filename = args.item[filenameKey];

          // This will occur on an update where a file already existed but has been
          // changed, or on a delete, where there is no longer an item
          if ((args.operation === 'delete' || typeof args.resolvedData[meta.fieldKey].filename === 'string' || args.resolvedData[meta.fieldKey].filename === null) && typeof filename === 'string') {
            await args.context.files(config.storage).deleteAtSource(filename);
          }
        }
      }
    }),
    input: {
      create: {
        arg: inputArg$1,
        resolve: (data, context) => inputResolver$1(config.storage, data, context)
      },
      update: {
        arg: inputArg$1,
        resolve: (data, context) => inputResolver$1(config.storage, data, context)
      }
    },
    output: field({
      type: FileFieldOutput,
      resolve(_ref) {
        let {
          value: {
            filesize,
            filename
          }
        } = _ref;
        if (filesize === null || filename === null) {
          return null;
        }
        return {
          filename,
          filesize,
          storage: config.storage
        };
      }
    }),
    __ksTelemetryFieldTypeName: '@keystone-6/file',
    views: '@keystone-6/core/fields/types/file/views'
  }));
};

const _excluded$b = ["isIndexed", "validation", "defaultValue"];
const float = function () {
  let _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  let {
      isIndexed,
      validation,
      defaultValue
    } = _ref,
    config = _objectWithoutProperties(_ref, _excluded$b);
  return meta => {
    var _config$label, _config$db, _config$graphql, _config$graphql$creat, _config$graphql2, _config$graphql2$crea, _config$graphql3, _config$graphql3$read;
    if (defaultValue !== undefined && (typeof defaultValue !== 'number' || !Number.isFinite(defaultValue))) {
      throw new Error(`The float field at ${meta.listKey}.${meta.fieldKey} specifies a default value of: ${defaultValue} but it must be a valid finite number`);
    }
    if ((validation === null || validation === void 0 ? void 0 : validation.min) !== undefined && (typeof validation.min !== 'number' || !Number.isFinite(validation.min))) {
      throw new Error(`The float field at ${meta.listKey}.${meta.fieldKey} specifies validation.min: ${validation.min} but it must be a valid finite number`);
    }
    if ((validation === null || validation === void 0 ? void 0 : validation.max) !== undefined && (typeof validation.max !== 'number' || !Number.isFinite(validation.max))) {
      throw new Error(`The float field at ${meta.listKey}.${meta.fieldKey} specifies validation.max: ${validation.max} but it must be a valid finite number`);
    }
    if ((validation === null || validation === void 0 ? void 0 : validation.min) !== undefined && (validation === null || validation === void 0 ? void 0 : validation.max) !== undefined && validation.min > validation.max) {
      throw new Error(`The float field at ${meta.listKey}.${meta.fieldKey} specifies a validation.max that is less than the validation.min, and therefore has no valid options`);
    }
    const isNullable = getResolvedIsNullable(validation, config.db);
    assertReadIsNonNullAllowed(meta, config, isNullable);
    assertCreateIsNonNullAllowed(meta, config);
    const mode = isNullable === false ? 'required' : 'optional';
    const fieldLabel = (_config$label = config.label) !== null && _config$label !== void 0 ? _config$label : humanize(meta.fieldKey);
    return fieldType({
      kind: 'scalar',
      mode,
      scalar: 'Float',
      index: isIndexed === true ? 'index' : isIndexed || undefined,
      default: typeof defaultValue === 'number' ? {
        kind: 'literal',
        value: defaultValue
      } : undefined,
      map: (_config$db = config.db) === null || _config$db === void 0 ? void 0 : _config$db.map
    })(_objectSpread(_objectSpread({}, config), {}, {
      hooks: _objectSpread(_objectSpread({}, config.hooks), {}, {
        async validateInput(args) {
          var _config$hooks, _config$hooks$validat;
          const value = args.resolvedData[meta.fieldKey];
          if ((validation !== null && validation !== void 0 && validation.isRequired || isNullable === false) && value === null) {
            args.addValidationError(`${fieldLabel} is required`);
          }
          if (typeof value === 'number') {
            if ((validation === null || validation === void 0 ? void 0 : validation.max) !== undefined && value > validation.max) {
              args.addValidationError(`${fieldLabel} must be less than or equal to ${validation.max}`);
            }
            if ((validation === null || validation === void 0 ? void 0 : validation.min) !== undefined && value < validation.min) {
              args.addValidationError(`${fieldLabel} must be greater than or equal to ${validation.min}`);
            }
          }
          await ((_config$hooks = config.hooks) === null || _config$hooks === void 0 ? void 0 : (_config$hooks$validat = _config$hooks.validateInput) === null || _config$hooks$validat === void 0 ? void 0 : _config$hooks$validat.call(_config$hooks, args));
        }
      }),
      input: {
        uniqueWhere: isIndexed === 'unique' ? {
          arg: arg({
            type: Float$3
          })
        } : undefined,
        where: {
          arg: arg({
            type: filters[meta.provider].Float[mode]
          }),
          resolve: mode === 'optional' ? resolveCommon : undefined
        },
        create: {
          arg: arg({
            type: (_config$graphql = config.graphql) !== null && _config$graphql !== void 0 && (_config$graphql$creat = _config$graphql.create) !== null && _config$graphql$creat !== void 0 && _config$graphql$creat.isNonNull ? nonNull(Float$3) : Float$3,
            defaultValue: (_config$graphql2 = config.graphql) !== null && _config$graphql2 !== void 0 && (_config$graphql2$crea = _config$graphql2.create) !== null && _config$graphql2$crea !== void 0 && _config$graphql2$crea.isNonNull && typeof defaultValue === 'number' ? defaultValue : undefined
          }),
          resolve(value) {
            if (value === undefined) {
              return defaultValue !== null && defaultValue !== void 0 ? defaultValue : null;
            }
            return value;
          }
        },
        update: {
          arg: arg({
            type: Float$3
          })
        },
        orderBy: {
          arg: arg({
            type: orderDirectionEnum
          })
        }
      },
      output: field({
        type: (_config$graphql3 = config.graphql) !== null && _config$graphql3 !== void 0 && (_config$graphql3$read = _config$graphql3.read) !== null && _config$graphql3$read !== void 0 && _config$graphql3$read.isNonNull ? nonNull(Float$3) : Float$3
      }),
      __ksTelemetryFieldTypeName: '@keystone-6/float',
      views: '@keystone-6/core/fields/types/float/views',
      getAdminMeta() {
        var _validation$isRequire;
        return {
          validation: {
            min: (validation === null || validation === void 0 ? void 0 : validation.min) || null,
            max: (validation === null || validation === void 0 ? void 0 : validation.max) || null,
            isRequired: (_validation$isRequire = validation === null || validation === void 0 ? void 0 : validation.isRequired) !== null && _validation$isRequire !== void 0 ? _validation$isRequire : false
          },
          defaultValue: defaultValue !== null && defaultValue !== void 0 ? defaultValue : null
        };
      }
    }));
  };
};

const _excluded$a = ["isIndexed", "defaultValue", "validation"];
// These are the max and min values available to a 32 bit signed integer
const MAX_INT$3 = 2147483647;
const MIN_INT$3 = -2147483648;
const integer = function () {
  let _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  let {
      isIndexed,
      defaultValue: _defaultValue,
      validation
    } = _ref,
    config = _objectWithoutProperties(_ref, _excluded$a);
  return meta => {
    var _config$label, _config$db, _config$graphql, _config$graphql$creat, _config$graphql2, _config$graphql2$crea, _config$graphql3, _config$graphql3$read;
    const defaultValue = _defaultValue !== null && _defaultValue !== void 0 ? _defaultValue : null;
    const hasAutoIncDefault = typeof defaultValue == 'object' && defaultValue !== null && defaultValue.kind === 'autoincrement';
    const isNullable = getResolvedIsNullable(validation, config.db);
    if (hasAutoIncDefault) {
      if (meta.provider === 'sqlite' || meta.provider === 'mysql') {
        throw new Error(`The integer field at ${meta.listKey}.${meta.fieldKey} specifies defaultValue: { kind: 'autoincrement' }, this is not supported on ${meta.provider}`);
      }
      if (isNullable !== false) {
        throw new Error(`The integer field at ${meta.listKey}.${meta.fieldKey} specifies defaultValue: { kind: 'autoincrement' } but doesn't specify db.isNullable: false.\n` + `Having nullable autoincrements on Prisma currently incorrectly creates a non-nullable column so it is not allowed.\n` + `https://github.com/prisma/prisma/issues/8663`);
      }
    }
    if ((validation === null || validation === void 0 ? void 0 : validation.min) !== undefined && !Number.isInteger(validation.min)) {
      throw new Error(`The integer field at ${meta.listKey}.${meta.fieldKey} specifies validation.min: ${validation.min} but it must be an integer`);
    }
    if ((validation === null || validation === void 0 ? void 0 : validation.max) !== undefined && !Number.isInteger(validation.max)) {
      throw new Error(`The integer field at ${meta.listKey}.${meta.fieldKey} specifies validation.max: ${validation.max} but it must be an integer`);
    }
    if ((validation === null || validation === void 0 ? void 0 : validation.min) !== undefined && ((validation === null || validation === void 0 ? void 0 : validation.min) > MAX_INT$3 || (validation === null || validation === void 0 ? void 0 : validation.min) < MIN_INT$3)) {
      throw new Error(`The integer field at ${meta.listKey}.${meta.fieldKey} specifies validation.min: ${validation.min} which is outside of the range of a 32bit signed integer(${MIN_INT$3} - ${MAX_INT$3}) which is not allowed`);
    }
    if ((validation === null || validation === void 0 ? void 0 : validation.max) !== undefined && ((validation === null || validation === void 0 ? void 0 : validation.max) > MAX_INT$3 || (validation === null || validation === void 0 ? void 0 : validation.max) < MIN_INT$3)) {
      throw new Error(`The integer field at ${meta.listKey}.${meta.fieldKey} specifies validation.max: ${validation.max} which is outside of the range of a 32bit signed integer(${MIN_INT$3} - ${MAX_INT$3}) which is not allowed`);
    }
    if ((validation === null || validation === void 0 ? void 0 : validation.min) !== undefined && (validation === null || validation === void 0 ? void 0 : validation.max) !== undefined && validation.min > validation.max) {
      throw new Error(`The integer field at ${meta.listKey}.${meta.fieldKey} specifies a validation.max that is less than the validation.min, and therefore has no valid options`);
    }
    assertReadIsNonNullAllowed(meta, config, isNullable);
    assertCreateIsNonNullAllowed(meta, config);
    const mode = isNullable === false ? 'required' : 'optional';
    const fieldLabel = (_config$label = config.label) !== null && _config$label !== void 0 ? _config$label : humanize(meta.fieldKey);
    return fieldType({
      kind: 'scalar',
      mode,
      scalar: 'Int',
      // This will resolve to 'index' if the boolean is true, otherwise other values - false will be converted to undefined
      index: isIndexed === true ? 'index' : isIndexed || undefined,
      default: typeof defaultValue === 'number' ? {
        kind: 'literal',
        value: defaultValue
      } : (defaultValue === null || defaultValue === void 0 ? void 0 : defaultValue.kind) === 'autoincrement' ? {
        kind: 'autoincrement'
      } : undefined,
      map: (_config$db = config.db) === null || _config$db === void 0 ? void 0 : _config$db.map
    })(_objectSpread(_objectSpread({}, config), {}, {
      hooks: _objectSpread(_objectSpread({}, config.hooks), {}, {
        async validateInput(args) {
          var _config$hooks, _config$hooks$validat;
          const value = args.resolvedData[meta.fieldKey];
          if ((validation !== null && validation !== void 0 && validation.isRequired || isNullable === false) && (value === null || args.operation === 'create' && value === undefined && !hasAutoIncDefault)) {
            args.addValidationError(`${fieldLabel} is required`);
          }
          if (typeof value === 'number') {
            if ((validation === null || validation === void 0 ? void 0 : validation.min) !== undefined && value < validation.min) {
              args.addValidationError(`${fieldLabel} must be greater than or equal to ${validation.min}`);
            }
            if ((validation === null || validation === void 0 ? void 0 : validation.max) !== undefined && value > validation.max) {
              args.addValidationError(`${fieldLabel} must be less than or equal to ${validation.max}`);
            }
          }
          await ((_config$hooks = config.hooks) === null || _config$hooks === void 0 ? void 0 : (_config$hooks$validat = _config$hooks.validateInput) === null || _config$hooks$validat === void 0 ? void 0 : _config$hooks$validat.call(_config$hooks, args));
        }
      }),
      input: {
        uniqueWhere: isIndexed === 'unique' ? {
          arg: arg({
            type: Int$3
          })
        } : undefined,
        where: {
          arg: arg({
            type: filters[meta.provider].Int[mode]
          }),
          resolve: mode === 'optional' ? resolveCommon : undefined
        },
        create: {
          arg: arg({
            type: (_config$graphql = config.graphql) !== null && _config$graphql !== void 0 && (_config$graphql$creat = _config$graphql.create) !== null && _config$graphql$creat !== void 0 && _config$graphql$creat.isNonNull ? nonNull(Int$3) : Int$3,
            defaultValue: (_config$graphql2 = config.graphql) !== null && _config$graphql2 !== void 0 && (_config$graphql2$crea = _config$graphql2.create) !== null && _config$graphql2$crea !== void 0 && _config$graphql2$crea.isNonNull && typeof defaultValue === 'number' ? defaultValue : undefined
          }),
          resolve(value) {
            if (value === undefined && typeof defaultValue === 'number') {
              return defaultValue;
            }
            return value;
          }
        },
        update: {
          arg: arg({
            type: Int$3
          })
        },
        orderBy: {
          arg: arg({
            type: orderDirectionEnum
          })
        }
      },
      output: field({
        type: (_config$graphql3 = config.graphql) !== null && _config$graphql3 !== void 0 && (_config$graphql3$read = _config$graphql3.read) !== null && _config$graphql3$read !== void 0 && _config$graphql3$read.isNonNull ? nonNull(Int$3) : Int$3
      }),
      __ksTelemetryFieldTypeName: '@keystone-6/integer',
      views: '@keystone-6/core/fields/types/integer/views',
      getAdminMeta() {
        var _validation$min, _validation$max, _validation$isRequire;
        return {
          validation: {
            min: (_validation$min = validation === null || validation === void 0 ? void 0 : validation.min) !== null && _validation$min !== void 0 ? _validation$min : MIN_INT$3,
            max: (_validation$max = validation === null || validation === void 0 ? void 0 : validation.max) !== null && _validation$max !== void 0 ? _validation$max : MAX_INT$3,
            isRequired: (_validation$isRequire = validation === null || validation === void 0 ? void 0 : validation.isRequired) !== null && _validation$isRequire !== void 0 ? _validation$isRequire : false
          },
          defaultValue: defaultValue === null || typeof defaultValue === 'number' ? defaultValue : 'autoincrement'
        };
      }
    }));
  };
};

const _excluded$9 = ["isIndexed", "defaultValue", "validation"];
// These are the max and min values available to a 64 bit signed integer
const MAX_INT$2 = 9223372036854775807n;
const MIN_INT$2 = -9223372036854775808n;
const bigInt = function () {
  let _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  let {
      isIndexed,
      defaultValue: _defaultValue,
      validation: _validation
    } = _ref,
    config = _objectWithoutProperties(_ref, _excluded$9);
  return meta => {
    var _validation$isRequire, _validation$min, _validation$max, _config$label, _config$db, _config$graphql, _config$graphql$creat, _config$graphql2, _config$graphql2$crea, _config$graphql3, _config$graphql3$read;
    const defaultValue = _defaultValue !== null && _defaultValue !== void 0 ? _defaultValue : null;
    const hasAutoIncDefault = typeof defaultValue == 'object' && defaultValue !== null && defaultValue.kind === 'autoincrement';
    const isNullable = getResolvedIsNullable(_validation, config.db);
    if (hasAutoIncDefault) {
      if (meta.provider === 'sqlite' || meta.provider === 'mysql') {
        throw new Error(`The bigInt field at ${meta.listKey}.${meta.fieldKey} specifies defaultValue: { kind: 'autoincrement' }, this is not supported on ${meta.provider}`);
      }
      if (isNullable !== false) {
        throw new Error(`The bigInt field at ${meta.listKey}.${meta.fieldKey} specifies defaultValue: { kind: 'autoincrement' } but doesn't specify db.isNullable: false.\n` + `Having nullable autoincrements on Prisma currently incorrectly creates a non-nullable column so it is not allowed.\n` + `https://github.com/prisma/prisma/issues/8663`);
      }
    }
    const validation = {
      isRequired: (_validation$isRequire = _validation === null || _validation === void 0 ? void 0 : _validation.isRequired) !== null && _validation$isRequire !== void 0 ? _validation$isRequire : false,
      min: (_validation$min = _validation === null || _validation === void 0 ? void 0 : _validation.min) !== null && _validation$min !== void 0 ? _validation$min : MIN_INT$2,
      max: (_validation$max = _validation === null || _validation === void 0 ? void 0 : _validation.max) !== null && _validation$max !== void 0 ? _validation$max : MAX_INT$2
    };
    for (const type of ['min', 'max']) {
      if (validation[type] > MAX_INT$2 || validation[type] < MIN_INT$2) {
        throw new Error(`The bigInt field at ${meta.listKey}.${meta.fieldKey} specifies validation.${type}: ${validation[type]} which is outside of the range of a 64bit signed integer(${MIN_INT$2}n - ${MAX_INT$2}n) which is not allowed`);
      }
    }
    if (validation.min > validation.max) {
      throw new Error(`The bigInt field at ${meta.listKey}.${meta.fieldKey} specifies a validation.max that is less than the validation.min, and therefore has no valid options`);
    }
    assertReadIsNonNullAllowed(meta, config, isNullable);
    assertCreateIsNonNullAllowed(meta, config);
    const mode = isNullable === false ? 'required' : 'optional';
    const fieldLabel = (_config$label = config.label) !== null && _config$label !== void 0 ? _config$label : humanize(meta.fieldKey);
    return fieldType({
      kind: 'scalar',
      mode,
      scalar: 'BigInt',
      // This will resolve to 'index' if the boolean is true, otherwise other values - false will be converted to undefined
      index: isIndexed === true ? 'index' : isIndexed || undefined,
      default: typeof defaultValue === 'bigint' ? {
        kind: 'literal',
        value: defaultValue
      } : (defaultValue === null || defaultValue === void 0 ? void 0 : defaultValue.kind) === 'autoincrement' ? {
        kind: 'autoincrement'
      } : undefined,
      map: (_config$db = config.db) === null || _config$db === void 0 ? void 0 : _config$db.map
    })(_objectSpread(_objectSpread({}, config), {}, {
      hooks: _objectSpread(_objectSpread({}, config.hooks), {}, {
        async validateInput(args) {
          var _config$hooks, _config$hooks$validat;
          const value = args.resolvedData[meta.fieldKey];
          if ((validation !== null && validation !== void 0 && validation.isRequired || isNullable === false) && (value === null || args.operation === 'create' && value === undefined && !hasAutoIncDefault)) {
            args.addValidationError(`${fieldLabel} is required`);
          }
          if (typeof value === 'number') {
            if ((validation === null || validation === void 0 ? void 0 : validation.min) !== undefined && value < validation.min) {
              args.addValidationError(`${fieldLabel} must be greater than or equal to ${validation.min}`);
            }
            if ((validation === null || validation === void 0 ? void 0 : validation.max) !== undefined && value > validation.max) {
              args.addValidationError(`${fieldLabel} must be less than or equal to ${validation.max}`);
            }
          }
          await ((_config$hooks = config.hooks) === null || _config$hooks === void 0 ? void 0 : (_config$hooks$validat = _config$hooks.validateInput) === null || _config$hooks$validat === void 0 ? void 0 : _config$hooks$validat.call(_config$hooks, args));
        }
      }),
      input: {
        uniqueWhere: isIndexed === 'unique' ? {
          arg: arg({
            type: BigInt$3
          })
        } : undefined,
        where: {
          arg: arg({
            type: filters[meta.provider].BigInt[mode]
          }),
          resolve: mode === 'optional' ? resolveCommon : undefined
        },
        create: {
          arg: arg({
            type: (_config$graphql = config.graphql) !== null && _config$graphql !== void 0 && (_config$graphql$creat = _config$graphql.create) !== null && _config$graphql$creat !== void 0 && _config$graphql$creat.isNonNull ? nonNull(BigInt$3) : BigInt$3,
            defaultValue: (_config$graphql2 = config.graphql) !== null && _config$graphql2 !== void 0 && (_config$graphql2$crea = _config$graphql2.create) !== null && _config$graphql2$crea !== void 0 && _config$graphql2$crea.isNonNull && typeof defaultValue === 'bigint' ? defaultValue : undefined
          }),
          resolve(value) {
            if (value === undefined && typeof defaultValue === 'bigint') {
              return defaultValue;
            }
            return value;
          }
        },
        update: {
          arg: arg({
            type: BigInt$3
          })
        },
        orderBy: {
          arg: arg({
            type: orderDirectionEnum
          })
        }
      },
      output: field({
        type: (_config$graphql3 = config.graphql) !== null && _config$graphql3 !== void 0 && (_config$graphql3$read = _config$graphql3.read) !== null && _config$graphql3$read !== void 0 && _config$graphql3$read.isNonNull ? nonNull(BigInt$3) : BigInt$3
      }),
      __ksTelemetryFieldTypeName: '@keystone-6/bigInt',
      views: '@keystone-6/core/fields/types/bigInt/views',
      getAdminMeta() {
        return {
          validation: {
            min: validation.min.toString(),
            max: validation.max.toString(),
            isRequired: validation.isRequired
          },
          defaultValue: typeof defaultValue === 'bigint' ? defaultValue.toString() : defaultValue
        };
      }
    }));
  };
};

const ImageExtensionEnum = enum$1({
  name: 'ImageExtension',
  values: enumValues(SUPPORTED_IMAGE_EXTENSIONS)
});
const ImageFieldInput = inputObject({
  name: 'ImageFieldInput',
  fields: {
    upload: arg({
      type: nonNull(Upload)
    })
  }
});
const inputArg = arg({
  type: ImageFieldInput
});
const ImageFieldOutput = object()({
  name: 'ImageFieldOutput',
  fields: {
    id: field({
      type: nonNull(ID)
    }),
    filesize: field({
      type: nonNull(Int$3)
    }),
    width: field({
      type: nonNull(Int$3)
    }),
    height: field({
      type: nonNull(Int$3)
    }),
    extension: field({
      type: nonNull(ImageExtensionEnum)
    }),
    url: field({
      type: nonNull(String$3),
      resolve(data, args, context) {
        return context.images(data.storage).getUrl(data.id, data.extension);
      }
    })
  }
});
async function inputResolver(storage, data, context) {
  if (data === null || data === undefined) {
    return {
      extension: data,
      filesize: data,
      height: data,
      id: data,
      width: data
    };
  }
  const upload = await data.upload;
  return context.images(storage).getDataFromStream(upload.createReadStream(), upload.filename);
}
const extensionsSet = new Set(SUPPORTED_IMAGE_EXTENSIONS);
function isValidImageExtension(extension) {
  return extensionsSet.has(extension);
}
const image = config => meta => {
  const storage = meta.getStorage(config.storage);
  if (!storage) {
    throw new Error(`${meta.listKey}.${meta.fieldKey} has storage set to ${config.storage}, but no storage configuration was found for that key`);
  }
  if ('isIndexed' in config) {
    throw Error("isIndexed: 'unique' is not a supported option for field type image");
  }
  return fieldType({
    kind: 'multi',
    fields: {
      filesize: {
        kind: 'scalar',
        scalar: 'Int',
        mode: 'optional'
      },
      extension: {
        kind: 'scalar',
        scalar: 'String',
        mode: 'optional'
      },
      width: {
        kind: 'scalar',
        scalar: 'Int',
        mode: 'optional'
      },
      height: {
        kind: 'scalar',
        scalar: 'Int',
        mode: 'optional'
      },
      id: {
        kind: 'scalar',
        scalar: 'String',
        mode: 'optional'
      }
    }
  })(_objectSpread(_objectSpread({}, config), {}, {
    hooks: storage.preserve ? config.hooks : _objectSpread(_objectSpread({}, config.hooks), {}, {
      async beforeOperation(args) {
        var _config$hooks, _config$hooks$beforeO;
        await ((_config$hooks = config.hooks) === null || _config$hooks === void 0 ? void 0 : (_config$hooks$beforeO = _config$hooks.beforeOperation) === null || _config$hooks$beforeO === void 0 ? void 0 : _config$hooks$beforeO.call(_config$hooks, args));
        if (args.operation === 'update' || args.operation === 'delete') {
          const idKey = `${meta.fieldKey}_id`;
          const id = args.item[idKey];
          const extensionKey = `${meta.fieldKey}_extension`;
          const extension = args.item[extensionKey];

          // This will occur on an update where an image already existed but has been
          // changed, or on a delete, where there is no longer an item
          if ((args.operation === 'delete' || typeof args.resolvedData[meta.fieldKey].id === 'string' || args.resolvedData[meta.fieldKey].id === null) && typeof id === 'string' && typeof extension === 'string' && isValidImageExtension(extension)) {
            await args.context.images(config.storage).deleteAtSource(id, extension);
          }
        }
      }
    }),
    input: {
      create: {
        arg: inputArg,
        resolve: (data, context) => inputResolver(config.storage, data, context)
      },
      update: {
        arg: inputArg,
        resolve: (data, context) => inputResolver(config.storage, data, context)
      }
    },
    output: field({
      type: ImageFieldOutput,
      resolve(_ref) {
        let {
          value: {
            extension,
            filesize,
            height,
            id,
            width
          }
        } = _ref;
        if (extension === null || !isValidImageExtension(extension) || filesize === null || height === null || width === null || id === null) {
          return null;
        }
        return {
          extension,
          filesize,
          height,
          width,
          id,
          storage: config.storage
        };
      }
    }),
    __ksTelemetryFieldTypeName: '@keystone-6/image',
    views: '@keystone-6/core/fields/types/image/views'
  }));
};

const _excluded$8 = ["defaultValue"];
const json = function () {
  let _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  let {
      defaultValue = null
    } = _ref,
    config = _objectWithoutProperties(_ref, _excluded$8);
  return meta => {
    var _config$db;
    if (config.isIndexed === 'unique') {
      throw Error("isIndexed: 'unique' is not a supported option for field type json");
    }
    return jsonFieldTypePolyfilledForSQLite(meta.provider, _objectSpread(_objectSpread({}, config), {}, {
      __ksTelemetryFieldTypeName: '@keystone-6/json',
      input: {
        create: {
          arg: arg({
            type: JSON$1
          }),
          resolve(val) {
            return val === undefined ? defaultValue : val;
          }
        },
        update: {
          arg: arg({
            type: JSON$1
          })
        }
      },
      output: field({
        type: JSON$1
      }),
      views: '@keystone-6/core/fields/types/json/views',
      getAdminMeta: () => ({
        defaultValue
      })
    }), {
      default: defaultValue === null ? undefined : {
        kind: 'literal',
        value: JSON.stringify(defaultValue)
      },
      map: (_config$db = config.db) === null || _config$db === void 0 ? void 0 : _config$db.map
    });
  };
};

const _excluded$7 = ["bcrypt", "workFactor", "validation"];
const PasswordState = object()({
  name: 'PasswordState',
  fields: {
    isSet: field({
      type: nonNull(Boolean$3)
    })
  }
});
const PasswordFilter = inputObject({
  name: 'PasswordFilter',
  fields: {
    isSet: arg({
      type: nonNull(Boolean$3)
    })
  }
});
const bcryptHashRegex = /^\$2[aby]?\$\d{1,2}\$[.\/A-Za-z0-9]{53}$/;
const password = function () {
  let _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  let {
      bcrypt = bcryptjs,
      workFactor = 10,
      validation: _validation
    } = _ref,
    config = _objectWithoutProperties(_ref, _excluded$7);
  return meta => {
    var _config$label, _validation$isRequire, _validation$rejectCom, _validation$match$exp, _validation$length$mi, _validation$length, _validation$length$ma, _validation$length2, _config$db;
    if (config.isIndexed === 'unique') {
      throw Error("isIndexed: 'unique' is not a supported option for field type password");
    }
    const fieldLabel = (_config$label = config.label) !== null && _config$label !== void 0 ? _config$label : humanize(meta.fieldKey);
    const validation = {
      isRequired: (_validation$isRequire = _validation === null || _validation === void 0 ? void 0 : _validation.isRequired) !== null && _validation$isRequire !== void 0 ? _validation$isRequire : false,
      rejectCommon: (_validation$rejectCom = _validation === null || _validation === void 0 ? void 0 : _validation.rejectCommon) !== null && _validation$rejectCom !== void 0 ? _validation$rejectCom : false,
      match: _validation !== null && _validation !== void 0 && _validation.match ? {
        regex: _validation.match.regex,
        explanation: (_validation$match$exp = _validation.match.explanation) !== null && _validation$match$exp !== void 0 ? _validation$match$exp : `${fieldLabel} must match ${_validation.match.regex}`
      } : null,
      length: {
        min: (_validation$length$mi = _validation === null || _validation === void 0 ? void 0 : (_validation$length = _validation.length) === null || _validation$length === void 0 ? void 0 : _validation$length.min) !== null && _validation$length$mi !== void 0 ? _validation$length$mi : 8,
        max: (_validation$length$ma = _validation === null || _validation === void 0 ? void 0 : (_validation$length2 = _validation.length) === null || _validation$length2 === void 0 ? void 0 : _validation$length2.max) !== null && _validation$length$ma !== void 0 ? _validation$length$ma : null
      }
    };
    const isNullable = getResolvedIsNullable(validation, config.db);
    for (const type of ['min', 'max']) {
      const val = validation.length[type];
      if (val !== null && (!Number.isInteger(val) || val < 1)) {
        throw new Error(`The password field at ${meta.listKey}.${meta.fieldKey} specifies validation.length.${type}: ${val} but it must be a positive integer >= 1`);
      }
    }
    if (validation.length.max !== null && validation.length.min > validation.length.max) {
      throw new Error(`The password field at ${meta.listKey}.${meta.fieldKey} specifies a validation.length.max that is less than the validation.length.min, and therefore has no valid options`);
    }
    if (workFactor < 6 || workFactor > 31 || !Number.isInteger(workFactor)) {
      throw new Error(`The password field at ${meta.listKey}.${meta.fieldKey} specifies workFactor: ${workFactor} but it must be an integer between 6 and 31`);
    }
    function inputResolver(val) {
      if (val == null) {
        return val;
      }
      return bcrypt.hash(val, workFactor);
    }
    return fieldType({
      kind: 'scalar',
      scalar: 'String',
      mode: isNullable === false ? 'required' : 'optional',
      map: (_config$db = config.db) === null || _config$db === void 0 ? void 0 : _config$db.map
    })(_objectSpread(_objectSpread({}, config), {}, {
      hooks: _objectSpread(_objectSpread({}, config.hooks), {}, {
        async validateInput(args) {
          var _config$hooks, _config$hooks$validat;
          const val = args.inputData[meta.fieldKey];
          if (args.resolvedData[meta.fieldKey] === null && (validation !== null && validation !== void 0 && validation.isRequired || isNullable === false)) {
            args.addValidationError(`${fieldLabel} is required`);
          }
          if (val != null) {
            if (val.length < validation.length.min) {
              if (validation.length.min === 1) {
                args.addValidationError(`${fieldLabel} must not be empty`);
              } else {
                args.addValidationError(`${fieldLabel} must be at least ${validation.length.min} characters long`);
              }
            }
            if (validation.length.max !== null && val.length > validation.length.max) {
              args.addValidationError(`${fieldLabel} must be no longer than ${validation.length.max} characters`);
            }
            if (validation.match && !validation.match.regex.test(val)) {
              args.addValidationError(validation.match.explanation);
            }
            if (validation.rejectCommon && dumbPasswords.check(val)) {
              args.addValidationError(`${fieldLabel} is too common and is not allowed`);
            }
          }
          await ((_config$hooks = config.hooks) === null || _config$hooks === void 0 ? void 0 : (_config$hooks$validat = _config$hooks.validateInput) === null || _config$hooks$validat === void 0 ? void 0 : _config$hooks$validat.call(_config$hooks, args));
        }
      }),
      input: {
        where: isNullable === false ? undefined : {
          arg: arg({
            type: PasswordFilter
          }),
          resolve(val) {
            if (val === null) {
              throw userInputError('Password filters cannot be set to null');
            }
            if (val.isSet) {
              return {
                not: null
              };
            }
            return null;
          }
        },
        create: {
          arg: arg({
            type: String$3
          }),
          resolve(val) {
            if (val === undefined) {
              return null;
            }
            return inputResolver(val);
          }
        },
        update: {
          arg: arg({
            type: String$3
          }),
          resolve: inputResolver
        }
      },
      __ksTelemetryFieldTypeName: '@keystone-6/password',
      views: '@keystone-6/core/fields/types/password/views',
      getAdminMeta: () => ({
        isNullable,
        validation: _objectSpread(_objectSpread({}, validation), {}, {
          match: validation.match ? {
            regex: {
              source: validation.match.regex.source,
              flags: validation.match.regex.flags
            },
            explanation: validation.match.explanation
          } : null
        })
      }),
      output: field({
        type: PasswordState,
        resolve(val) {
          return {
            isSet: val.value !== null && bcryptHashRegex.test(val.value)
          };
        },
        extensions: {
          keystoneSecretField: {
            generateHash: async secret => {
              return bcrypt.hash(secret, workFactor);
            },
            compare: (secret, hash) => {
              return bcrypt.compare(secret, hash);
            }
          }
        }
      })
    }));
  };
};

const _excluded$6 = ["ref"];

// This is the default display mode for Relationships

const relationship = _ref => {
  let {
      ref
    } = _ref,
    config = _objectWithoutProperties(_ref, _excluded$6);
  return _ref2 => {
    var _config$db2;
    let {
      fieldKey,
      listKey,
      lists
    } = _ref2;
    const {
      many = false
    } = config;
    const [foreignListKey, foreignFieldKey] = ref.split('.');
    const foreignList = lists[foreignListKey];
    if (!foreignList) {
      throw new Error(`Unable to resolve list '${foreignListKey}' for field ${listKey}.${fieldKey}`);
    }
    const foreignListTypes = foreignList.types;
    const commonConfig = _objectSpread(_objectSpread({}, config), {}, {
      __ksTelemetryFieldTypeName: '@keystone-6/relationship',
      views: '@keystone-6/core/fields/types/relationship/views',
      getAdminMeta: () => {
        var _config$ui, _config$ui$hideCreate, _config$ui2, _config$ui3, _config$ui4, _config$ui5, _config$ui6;
        const adminMetaRoot = getAdminMetaForRelationshipField();
        const localListMeta = adminMetaRoot.listsByKey[listKey];
        const foreignListMeta = adminMetaRoot.listsByKey[foreignListKey];
        if (!foreignListMeta) {
          throw new Error(`The ref [${ref}] on relationship [${listKey}.${fieldKey}] is invalid`);
        }
        if (((_config$ui = config.ui) === null || _config$ui === void 0 ? void 0 : _config$ui.displayMode) === 'cards') {
          // we're checking whether the field which will be in the admin meta at the time that getAdminMeta is called.
          // in newer versions of keystone, it will be there and it will not be there for older versions of keystone.
          // this is so that relationship fields doesn't break in confusing ways
          // if people are using a slightly older version of keystone
          const currentField = localListMeta.fields.find(x => x.key === fieldKey);
          if (currentField) {
            const allForeignFields = new Set(foreignListMeta.fields.map(x => x.key));
            for (const [configOption, foreignFields] of [['ui.cardFields', config.ui.cardFields], ['ui.inlineCreate.fields', (_config$ui$inlineCrea = (_config$ui$inlineCrea2 = config.ui.inlineCreate) === null || _config$ui$inlineCrea2 === void 0 ? void 0 : _config$ui$inlineCrea2.fields) !== null && _config$ui$inlineCrea !== void 0 ? _config$ui$inlineCrea : []], ['ui.inlineEdit.fields', (_config$ui$inlineEdit = (_config$ui$inlineEdit2 = config.ui.inlineEdit) === null || _config$ui$inlineEdit2 === void 0 ? void 0 : _config$ui$inlineEdit2.fields) !== null && _config$ui$inlineEdit !== void 0 ? _config$ui$inlineEdit : []]]) {
              var _config$ui$inlineCrea, _config$ui$inlineCrea2, _config$ui$inlineEdit, _config$ui$inlineEdit2;
              for (const foreignField of foreignFields) {
                if (!allForeignFields.has(foreignField)) {
                  throw new Error(`The ${configOption} option on the relationship field at ${listKey}.${fieldKey} includes the "${foreignField}" field but that field does not exist on the "${foreignListKey}" list`);
                }
              }
            }
          }
        }
        const hideCreate = (_config$ui$hideCreate = (_config$ui2 = config.ui) === null || _config$ui2 === void 0 ? void 0 : _config$ui2.hideCreate) !== null && _config$ui$hideCreate !== void 0 ? _config$ui$hideCreate : false;
        const refLabelField = foreignListMeta.labelField;
        const refSearchFields = foreignListMeta.fields.filter(x => x.search).map(x => x.key);
        if (((_config$ui3 = config.ui) === null || _config$ui3 === void 0 ? void 0 : _config$ui3.displayMode) === 'count') {
          return {
            refFieldKey: foreignFieldKey,
            refListKey: foreignListKey,
            many,
            hideCreate,
            displayMode: 'count',
            refLabelField,
            refSearchFields
          };
        }
        if (((_config$ui4 = config.ui) === null || _config$ui4 === void 0 ? void 0 : _config$ui4.displayMode) === 'cards') {
          var _config$ui$inlineConn, _config$ui$inlineConn2, _config$ui$inlineConn3, _config$ui$linkToItem, _config$ui$removeMode, _config$ui$inlineCrea3, _config$ui$inlineEdit3;
          // prefer the local definition to the foreign list, if provided
          const inlineConnectConfig = typeof config.ui.inlineConnect === 'object' ? {
            refLabelField: (_config$ui$inlineConn = config.ui.inlineConnect.labelField) !== null && _config$ui$inlineConn !== void 0 ? _config$ui$inlineConn : refLabelField,
            refSearchFields: (_config$ui$inlineConn2 = (_config$ui$inlineConn3 = config.ui.inlineConnect) === null || _config$ui$inlineConn3 === void 0 ? void 0 : _config$ui$inlineConn3.searchFields) !== null && _config$ui$inlineConn2 !== void 0 ? _config$ui$inlineConn2 : refSearchFields
          } : {
            refLabelField,
            refSearchFields
          };
          if (!(inlineConnectConfig.refLabelField in foreignListMeta.fieldsByKey)) {
            throw new Error(`The ui.inlineConnect.labelField option for field '${listKey}.${fieldKey}' uses '${inlineConnectConfig.refLabelField}' but that field doesn't exist.`);
          }
          for (const searchFieldKey of inlineConnectConfig.refSearchFields) {
            if (!(searchFieldKey in foreignListMeta.fieldsByKey)) {
              throw new Error(`The ui.inlineConnect.searchFields option for relationship field '${listKey}.${fieldKey}' includes '${searchFieldKey}' but that field doesn't exist.`);
            }
            const field = foreignListMeta.fieldsByKey[searchFieldKey];
            if (field.search) continue;
            throw new Error(`The ui.searchFields option for field '${listKey}.${fieldKey}' includes '${searchFieldKey}' but that field doesn't have a contains filter that accepts a GraphQL String`);
          }
          return _objectSpread({
            refFieldKey: foreignFieldKey,
            refListKey: foreignListKey,
            many,
            hideCreate,
            displayMode: 'cards',
            cardFields: config.ui.cardFields,
            linkToItem: (_config$ui$linkToItem = config.ui.linkToItem) !== null && _config$ui$linkToItem !== void 0 ? _config$ui$linkToItem : false,
            removeMode: (_config$ui$removeMode = config.ui.removeMode) !== null && _config$ui$removeMode !== void 0 ? _config$ui$removeMode : 'disconnect',
            inlineCreate: (_config$ui$inlineCrea3 = config.ui.inlineCreate) !== null && _config$ui$inlineCrea3 !== void 0 ? _config$ui$inlineCrea3 : null,
            inlineEdit: (_config$ui$inlineEdit3 = config.ui.inlineEdit) !== null && _config$ui$inlineEdit3 !== void 0 ? _config$ui$inlineEdit3 : null,
            inlineConnect: config.ui.inlineConnect ? true : false
          }, inlineConnectConfig);
        }

        // prefer the local definition to the foreign list, if provided
        const specificRefLabelField = ((_config$ui5 = config.ui) === null || _config$ui5 === void 0 ? void 0 : _config$ui5.labelField) || refLabelField;
        const specificRefSearchFields = ((_config$ui6 = config.ui) === null || _config$ui6 === void 0 ? void 0 : _config$ui6.searchFields) || refSearchFields;
        if (!(specificRefLabelField in foreignListMeta.fieldsByKey)) {
          throw new Error(`The ui.labelField option for field '${listKey}.${fieldKey}' uses '${specificRefLabelField}' but that field doesn't exist.`);
        }
        for (const searchFieldKey of specificRefSearchFields) {
          if (!(searchFieldKey in foreignListMeta.fieldsByKey)) {
            throw new Error(`The ui.searchFields option for relationship field '${listKey}.${fieldKey}' includes '${searchFieldKey}' but that field doesn't exist.`);
          }
          const field = foreignListMeta.fieldsByKey[searchFieldKey];
          if (field.search) continue;
          throw new Error(`The ui.searchFields option for field '${listKey}.${fieldKey}' includes '${searchFieldKey}' but that field doesn't have a contains filter that accepts a GraphQL String`);
        }
        return {
          refFieldKey: foreignFieldKey,
          refListKey: foreignListKey,
          many,
          hideCreate,
          displayMode: 'select',
          refLabelField: specificRefLabelField,
          refSearchFields: specificRefSearchFields
        };
      }
    });
    if (config.many) {
      var _config$db;
      return fieldType({
        kind: 'relation',
        mode: 'many',
        list: foreignListKey,
        field: foreignFieldKey,
        relationName: (_config$db = config.db) === null || _config$db === void 0 ? void 0 : _config$db.relationName
      })(_objectSpread(_objectSpread({}, commonConfig), {}, {
        input: {
          where: {
            arg: arg({
              type: foreignListTypes.relateTo.many.where
            }),
            resolve(value, context, resolve) {
              return resolve(value);
            }
          },
          create: foreignListTypes.relateTo.many.create && {
            arg: arg({
              type: foreignListTypes.relateTo.many.create
            }),
            async resolve(value, context, resolve) {
              return resolve(value);
            }
          },
          update: foreignListTypes.relateTo.many.update && {
            arg: arg({
              type: foreignListTypes.relateTo.many.update
            }),
            async resolve(value, context, resolve) {
              return resolve(value);
            }
          }
        },
        output: field({
          args: foreignListTypes.findManyArgs,
          type: list(nonNull(foreignListTypes.output)),
          resolve(_ref3, args) {
            let {
              value
            } = _ref3;
            return value.findMany(args);
          }
        }),
        extraOutputFields: {
          [`${fieldKey}Count`]: field({
            type: Int$3,
            args: {
              where: arg({
                type: nonNull(foreignListTypes.where),
                defaultValue: {}
              })
            },
            resolve(_ref4, args) {
              let {
                value
              } = _ref4;
              return value.count({
                where: args.where
              });
            }
          })
        }
      }));
    }
    return fieldType({
      kind: 'relation',
      mode: 'one',
      list: foreignListKey,
      field: foreignFieldKey,
      foreignKey: (_config$db2 = config.db) === null || _config$db2 === void 0 ? void 0 : _config$db2.foreignKey
    })(_objectSpread(_objectSpread({}, commonConfig), {}, {
      input: {
        where: {
          arg: arg({
            type: foreignListTypes.where
          }),
          resolve(value, context, resolve) {
            return resolve(value);
          }
        },
        create: foreignListTypes.relateTo.one.create && {
          arg: arg({
            type: foreignListTypes.relateTo.one.create
          }),
          async resolve(value, context, resolve) {
            return resolve(value);
          }
        },
        update: foreignListTypes.relateTo.one.update && {
          arg: arg({
            type: foreignListTypes.relateTo.one.update
          }),
          async resolve(value, context, resolve) {
            return resolve(value);
          }
        }
      },
      output: field({
        type: foreignListTypes.output,
        resolve(_ref5) {
          let {
            value
          } = _ref5;
          return value();
        }
      })
    }));
  };
};

const _excluded$5 = ["displayMode"],
  _excluded2 = ["isIndexed", "ui", "defaultValue", "validation"];
// These are the max and min values available to a 32 bit signed integer
const MAX_INT$1 = 2147483647;
const MIN_INT$1 = -2147483648;
const select = _ref => {
  let {
      isIndexed,
      ui: {
        displayMode = 'select'
      } = {},
      defaultValue,
      validation
    } = _ref,
    ui = _objectWithoutProperties(_ref.ui, _excluded$5),
    config = _objectWithoutProperties(_ref, _excluded2);
  return meta => {
    var _config$label, _config$db;
    const fieldLabel = (_config$label = config.label) !== null && _config$label !== void 0 ? _config$label : humanize(meta.fieldKey);
    const resolvedIsNullable = getResolvedIsNullable(validation, config.db);
    assertReadIsNonNullAllowed(meta, config, resolvedIsNullable);
    assertCreateIsNonNullAllowed(meta, config);
    const commonConfig = options => {
      const values = new Set(options.map(x => x.value));
      if (values.size !== options.length) {
        throw new Error(`The select field at ${meta.listKey}.${meta.fieldKey} has duplicate options, this is not allowed`);
      }
      return _objectSpread(_objectSpread({}, config), {}, {
        ui,
        hooks: _objectSpread(_objectSpread({}, config.hooks), {}, {
          async validateInput(args) {
            var _config$hooks, _config$hooks$validat;
            const value = args.resolvedData[meta.fieldKey];
            if (value != null && !values.has(value)) {
              args.addValidationError(`${value} is not a possible value for ${fieldLabel}`);
            }
            if ((validation !== null && validation !== void 0 && validation.isRequired || resolvedIsNullable === false) && (value === null || value === undefined && args.operation === 'create')) {
              args.addValidationError(`${fieldLabel} is required`);
            }
            await ((_config$hooks = config.hooks) === null || _config$hooks === void 0 ? void 0 : (_config$hooks$validat = _config$hooks.validateInput) === null || _config$hooks$validat === void 0 ? void 0 : _config$hooks$validat.call(_config$hooks, args));
          }
        }),
        __ksTelemetryFieldTypeName: '@keystone-6/select',
        views: '@keystone-6/core/fields/types/select/views',
        getAdminMeta: () => {
          var _config$type, _validation$isRequire;
          return {
            options,
            type: (_config$type = config.type) !== null && _config$type !== void 0 ? _config$type : 'string',
            displayMode: displayMode,
            defaultValue: defaultValue !== null && defaultValue !== void 0 ? defaultValue : null,
            isRequired: (_validation$isRequire = validation === null || validation === void 0 ? void 0 : validation.isRequired) !== null && _validation$isRequire !== void 0 ? _validation$isRequire : false
          };
        }
      });
    };
    const mode = resolvedIsNullable === false ? 'required' : 'optional';
    const commonDbFieldConfig = {
      mode,
      index: isIndexed === true ? 'index' : isIndexed || undefined,
      default: defaultValue === undefined ? undefined : {
        kind: 'literal',
        value: defaultValue
      },
      map: (_config$db = config.db) === null || _config$db === void 0 ? void 0 : _config$db.map
    };
    const resolveCreate = val => {
      if (val === undefined) {
        var _ref2;
        return (_ref2 = defaultValue) !== null && _ref2 !== void 0 ? _ref2 : null;
      }
      return val;
    };
    const output = type => {
      var _config$graphql, _config$graphql$read;
      return (_config$graphql = config.graphql) !== null && _config$graphql !== void 0 && (_config$graphql$read = _config$graphql.read) !== null && _config$graphql$read !== void 0 && _config$graphql$read.isNonNull ? nonNull(type) : type;
    };
    const create = type => {
      var _config$graphql2, _config$graphql2$read;
      const isNonNull = ((_config$graphql2 = config.graphql) === null || _config$graphql2 === void 0 ? void 0 : (_config$graphql2$read = _config$graphql2.read) === null || _config$graphql2$read === void 0 ? void 0 : _config$graphql2$read.isNonNull) === true;
      return arg({
        type: isNonNull ? nonNull(type) : type,
        defaultValue: isNonNull ? defaultValue : undefined
      });
    };
    if (config.type === 'integer') {
      if (config.options.some(_ref3 => {
        let {
          value
        } = _ref3;
        return !Number.isInteger(value) || value > MAX_INT$1 || value < MIN_INT$1;
      })) {
        throw new Error(`The select field at ${meta.listKey}.${meta.fieldKey} specifies integer values that are outside the range of a 32 bit signed integer`);
      }
      return fieldType(_objectSpread({
        kind: 'scalar',
        scalar: 'Int'
      }, commonDbFieldConfig))(_objectSpread(_objectSpread({}, commonConfig(config.options)), {}, {
        input: {
          uniqueWhere: isIndexed === 'unique' ? {
            arg: arg({
              type: Int$3
            })
          } : undefined,
          where: {
            arg: arg({
              type: filters[meta.provider].Int[mode]
            }),
            resolve: mode === 'required' ? undefined : resolveCommon
          },
          create: {
            arg: create(Int$3),
            resolve: resolveCreate
          },
          update: {
            arg: arg({
              type: Int$3
            })
          },
          orderBy: {
            arg: arg({
              type: orderDirectionEnum
            })
          }
        },
        output: field({
          type: output(Int$3)
        })
      }));
    }
    const options = config.options.map(option => {
      if (typeof option === 'string') {
        return {
          label: humanize(option),
          value: option
        };
      }
      return option;
    });
    if (config.type === 'enum') {
      const enumName = `${meta.listKey}${inflection.classify(meta.fieldKey)}Type`;
      const graphQLType = enum$1({
        name: enumName,
        values: enumValues(options.map(x => x.value))
      });
      return fieldType(meta.provider === 'sqlite' ? _objectSpread({
        kind: 'scalar',
        scalar: 'String'
      }, commonDbFieldConfig) : _objectSpread({
        kind: 'enum',
        values: options.map(x => x.value),
        name: enumName
      }, commonDbFieldConfig))(_objectSpread(_objectSpread({}, commonConfig(options)), {}, {
        input: {
          uniqueWhere: isIndexed === 'unique' ? {
            arg: arg({
              type: graphQLType
            })
          } : undefined,
          where: {
            arg: arg({
              type: filters[meta.provider].enum(graphQLType).optional
            }),
            resolve: mode === 'required' ? undefined : resolveCommon
          },
          create: {
            arg: create(graphQLType),
            resolve: resolveCreate
          },
          update: {
            arg: arg({
              type: graphQLType
            })
          },
          orderBy: {
            arg: arg({
              type: orderDirectionEnum
            })
          }
        },
        output: field({
          type: output(graphQLType)
        })
      }));
    }
    return fieldType(_objectSpread({
      kind: 'scalar',
      scalar: 'String'
    }, commonDbFieldConfig))(_objectSpread(_objectSpread({}, commonConfig(options)), {}, {
      input: {
        uniqueWhere: isIndexed === 'unique' ? {
          arg: arg({
            type: String$3
          })
        } : undefined,
        where: {
          arg: arg({
            type: filters[meta.provider].String[mode]
          }),
          resolve: mode === 'required' ? undefined : resolveString
        },
        create: {
          arg: create(String$3),
          resolve: resolveCreate
        },
        update: {
          arg: arg({
            type: String$3
          })
        },
        orderBy: {
          arg: arg({
            type: orderDirectionEnum
          })
        }
      },
      output: field({
        type: output(String$3)
      })
    }));
  };
};

const _excluded$4 = ["isIndexed", "defaultValue", "validation"];
const text = function () {
  let _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  let {
      isIndexed,
      defaultValue: _defaultValue,
      validation: _validation
    } = _ref,
    config = _objectWithoutProperties(_ref, _excluded$4);
  return meta => {
    var _validation$length2, _validation$length3, _validation$length4, _validation$length5, _validation$length$mi, _validation$length6, _validation$length7, _validation$length8, _config$db$isNullable, _config$db, _config$label, _config$db2, _config$db3, _config$graphql, _config$graphql$creat, _config$graphql2, _config$graphql2$crea, _config$graphql3, _config$graphql3$read;
    for (const type of ['min', 'max']) {
      var _validation$length;
      const val = _validation === null || _validation === void 0 ? void 0 : (_validation$length = _validation.length) === null || _validation$length === void 0 ? void 0 : _validation$length[type];
      if (val !== undefined && (!Number.isInteger(val) || val < 0)) {
        throw new Error(`The text field at ${meta.listKey}.${meta.fieldKey} specifies validation.length.${type}: ${val} but it must be a positive integer`);
      }
      if (_validation !== null && _validation !== void 0 && _validation.isRequired && val !== undefined && val === 0) {
        throw new Error(`The text field at ${meta.listKey}.${meta.fieldKey} specifies validation.isRequired: true and validation.length.${type}: 0, this is not allowed because validation.isRequired implies at least a min length of 1`);
      }
    }
    if ((_validation === null || _validation === void 0 ? void 0 : (_validation$length2 = _validation.length) === null || _validation$length2 === void 0 ? void 0 : _validation$length2.min) !== undefined && (_validation === null || _validation === void 0 ? void 0 : (_validation$length3 = _validation.length) === null || _validation$length3 === void 0 ? void 0 : _validation$length3.max) !== undefined && (_validation === null || _validation === void 0 ? void 0 : (_validation$length4 = _validation.length) === null || _validation$length4 === void 0 ? void 0 : _validation$length4.min) > (_validation === null || _validation === void 0 ? void 0 : (_validation$length5 = _validation.length) === null || _validation$length5 === void 0 ? void 0 : _validation$length5.max)) {
      throw new Error(`The text field at ${meta.listKey}.${meta.fieldKey} specifies a validation.length.max that is less than the validation.length.min, and therefore has no valid options`);
    }
    const validation = _objectSpread(_objectSpread({}, _validation), {}, {
      length: {
        min: _validation !== null && _validation !== void 0 && _validation.isRequired ? (_validation$length$mi = _validation === null || _validation === void 0 ? void 0 : (_validation$length6 = _validation.length) === null || _validation$length6 === void 0 ? void 0 : _validation$length6.min) !== null && _validation$length$mi !== void 0 ? _validation$length$mi : 1 : _validation === null || _validation === void 0 ? void 0 : (_validation$length7 = _validation.length) === null || _validation$length7 === void 0 ? void 0 : _validation$length7.min,
        max: _validation === null || _validation === void 0 ? void 0 : (_validation$length8 = _validation.length) === null || _validation$length8 === void 0 ? void 0 : _validation$length8.max
      }
    });

    // defaulted to false as a zero length string is preferred to null
    const isNullable = (_config$db$isNullable = (_config$db = config.db) === null || _config$db === void 0 ? void 0 : _config$db.isNullable) !== null && _config$db$isNullable !== void 0 ? _config$db$isNullable : false;
    const fieldLabel = (_config$label = config.label) !== null && _config$label !== void 0 ? _config$label : humanize(meta.fieldKey);
    assertReadIsNonNullAllowed(meta, config, isNullable);
    assertCreateIsNonNullAllowed(meta, config);
    const mode = isNullable ? 'optional' : 'required';
    const defaultValue = isNullable === false || _defaultValue !== undefined ? _defaultValue || '' : undefined;
    return fieldType({
      kind: 'scalar',
      mode,
      scalar: 'String',
      default: defaultValue === undefined ? undefined : {
        kind: 'literal',
        value: defaultValue
      },
      index: isIndexed === true ? 'index' : isIndexed || undefined,
      map: (_config$db2 = config.db) === null || _config$db2 === void 0 ? void 0 : _config$db2.map,
      nativeType: (_config$db3 = config.db) === null || _config$db3 === void 0 ? void 0 : _config$db3.nativeType
    })(_objectSpread(_objectSpread({}, config), {}, {
      hooks: _objectSpread(_objectSpread({}, config.hooks), {}, {
        async validateInput(args) {
          var _config$hooks, _config$hooks$validat;
          const val = args.resolvedData[meta.fieldKey];
          if (val === null && (validation !== null && validation !== void 0 && validation.isRequired || isNullable === false)) {
            args.addValidationError(`${fieldLabel} is required`);
          }
          if (val != null) {
            var _validation$length9, _validation$length10;
            if ((validation === null || validation === void 0 ? void 0 : (_validation$length9 = validation.length) === null || _validation$length9 === void 0 ? void 0 : _validation$length9.min) !== undefined && val.length < validation.length.min) {
              if (validation.length.min === 1) {
                args.addValidationError(`${fieldLabel} must not be empty`);
              } else {
                args.addValidationError(`${fieldLabel} must be at least ${validation.length.min} characters long`);
              }
            }
            if ((validation === null || validation === void 0 ? void 0 : (_validation$length10 = validation.length) === null || _validation$length10 === void 0 ? void 0 : _validation$length10.max) !== undefined && val.length > validation.length.max) {
              args.addValidationError(`${fieldLabel} must be no longer than ${validation.length.max} characters`);
            }
            if (validation !== null && validation !== void 0 && validation.match && !validation.match.regex.test(val)) {
              args.addValidationError(validation.match.explanation || `${fieldLabel} must match ${validation.match.regex}`);
            }
          }
          await ((_config$hooks = config.hooks) === null || _config$hooks === void 0 ? void 0 : (_config$hooks$validat = _config$hooks.validateInput) === null || _config$hooks$validat === void 0 ? void 0 : _config$hooks$validat.call(_config$hooks, args));
        }
      }),
      input: {
        uniqueWhere: isIndexed === 'unique' ? {
          arg: arg({
            type: String$3
          })
        } : undefined,
        where: {
          arg: arg({
            type: filters[meta.provider].String[mode]
          }),
          resolve: mode === 'required' ? undefined : resolveString
        },
        create: {
          arg: arg({
            type: (_config$graphql = config.graphql) !== null && _config$graphql !== void 0 && (_config$graphql$creat = _config$graphql.create) !== null && _config$graphql$creat !== void 0 && _config$graphql$creat.isNonNull ? nonNull(String$3) : String$3,
            defaultValue: (_config$graphql2 = config.graphql) !== null && _config$graphql2 !== void 0 && (_config$graphql2$crea = _config$graphql2.create) !== null && _config$graphql2$crea !== void 0 && _config$graphql2$crea.isNonNull ? defaultValue : undefined
          }),
          resolve(val) {
            if (val === undefined) {
              return defaultValue !== null && defaultValue !== void 0 ? defaultValue : null;
            }
            return val;
          }
        },
        update: {
          arg: arg({
            type: String$3
          })
        },
        orderBy: {
          arg: arg({
            type: orderDirectionEnum
          })
        }
      },
      output: field({
        type: (_config$graphql3 = config.graphql) !== null && _config$graphql3 !== void 0 && (_config$graphql3$read = _config$graphql3.read) !== null && _config$graphql3$read !== void 0 && _config$graphql3$read.isNonNull ? nonNull(String$3) : String$3
      }),
      __ksTelemetryFieldTypeName: '@keystone-6/text',
      views: '@keystone-6/core/fields/types/text/views',
      getAdminMeta() {
        var _config$ui$displayMod, _config$ui, _validation$isRequire, _validation$match$exp, _validation$length$ma, _validation$length11, _validation$length$mi2, _validation$length12;
        return {
          displayMode: (_config$ui$displayMod = (_config$ui = config.ui) === null || _config$ui === void 0 ? void 0 : _config$ui.displayMode) !== null && _config$ui$displayMod !== void 0 ? _config$ui$displayMod : 'input',
          shouldUseModeInsensitive: meta.provider === 'postgresql',
          validation: {
            isRequired: (_validation$isRequire = validation === null || validation === void 0 ? void 0 : validation.isRequired) !== null && _validation$isRequire !== void 0 ? _validation$isRequire : false,
            match: validation !== null && validation !== void 0 && validation.match ? {
              regex: {
                source: validation.match.regex.source,
                flags: validation.match.regex.flags
              },
              explanation: (_validation$match$exp = validation.match.explanation) !== null && _validation$match$exp !== void 0 ? _validation$match$exp : null
            } : null,
            length: {
              max: (_validation$length$ma = validation === null || validation === void 0 ? void 0 : (_validation$length11 = validation.length) === null || _validation$length11 === void 0 ? void 0 : _validation$length11.max) !== null && _validation$length$ma !== void 0 ? _validation$length$ma : null,
              min: (_validation$length$mi2 = validation === null || validation === void 0 ? void 0 : (_validation$length12 = validation.length) === null || _validation$length12 === void 0 ? void 0 : _validation$length12.min) !== null && _validation$length$mi2 !== void 0 ? _validation$length$mi2 : null
            }
          },
          defaultValue: defaultValue !== null && defaultValue !== void 0 ? defaultValue : isNullable ? null : '',
          isNullable
        };
      }
    }));
  };
};

const _excluded$3 = ["isIndexed", "validation", "defaultValue"];
const timestamp = function () {
  let _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  let {
      isIndexed,
      validation,
      defaultValue
    } = _ref,
    config = _objectWithoutProperties(_ref, _excluded$3);
  return meta => {
    var _config$label, _config$db, _config$db2, _config$graphql, _config$graphql$creat, _config$graphql2, _config$graphql2$crea, _config$graphql3, _config$graphql3$read;
    if (typeof defaultValue === 'string') {
      try {
        DateTime$3.graphQLType.parseValue(defaultValue);
      } catch (err) {
        throw new Error(`The timestamp field at ${meta.listKey}.${meta.fieldKey} specifies defaultValue: ${defaultValue} but values must be provided as a full ISO8601 date-time string such as ${new Date().toISOString()}`);
      }
    }
    const parsedDefaultValue = typeof defaultValue === 'string' ? DateTime$3.graphQLType.parseValue(defaultValue) : defaultValue;
    const resolvedIsNullable = getResolvedIsNullable(validation, config.db);
    assertReadIsNonNullAllowed(meta, config, resolvedIsNullable);
    assertCreateIsNonNullAllowed(meta, config);
    const mode = resolvedIsNullable === false ? 'required' : 'optional';
    const fieldLabel = (_config$label = config.label) !== null && _config$label !== void 0 ? _config$label : humanize(meta.fieldKey);
    return fieldType({
      kind: 'scalar',
      mode,
      scalar: 'DateTime',
      index: isIndexed === true ? 'index' : isIndexed || undefined,
      default: typeof defaultValue === 'string' ? {
        kind: 'literal',
        value: defaultValue
      } : defaultValue === undefined ? undefined : {
        kind: 'now'
      },
      updatedAt: (_config$db = config.db) === null || _config$db === void 0 ? void 0 : _config$db.updatedAt,
      map: (_config$db2 = config.db) === null || _config$db2 === void 0 ? void 0 : _config$db2.map
    })(_objectSpread(_objectSpread({}, config), {}, {
      hooks: _objectSpread(_objectSpread({}, config.hooks), {}, {
        async validateInput(args) {
          var _config$hooks, _config$hooks$validat;
          const value = args.resolvedData[meta.fieldKey];
          if ((validation !== null && validation !== void 0 && validation.isRequired || resolvedIsNullable === false) && value === null) {
            args.addValidationError(`${fieldLabel} is required`);
          }
          await ((_config$hooks = config.hooks) === null || _config$hooks === void 0 ? void 0 : (_config$hooks$validat = _config$hooks.validateInput) === null || _config$hooks$validat === void 0 ? void 0 : _config$hooks$validat.call(_config$hooks, args));
        }
      }),
      input: {
        uniqueWhere: isIndexed === 'unique' ? {
          arg: arg({
            type: DateTime$3
          })
        } : undefined,
        where: {
          arg: arg({
            type: filters[meta.provider].DateTime[mode]
          }),
          resolve: mode === 'optional' ? resolveCommon : undefined
        },
        create: {
          arg: arg({
            type: (_config$graphql = config.graphql) !== null && _config$graphql !== void 0 && (_config$graphql$creat = _config$graphql.create) !== null && _config$graphql$creat !== void 0 && _config$graphql$creat.isNonNull ? nonNull(DateTime$3) : DateTime$3,
            defaultValue: (_config$graphql2 = config.graphql) !== null && _config$graphql2 !== void 0 && (_config$graphql2$crea = _config$graphql2.create) !== null && _config$graphql2$crea !== void 0 && _config$graphql2$crea.isNonNull && parsedDefaultValue instanceof Date ? parsedDefaultValue : undefined
          }),
          resolve(val) {
            if (val === undefined) {
              var _config$db3;
              if (parsedDefaultValue === undefined && (_config$db3 = config.db) !== null && _config$db3 !== void 0 && _config$db3.updatedAt) {
                return undefined;
              }
              if (parsedDefaultValue instanceof Date || parsedDefaultValue === undefined) {
                val = parsedDefaultValue !== null && parsedDefaultValue !== void 0 ? parsedDefaultValue : null;
              } else {
                val = new Date();
              }
            }
            return val;
          }
        },
        update: {
          arg: arg({
            type: DateTime$3
          })
        },
        orderBy: {
          arg: arg({
            type: orderDirectionEnum
          })
        }
      },
      output: field({
        type: (_config$graphql3 = config.graphql) !== null && _config$graphql3 !== void 0 && (_config$graphql3$read = _config$graphql3.read) !== null && _config$graphql3$read !== void 0 && _config$graphql3$read.isNonNull ? nonNull(DateTime$3) : DateTime$3
      }),
      __ksTelemetryFieldTypeName: '@keystone-6/timestamp',
      views: '@keystone-6/core/fields/types/timestamp/views',
      getAdminMeta() {
        var _validation$isRequire, _config$db$updatedAt, _config$db4;
        return {
          defaultValue: defaultValue !== null && defaultValue !== void 0 ? defaultValue : null,
          isRequired: (_validation$isRequire = validation === null || validation === void 0 ? void 0 : validation.isRequired) !== null && _validation$isRequire !== void 0 ? _validation$isRequire : false,
          updatedAt: (_config$db$updatedAt = (_config$db4 = config.db) === null || _config$db4 === void 0 ? void 0 : _config$db4.updatedAt) !== null && _config$db$updatedAt !== void 0 ? _config$db$updatedAt : false
        };
      }
    }));
  };
};

const _excluded$2 = ["field"];
const virtual = _ref => {
  let {
      field: field$1
    } = _ref,
    config = _objectWithoutProperties(_ref, _excluded$2);
  return meta => {
    var _config$ui, _config$ui2, _config$ui2$itemView, _config$ui3, _config$ui3$listView;
    const usableField = typeof field$1 === 'function' ? field$1(meta.lists) : field$1;
    const namedType = getNamedType(usableField.type.graphQLType);
    const hasRequiredArgs = usableField.args && Object.values(usableField.args).some(x => x.type.kind === 'non-null' && x.defaultValue === undefined);
    if ((!isLeafType(namedType) || hasRequiredArgs) && !((_config$ui = config.ui) !== null && _config$ui !== void 0 && _config$ui.query) && (((_config$ui2 = config.ui) === null || _config$ui2 === void 0 ? void 0 : (_config$ui2$itemView = _config$ui2.itemView) === null || _config$ui2$itemView === void 0 ? void 0 : _config$ui2$itemView.fieldMode) !== 'hidden' || ((_config$ui3 = config.ui) === null || _config$ui3 === void 0 ? void 0 : (_config$ui3$listView = _config$ui3.listView) === null || _config$ui3$listView === void 0 ? void 0 : _config$ui3$listView.fieldMode) !== 'hidden')) {
      throw new Error(`The virtual field at ${meta.listKey}.${meta.fieldKey} requires a selection for the Admin UI but ui.query is unspecified and ui.listView.fieldMode and ui.itemView.fieldMode are not both set to 'hidden'.\n` + `Either set ui.query with what the Admin UI should fetch or hide the field from the Admin UI by setting ui.listView.fieldMode and ui.itemView.fieldMode to 'hidden'.\n` + `When setting ui.query, it is interpolated into a GraphQL query like this:\n` + `query {\n` + `  ${getGqlNames({
        listKey: meta.listKey,
        pluralGraphQLName: ''
      }).itemQueryName}(where: { id: "..." }) {\n` + `    ${meta.fieldKey}\${ui.query}\n` + `  }\n` + `}`);
    }
    return fieldType({
      kind: 'none'
    })(_objectSpread(_objectSpread({}, config), {}, {
      output: field(_objectSpread(_objectSpread({}, usableField), {}, {
        resolve(_ref2) {
          let {
            item
          } = _ref2;
          for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
            args[_key - 1] = arguments[_key];
          }
          return usableField.resolve(item, ...args);
        }
      })),
      __ksTelemetryFieldTypeName: '@keystone-6/virtual',
      views: '@keystone-6/core/fields/types/virtual/views',
      getAdminMeta: () => {
        var _config$ui4;
        return {
          query: ((_config$ui4 = config.ui) === null || _config$ui4 === void 0 ? void 0 : _config$ui4.query) || ''
        };
      }
    }));
  };
};

const _excluded$1 = ["isIndexed", "validation", "defaultValue"];
const calendarDay = function () {
  let _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  let {
      isIndexed,
      validation,
      defaultValue
    } = _ref,
    config = _objectWithoutProperties(_ref, _excluded$1);
  return meta => {
    var _config$label, _config$db, _config$graphql, _config$graphql$creat, _config$graphql2, _config$graphql2$crea, _config$graphql3, _config$graphql3$read;
    if (typeof defaultValue === 'string') {
      try {
        CalendarDay.graphQLType.parseValue(defaultValue);
      } catch (err) {
        throw new Error(`The calendarDay field at ${meta.listKey}.${meta.fieldKey} specifies defaultValue: ${defaultValue} but values must be provided as a full-date ISO8601 string such as 1970-01-01`);
      }
    }
    const resolvedIsNullable = getResolvedIsNullable(validation, config.db);
    assertReadIsNonNullAllowed(meta, config, resolvedIsNullable);
    assertCreateIsNonNullAllowed(meta, config);
    const mode = resolvedIsNullable === false ? 'required' : 'optional';
    const fieldLabel = (_config$label = config.label) !== null && _config$label !== void 0 ? _config$label : humanize(meta.fieldKey);
    const usesNativeDateType = meta.provider === 'postgresql' || meta.provider === 'mysql';
    const resolveInput = value => {
      if (meta.provider === 'sqlite' || value == null) {
        return value;
      }
      return dateStringToDateObjectInUTC(value);
    };
    const commonResolveFilter = mode === 'optional' ? resolveCommon : x => x;
    return fieldType({
      kind: 'scalar',
      mode,
      scalar: usesNativeDateType ? 'DateTime' : 'String',
      index: isIndexed === true ? 'index' : isIndexed || undefined,
      default: typeof defaultValue === 'string' ? {
        kind: 'literal',
        value: defaultValue
      } : undefined,
      map: (_config$db = config.db) === null || _config$db === void 0 ? void 0 : _config$db.map,
      nativeType: usesNativeDateType ? 'Date' : undefined
    })(_objectSpread(_objectSpread({}, config), {}, {
      hooks: _objectSpread(_objectSpread({}, config.hooks), {}, {
        async validateInput(args) {
          var _config$hooks, _config$hooks$validat;
          const value = args.resolvedData[meta.fieldKey];
          if ((validation !== null && validation !== void 0 && validation.isRequired || resolvedIsNullable === false) && value === null) {
            args.addValidationError(`${fieldLabel} is required`);
          }
          await ((_config$hooks = config.hooks) === null || _config$hooks === void 0 ? void 0 : (_config$hooks$validat = _config$hooks.validateInput) === null || _config$hooks$validat === void 0 ? void 0 : _config$hooks$validat.call(_config$hooks, args));
        }
      }),
      input: {
        uniqueWhere: isIndexed === 'unique' ? {
          arg: arg({
            type: CalendarDay
          }),
          resolve: usesNativeDateType ? dateStringToDateObjectInUTC : undefined
        } : undefined,
        where: {
          arg: arg({
            type: mode === 'optional' ? CalendarDayNullableFilter : CalendarDayFilter
          }),
          resolve: usesNativeDateType ? value => commonResolveFilter(transformFilterDateStringsToDateObjects(value)) : commonResolveFilter
        },
        create: {
          arg: arg({
            type: (_config$graphql = config.graphql) !== null && _config$graphql !== void 0 && (_config$graphql$creat = _config$graphql.create) !== null && _config$graphql$creat !== void 0 && _config$graphql$creat.isNonNull ? nonNull(CalendarDay) : CalendarDay,
            defaultValue: (_config$graphql2 = config.graphql) !== null && _config$graphql2 !== void 0 && (_config$graphql2$crea = _config$graphql2.create) !== null && _config$graphql2$crea !== void 0 && _config$graphql2$crea.isNonNull ? defaultValue : undefined
          }),
          resolve(val) {
            if (val === undefined) {
              val = defaultValue !== null && defaultValue !== void 0 ? defaultValue : null;
            }
            return resolveInput(val);
          }
        },
        update: {
          arg: arg({
            type: CalendarDay
          }),
          resolve: resolveInput
        },
        orderBy: {
          arg: arg({
            type: orderDirectionEnum
          })
        }
      },
      output: field({
        type: (_config$graphql3 = config.graphql) !== null && _config$graphql3 !== void 0 && (_config$graphql3$read = _config$graphql3.read) !== null && _config$graphql3$read !== void 0 && _config$graphql3$read.isNonNull ? nonNull(CalendarDay) : CalendarDay,
        resolve(_ref2) {
          let {
            value
          } = _ref2;
          if (value instanceof Date) {
            return value.toISOString().slice(0, 10);
          }
          return value;
        }
      }),
      __ksTelemetryFieldTypeName: '@keystone-6/calendarDay',
      views: '@keystone-6/core/fields/types/calendarDay/views',
      getAdminMeta() {
        var _validation$isRequire;
        return {
          defaultValue: defaultValue !== null && defaultValue !== void 0 ? defaultValue : null,
          isRequired: (_validation$isRequire = validation === null || validation === void 0 ? void 0 : validation.isRequired) !== null && _validation$isRequire !== void 0 ? _validation$isRequire : false
        };
      }
    }));
  };
};
const dateStringToDateObjectInUTC = value => new Date(`${value}T00:00Z`);
function transformFilterDateStringsToDateObjects(filter) {
  if (filter === null) {
    return filter;
  }
  return Object.fromEntries(Object.entries(filter).map(_ref3 => {
    let [key, value] = _ref3;
    if (value == null) {
      return [key, value];
    }
    if (Array.isArray(value)) {
      return [key, value.map(dateStringToDateObjectInUTC)];
    }
    if (typeof value === 'object') {
      return [key, transformFilterDateStringsToDateObjects(value)];
    }
    return [key, dateStringToDateObjectInUTC(value)];
  }));
}
const filterFields = nestedType => ({
  equals: arg({
    type: CalendarDay
  }),
  in: arg({
    type: list(nonNull(CalendarDay))
  }),
  notIn: arg({
    type: list(nonNull(CalendarDay))
  }),
  lt: arg({
    type: CalendarDay
  }),
  lte: arg({
    type: CalendarDay
  }),
  gt: arg({
    type: CalendarDay
  }),
  gte: arg({
    type: CalendarDay
  }),
  not: arg({
    type: nestedType
  })
});
const CalendarDayNullableFilter = inputObject({
  name: 'CalendarDayNullableFilter',
  fields: () => filterFields(CalendarDayNullableFilter)
});
const CalendarDayFilter = inputObject({
  name: 'CalendarDayFilter',
  fields: () => filterFields(CalendarDayFilter)
});

const _excluded = ["defaultValue"];
// These are the max and min values available to a 32 bit signed integer
const MAX_INT = 2147483647;
const MIN_INT = -2147483648;
const multiselect = _ref => {
  let {
      defaultValue = []
    } = _ref,
    config = _objectWithoutProperties(_ref, _excluded);
  return meta => {
    var _config$label, _config$db;
    if (config.isIndexed === 'unique') {
      throw Error("isIndexed: 'unique' is not a supported option for field type multiselect");
    }
    const fieldLabel = (_config$label = config.label) !== null && _config$label !== void 0 ? _config$label : humanize(meta.fieldKey);
    assertReadIsNonNullAllowed(meta, config, false);
    assertCreateIsNonNullAllowed(meta, config);
    const output = type => {
      var _config$graphql, _config$graphql$read;
      return (_config$graphql = config.graphql) !== null && _config$graphql !== void 0 && (_config$graphql$read = _config$graphql.read) !== null && _config$graphql$read !== void 0 && _config$graphql$read.isNonNull ? nonNull(nonNullList(type)) : nonNullList(type);
    };
    const create = type => {
      var _config$graphql2, _config$graphql2$read;
      const list = nonNullList(type);
      if ((_config$graphql2 = config.graphql) !== null && _config$graphql2 !== void 0 && (_config$graphql2$read = _config$graphql2.read) !== null && _config$graphql2$read !== void 0 && _config$graphql2$read.isNonNull) {
        return arg({
          type: nonNull(list),
          defaultValue: defaultValue
        });
      }
      return arg({
        type: list
      });
    };
    const resolveCreate = val => {
      const resolved = resolveUpdate(val);
      if (resolved === undefined) {
        return defaultValue;
      }
      return resolved;
    };
    const resolveUpdate = val => {
      if (val === null) {
        throw userInputError('multiselect fields cannot be set to null');
      }
      return val;
    };
    const transformedConfig = configToOptionsAndGraphQLType(config, meta);
    const possibleValues = new Set(transformedConfig.options.map(x => x.value));
    if (possibleValues.size !== transformedConfig.options.length) {
      throw new Error(`The multiselect field at ${meta.listKey}.${meta.fieldKey} has duplicate options, this is not allowed`);
    }
    return jsonFieldTypePolyfilledForSQLite(meta.provider, _objectSpread(_objectSpread({}, config), {}, {
      __ksTelemetryFieldTypeName: '@keystone-6/multiselect',
      hooks: _objectSpread(_objectSpread({}, config.hooks), {}, {
        async validateInput(args) {
          var _config$hooks, _config$hooks$validat;
          const selectedValues = args.inputData[meta.fieldKey];
          if (selectedValues !== undefined) {
            for (const value of selectedValues) {
              if (!possibleValues.has(value)) {
                args.addValidationError(`${value} is not a possible value for ${fieldLabel}`);
              }
            }
            const uniqueValues = new Set(selectedValues);
            if (uniqueValues.size !== selectedValues.length) {
              args.addValidationError(`${fieldLabel} must have a unique set of options selected`);
            }
          }
          await ((_config$hooks = config.hooks) === null || _config$hooks === void 0 ? void 0 : (_config$hooks$validat = _config$hooks.validateInput) === null || _config$hooks$validat === void 0 ? void 0 : _config$hooks$validat.call(_config$hooks, args));
        }
      }),
      views: '@keystone-6/core/fields/types/multiselect/views',
      getAdminMeta: () => {
        var _config$type;
        return {
          options: transformedConfig.options,
          type: (_config$type = config.type) !== null && _config$type !== void 0 ? _config$type : 'string',
          defaultValue: []
        };
      },
      input: {
        create: {
          arg: create(transformedConfig.graphqlType),
          resolve: resolveCreate
        },
        update: {
          arg: arg({
            type: nonNullList(transformedConfig.graphqlType)
          }),
          resolve: resolveUpdate
        }
      },
      output: field({
        type: output(transformedConfig.graphqlType),
        resolve(_ref2) {
          let {
            value
          } = _ref2;
          return value;
        }
      })
    }), {
      mode: 'required',
      map: config === null || config === void 0 ? void 0 : (_config$db = config.db) === null || _config$db === void 0 ? void 0 : _config$db.map,
      default: {
        kind: 'literal',
        value: JSON.stringify(defaultValue)
      }
    });
  };
};
function configToOptionsAndGraphQLType(config, meta) {
  if (config.type === 'integer') {
    if (config.options.some(_ref3 => {
      let {
        value
      } = _ref3;
      return !Number.isInteger(value) || value > MAX_INT || value < MIN_INT;
    })) {
      throw new Error(`The multiselect field at ${meta.listKey}.${meta.fieldKey} specifies integer values that are outside the range of a 32 bit signed integer`);
    }
    return {
      type: 'integer',
      graphqlType: Int$3,
      options: config.options
    };
  }
  const options = config.options.map(option => {
    if (typeof option === 'string') {
      return {
        label: humanize(option),
        value: option
      };
    }
    return option;
  });
  if (config.type === 'enum') {
    const enumName = `${meta.listKey}${inflection.classify(meta.fieldKey)}Type`;
    const graphqlType = enum$1({
      name: enumName,
      values: enumValues(options.map(x => x.value))
    });
    return {
      type: 'enum',
      graphqlType,
      options
    };
  }
  return {
    type: 'string',
    graphqlType: String$3,
    options
  };
}
const nonNullList = type => list(nonNull(type));

export { bigInt, calendarDay, checkbox, decimal, file, float, image, integer, json, multiselect, password, relationship, select, text, timestamp, virtual };
