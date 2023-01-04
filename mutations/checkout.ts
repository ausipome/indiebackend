import { Context } from '.keystone/types';
import stripeConfig from '../lib/stripe';
import { soldEmail } from '../lib/soldMail';

const graphql = String.raw;

interface Arguments {
  token: string;
}

async function checkout(root: any, { token }: Arguments, context: Context): Promise<any> {
  // 1. Make sure they are signed in
  const userId = context.session.itemId;
  if (!userId) {
    throw new Error('Sorry! You must be signed in to create an order!');
  }
  // 1.5 Query the current user
  const user = await context.query.User.findOne({
    where: { id: userId },
    query: graphql`
       id
      name
      email
      cart {
        id
        quantity
        product {
          user{id}
          email
          name
          price
          description
          id
          photo {
            id
            image {
              id
              publicUrlTransformed
            }
          }
        }
      }
    `,
  });
  console.dir(user, { depth: null });
  // 2. calc the total price for their order
  const cartItems = user.cart.filter((cartItem: any) => cartItem.product);
  const amount = cartItems.reduce(function (tally: number, cartItem: any) {
    return tally + cartItem.quantity * cartItem.product.price;
  }, 0);
  console.log(amount);
    // 3. create the charge with the stripe library
    const charge = await stripeConfig.paymentIntents.create({
      amount,
      currency: 'GBP',
      confirm: true,
      payment_method: token,
    }).catch(err => {
      console.log(err);
      throw new Error(err.message);
    });
    console.log(charge);
  // 4. Convert the cartItems to OrderItems
  const date = new Date();
  const dateNow=date.toISOString();
  const timeElapsed = Date.now();
  const today = new Date(timeElapsed);
  // 4. Convert the cartItems to OrderItems
  const orderItems = cartItems.map((cartItem: any) => {
    const orderItem = {
      user: {connect: { id:cartItem.product.user.id}},
      name: cartItem.product.name,
      email: cartItem.product.email,
      description: cartItem.product.description,
      price: cartItem.product.price,
      quantity: cartItem.quantity,
      photo: { connect: { id: cartItem.product.photo.id } },
      date: today.toDateString(),
      timeStamp:dateNow,
    };
    const productName =cartItem.product.name;
    const emailTo=JSON.parse(cartItem.product.email);
    const emailToSend=emailTo.email;
    const sendPhoto =cartItem.product.photo.image.publicUrlTransformed;
    soldEmail(productName, emailToSend, sendPhoto);
    return orderItem;
  });
  console.log('gonna create the order');
  // 5. Create the order and return it
  const order = await context.db.Order.createOne({
    data: {
      total: charge.amount,
      charge: charge.id,
      items: { create: orderItems },
      user: { connect: { id: userId } },
      date: today.toDateString(),
      timeStamp:dateNow,
    },
  });
  console.log({ order });
  // 6. Clean up any old cart item
  const prodItemIds = user.cart.map((cartItem: any) => cartItem.product.id);
  console.log('gonna create delete products')
  await context.query.Product.deleteMany({
    where: prodItemIds.map((id: string) => ({ id })),
  });

  const cartItemIds = user.cart.map((cartItem: any) => cartItem.id);
  console.log('gonna create delete cartItems');
  await context.query.CartItem.deleteMany({
    where: cartItemIds.map((id: string) => ({ id })),
  });
  return order;
}

export default checkout;