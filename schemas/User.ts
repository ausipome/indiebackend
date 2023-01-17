import { list } from '@keystone-6/core';
import { allOperations, allowAll } from '@keystone-6/core/access';
import { text, password, relationship } from '@keystone-6/core/fields';
import { permissions, rules } from '../access';

export const User = list({
  access: {
    operation: {
      ...allOperations(allowAll),
      create: () => true,
      // only people with the permission can delete themselves!
      // You can't delete yourself
      delete: permissions.canManageUsers,
    },
    filter: {
      query: () => true,
      update: rules.canManageUsers,
    },
  },
  ui: {
    hideCreate: args => !permissions.canManageRoles(args),
    hideDelete: args => !permissions.canManageRoles(args),
    isHidden: args => !permissions.canManageRoles(args),
  },
  fields: {
    name: text({ validation: { isRequired: true } }),
    email: text({ isIndexed: 'unique', validation: { isRequired: true } }),
    password: password(),
    stripeId: text({ isIndexed: 'unique', validation: { isRequired: true } }),
    confirmed: text({ validation: { isRequired: true } }),
    address: text({ defaultValue: '' }),
    address2: text({ defaultValue: '' }),
    town: text({ defaultValue: '' }),
    county: text({ defaultValue: '' }),
    postcode: text({ defaultValue: '' }),
    cart: relationship({
      ref: 'CartItem.user',
      many: true,
      ui: {
        createView: { fieldMode: 'hidden' },
        itemView: { fieldMode: 'read' },
      },
    }),
    orders: relationship({ ref: 'Order.user', many: true }),
    role: relationship({
      ref: 'Role.assignedTo',
      access: {
        create: permissions.canManageUsers,
        update: permissions.canManageUsers,
      },
    }),
    products: relationship({
      ref: 'Product.user',
      many: true,
    }),
  },
});