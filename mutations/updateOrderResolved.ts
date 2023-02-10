import { Context } from '.keystone/types';
import { resolvedEmail } from '../lib/resolvedMail';
import { holdEmail } from '../lib/holdMail';
import stripeConfig from '../lib/stripe';

const graphql = String.raw;

interface Arguments {
  id,
  status: string,
  }

async function updateOrderResolved(
  root: any,
  {id, status}: Arguments,
  context: Context
): Promise<any> {

  // 1.5 Query the current order item
  const queryOrder = await context.query.OrderItem.findOne({
    where: { id },
    query: graphql`
      user{
        stripeId
        email
        }
      price
      status
      name
      order{user{email}}
      photo 
    `
  });
  console.dir(queryOrder, { depth: null })

  const stripeId=queryOrder.user.stripeId;

  //query the stripe account
  const account = await stripeConfig.accounts.retrieve(stripeId);

  const transferCapabilities=account.capabilities.transfers;

  if(transferCapabilities==='active'){

if(queryOrder.status === 'FLAGGED' || queryOrder.status !== 'ONHOLD' || queryOrder.status !== 'REFUNDED'){
// create stripe transfer
const amount=parseInt(queryOrder.price);
const transferFee=Math.ceil(amount*0.05);
const transferAmount=parseInt(amount)-transferFee;
const transfer = await stripeConfig.transfers.create({
    amount: transferAmount,
    currency: 'gbp',
    destination: stripeId,
  }).catch(err => {
    console.log(err);
    throw new Error(err.message);
  });
  
  const productName =queryOrder.name;
  const emailToSend=queryOrder.user.email;
  const sendPhoto =queryOrder.photo;
  resolvedEmail(productName, emailToSend, sendPhoto, transferAmount);

    const orderUpdate = await context.query.OrderItem.updateOne({
      where: { id },
        data: {
            status: status 
        },
      });
      return orderUpdate;
    }
  }
  else{
    const productName =queryOrder.name;
    const emailToSend=queryOrder.user.email;
    const sendPhoto =queryOrder.photo;
    holdEmail(productName, emailToSend, sendPhoto);
  
      const orderUpdate = await context.query.OrderItem.updateOne({
        where: { id },
          data: {
              status: 'ONHOLD' 
          },
        });
        return orderUpdate;
  } 
  }
export default updateOrderResolved;