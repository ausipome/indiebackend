import { integer,
  select, text, relationship,
  timestamp } from '@keystone-6/core/fields';
import { list } from '@keystone-6/core';
import {permissions, isSignedIn, rules } from '../access';

export const OrderItem = list({
  access: {
    operation: {
      create: isSignedIn,
      update: isSignedIn,
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
    name: text({ validation: { isRequired: true } }),
    description: text({
      ui: {
        displayMode: 'textarea',
      },
    }),
    photo: text(),
    price: integer(),
    quantity: integer(),
    order: relationship({ ref: 'Order.items' }),
    chat: relationship({ ref: 'Chat.item', many: true }),
    status: select({
      options: [
        { label: 'Sold', value: 'SOLD' },
        { label: 'Posted', value: 'POSTED' },
        { label: 'Received', value: 'RECEIVED' },
        { label: 'On hold', value: 'ONHOLD' },
        { label: 'Flagged', value: 'FLAGGED' },
        { label: 'Received Back', value: 'RECEIVEDBACK' },
        { label: 'Refunded', value: 'REFUNDED' },
      ],
      defaultValue: 'SOLD',
      ui: {
        displayMode: 'segmented-control',
        createView: { fieldMode: 'hidden' },
      },
    }),
    tracking: text(),
    trackingCompany: text(),
    email: text(),
    user: relationship({ ref: 'User' }),
    timeStamp: timestamp(),
    date: text(),
  },
});