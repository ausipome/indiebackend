import { Context } from '.keystone/types';
import { flaggedEmail } from '../lib/flaggedMail';

const graphql = String.raw;

interface Arguments {
  id,
  status: string,
  }

async function updateOrderFlagged(
  root: any,
  {id, status}: Arguments,
  context: Context
): Promise<any> {

  // 1.5 Query the current order item
  const queryOrder = await context.query.OrderItem.findOne({
    where: { id },
    query: graphql`
      status
      name
      email
      photo {
            image {
              publicUrlTransformed
            }
          }
    `
  });
  console.dir(queryOrder, { depth: null })

 

  const productName =queryOrder.name;
  const emailToSend=queryOrder.email;
  const sendPhoto =queryOrder.photo.image.publicUrlTransformed;
  flaggedEmail(productName, emailToSend, sendPhoto);

    const orderUpdate = await context.query.OrderItem.updateOne({
      where: { id },
        data: {
            status: status 
        },
      });

    return orderUpdate;
  }


export default updateOrderFlagged;