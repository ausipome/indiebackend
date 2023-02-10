import { Context } from '.keystone/types';
import { postedEmail } from '../lib/postedMail';

const graphql = String.raw;

interface Arguments {
  id,
  status: string,
  }

async function updateOrderStatus(
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
      order{user{email}}
      photo 
    `
  });
  console.dir(queryOrder, { depth: null })

 

  const productName =queryOrder.name;
  const emailToSend=queryOrder.order.user.email;
  const sendPhoto =queryOrder.photo;
  postedEmail(productName, emailToSend, sendPhoto);

    const orderUpdate = await context.query.OrderItem.updateOne({
      where: { id },
        data: {
            status: status 
        },
      });

    return orderUpdate;
  }


export default updateOrderStatus;