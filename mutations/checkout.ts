import { Context } from '.keystone/types';
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
          photo 
        }
      }
    `,
  });
  console.dir(user, { depth: null });
  // 2. calc the total price for their order
  const cartItems = user.cart.filter((cartItem: any) => cartItem.product);
  let amount = cartItems.reduce(function (tally: number, cartItem: any) {
    return tally + cartItem.quantity * (cartItem.product.price-cartItem.product.price*0.2);
  }, 0);
  amount=parseInt(amount);
  // 3. Convert the cartItems to OrderItems
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
      price: parseInt(cartItem.product.price-cartItem.product.price*0.2),
      quantity: cartItem.quantity,
      photo: cartItem.product.photo,
      date: today.toDateString(),
      timeStamp:dateNow,
    };
    const productName =cartItem.product.name;
    const emailTo=JSON.parse(cartItem.product.email);
    const emailToSend=emailTo.email;
    const sendPhoto =cartItem.product.photo;
    soldEmail(productName, emailToSend, sendPhoto);
    return orderItem;
  });
  // 5. Create the order and return it
  const order = await context.db.Order.createOne({
    data: {
      total: amount,
      charge: token,
      items: { create: orderItems },
      user: { connect: { id: userId } },
      date: today.toDateString(),
      timeStamp:dateNow,
    },
  });
  // 6. Clean up any old cart item
  const prodItemIds = user.cart.map((cartItem: any) => cartItem.product.id);
  await context.query.Product.deleteMany({
    where: prodItemIds.map((id: string) => ({ id })),
  });

  const cartItemIds = user.cart.map((cartItem: any) => cartItem.id);
  await context.query.CartItem.deleteMany({
    where: cartItemIds.map((id: string) => ({ id })),
  });
  return order;
}

export default checkout;