import { Context } from '.keystone/types';
import stripeConfig from '../lib/stripe';
import { releasedEmail } from '../lib/releasedMail';
import { holdEmail } from '../lib/holdMail';

const graphql = String.raw;

interface Arguments {
  id,
  }

async function released(
  root: any,
  {id}: Arguments,
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
      photo {
            image {
              publicUrlTransformed
            }
          }
    `
  });
  console.dir(queryOrder, { depth: null })

  const stripeId=queryOrder.user.stripeId;

  //query the stripe account
  const account = await stripeConfig.accounts.retrieve(stripeId);

  const transferCapabilities=account.capabilities.transfers;

  if(transferCapabilities==='active'){

if(queryOrder.status !== 'RECEIVED' || queryOrder.status !== 'FLAGGED' || queryOrder.status !== 'REFUNDED'){
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
  console.log(transfer);
  
  const productName =queryOrder.name;
  const emailToSend=queryOrder.user.email;
  const sendPhoto =queryOrder.photo.image.publicUrlTransformed;
  releasedEmail(productName, emailToSend, sendPhoto, transferAmount);

    const orderUpdate = await context.query.OrderItem.updateOne({
      where: { id },
        data: {
            status: 'RECEIVED' 
        },
      });
      return orderUpdate;
    }
  }
  else {
    const productName =queryOrder.name;
    const emailToSend=queryOrder.user.email;
    const sendPhoto =queryOrder.photo.image.publicUrlTransformed;
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


export default released;