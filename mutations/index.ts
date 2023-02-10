import { graphql } from '@keystone-6/core';
import addToCart from './addToCart';
import checkout from './checkout';
import stripeUser from './stripeUser';
import createChatter from './createChatter';
import updateOrderStatus from './updateOrderStatus';
import updateOrderFlagged from './updateOrderFlagged';
import updateOrderReceived from './updateOrderReceived';
import updateOrderResolved from './updateOrderResolved';
import refund from './refund';
import released from './released';

export const extendGraphqlSchema = graphql.extend(base => {
  return {
    mutation: {
      addToCart: graphql.field({
        type: base.object('CartItem'),
        args: { productId: graphql.arg({ type: graphql.ID }) },
        resolve: addToCart,
      }),
      checkout: graphql.field({
        type: base.object('Order'),
        args: { token: graphql.arg({ type: graphql.nonNull(graphql.String) }) },
        resolve: checkout,
      }),
      stripeUser: graphql.field({
        type: base.object('User'),
        args: { email: graphql.arg({ type: graphql.nonNull(graphql.String) }), name: graphql.arg({ type: graphql.nonNull(graphql.String) }), password: graphql.arg({ type: graphql.nonNull(graphql.String) })},
        resolve: stripeUser,
      }),   
       createChatter: graphql.field({
        type: base.object('Chat'),
        args: { message: graphql.arg({ type: graphql.nonNull(graphql.String) }), pageTypeMod: graphql.arg({ type: graphql.nonNull(graphql.String) }), id: graphql.arg({ type: graphql.nonNull(graphql.ID) })},
        resolve: createChatter,
      }),  
      updateOrderStatus: graphql.field({
        type: base.object('OrderItem'),
        args: { status: graphql.arg({ type: graphql.nonNull(graphql.String) }), id: graphql.arg({ type: graphql.nonNull(graphql.ID) })},
        resolve: updateOrderStatus,
      }),  
      updateOrderFlagged: graphql.field({
        type: base.object('OrderItem'),
        args: { status: graphql.arg({ type: graphql.nonNull(graphql.String) }), id: graphql.arg({ type: graphql.nonNull(graphql.ID) })},
        resolve: updateOrderFlagged,
      }),  
      updateOrderReceived: graphql.field({
        type: base.object('OrderItem'),
        args: { status: graphql.arg({ type: graphql.nonNull(graphql.String) }), id: graphql.arg({ type: graphql.nonNull(graphql.ID) })},
        resolve: updateOrderReceived,
      }), 
      updateOrderResolved: graphql.field({
        type: base.object('OrderItem'),
        args: { status: graphql.arg({ type: graphql.nonNull(graphql.String) }), id: graphql.arg({ type: graphql.nonNull(graphql.ID) })},
        resolve: updateOrderResolved,
      }), 
      refund: graphql.field({
        type: base.object('OrderItem'),
        args: { id: graphql.arg({ type: graphql.nonNull(graphql.ID) })},
        resolve: refund,
      }), 
      released: graphql.field({
        type: base.object('OrderItem'),
        args: { id: graphql.arg({ type: graphql.nonNull(graphql.ID) })},
        resolve: released,
      }),
    },
  };
});
