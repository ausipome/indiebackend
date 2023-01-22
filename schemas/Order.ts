import { integer, text, relationship, virtual, timestamp } from '@keystone-6/core/fields';
import { list, graphql } from '@keystone-6/core';
import { permissions, isSignedIn, rules } from '../access';
import { Lists } from '.keystone/types';

const formatter = new Intl.NumberFormat('en-GB', {
  style: 'currency',
  currency: 'GBP',
});

export default function formatMoney(pence: number | null) {
  if (pence === null) return 'Unset';
  const pounds = pence / 100;
  return formatter.format(pounds);
}

// we add the type here, so `item` below is typed
export const Order: Lists.Order = list({
  access: {
    operation: {
      create: isSignedIn,
      update: () => false,
      delete: () => false,
      query: isSignedIn,
    },
  },
  ui: {
    hideCreate: args => !permissions.canManageRoles(args),
    hideDelete: args => !permissions.canManageRoles(args),
    isHidden: args => !permissions.canManageRoles(args),
  },
  fields: {
    label: virtual({
      field: graphql.field({
        type: graphql.String,
        resolve(item) {
          return formatMoney(item.total);
        },
      }),
    }),
    total: integer(),
    charge: text(),
    items: relationship({ ref: 'OrderItem.order', many: true }),
    user: relationship({ ref: 'User.orders' }),
    timeStamp: timestamp(),
    date: text(),
  },
});