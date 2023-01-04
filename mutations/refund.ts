import { Context } from '.keystone/types';
import stripeConfig from '../lib/stripe';
import { refundEmail } from '../lib/refundMail';

const graphql = String.raw;

interface Arguments {
  id,
  }

async function refund(
  root: any,
  {id}: Arguments,
  context: Context
): Promise<any> {

  // 1.5 Query the current order item
  const queryOrder = await context.query.OrderItem.findOne({
    where: { id },
    query: graphql`
      user{
        email
        }
      price
      name
      order{
        charge
        user{email}}
      photo {
            image {
              publicUrlTransformed
            }
          }
    `
  });
  console.dir(queryOrder, { depth: null })

// create stripe transfer
const amount=parseInt(queryOrder.price);
const paymentIntent = queryOrder.order.charge;

const refund = await stripeConfig.refunds.create({
    payment_intent: paymentIntent,
    amount: amount,
  }).catch(err => {
    console.log(err);
    throw new Error(err.message);
  });
  
  const productName =queryOrder.name;
  const emailToSend=queryOrder.order.user.email;
  const sendPhoto =queryOrder.photo.image.publicUrlTransformed;
  refundEmail(productName, emailToSend, sendPhoto, amount);

    const orderUpdate = await context.query.OrderItem.updateOne({
      where: { id },
        data: {
            status: 'REFUNDED' 
        },

      });
      return orderUpdate;
    }
export default refund;