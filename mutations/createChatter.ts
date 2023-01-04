import { Context } from '.keystone/types';
import { contactEmail } from '../lib/contactMail';

const graphql = String.raw;

interface Arguments {
  pageTypeMod: string,message: string, id
  }

async function createChatter(
  root: any,
  { pageTypeMod,message, id }: Arguments,
  context: Context
): Promise<any> {

    // 1.5 Query the current user
    const product = await context.query.OrderItem.findOne({
      where: { id: id },
      query: graphql`
        id
        name
        email
        order{user{email}}
        photo {
            image {
              publicUrlTransformed
            }
          }
        
      `
    });
    console.dir(product, { depth: null })

    var emailToSend='';
    const productName=product.name;
    const sendPhoto =product.photo.image.publicUrlTransformed;
    if(pageTypeMod==='buyer'){emailToSend=product.email}
    if(pageTypeMod==='seller'){emailToSend=product.order.user.email}

  const timeStamp = new Date();
  const timeStampISO = timeStamp.toISOString();

    const chat = await context.query.Chat.createOne({
    data: {
      message: message, timeStamp: timeStampISO, item: { connect: { id: id }}, 
    },
  });

  contactEmail(productName, emailToSend, sendPhoto, message);
  
  return chat;
}

export default createChatter;