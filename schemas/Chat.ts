import { text, relationship, timestamp } from '@keystone-6/core/fields';
import { list } from '@keystone-6/core';
import { allowAll } from '@keystone-6/core/access';
import { permissions} from '../access';


export const Chat = list({
  access: allowAll,
  ui: {
    hideCreate: args => !permissions.canManageRoles(args),
    hideDelete: args => !permissions.canManageRoles(args),
    isHidden: args => !permissions.canManageRoles(args),
  },
  fields: {
    userFrom: relationship({
      ref: 'User',
      hooks: {
        resolveInput({ operation, resolvedData, context }) {
          // Default to the currently logged in user on create.
          if (operation === 'create' && !resolvedData.user && context.session?.itemId) {
            return { connect: { id: context.session?.itemId } };
          }
          return resolvedData.user;
        },
      },
    }),
    item: relationship({
      ref: 'OrderItem.chat',
    }),
    timeStamp: timestamp(),
    message: text(),
  },
});
