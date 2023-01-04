import { integer, text, relationship, virtual, timestamp } from '@keystone-6/core/fields';
import { list, graphql } from '@keystone-6/core';
import { isSignedIn, rules } from '../access';
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
    items: relationship({ ref: 'OrderItem.order', many: true }),
    user: relationship({ ref: 'User.orders' }),
    charge: text(),
    timeStamp: timestamp(),
    date: text(),
  },
});