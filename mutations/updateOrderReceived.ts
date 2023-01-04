import { Context } from '.keystone/types';
import { receivedEmail } from '../lib/receivedMail';
import { holdEmail } from '../lib/holdMail';
import stripeConfig from '../lib/stripe';

const graphql = String.raw;

interface Arguments {
  id,
  status: string,
  }

async function updateOrderRecieved(
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
      photo {
            image {
              publicUrlTransformed
            }
          }
    `
  });
  console.dir(queryOrder, { depth: null })

  const stripeId=queryOrder.user.stripeId;
  console.log(stripeId);

  //query the stripe account
  const account = await stripeConfig.accounts.retrieve(stripeId);

  const transferCapabilities=account.capabilities.transfers;

  if(transferCapabilities==='active'){

if(queryOrder.status !== 'RECEIVED' || queryOrder.status !== 'ONHOLD' || queryOrder.status !== 'REFUNDED'){
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
  receivedEmail(productName, emailToSend, sendPhoto, transferAmount);

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

export default updateOrderRecieved;