import { Context } from '.keystone/types';

const graphql = String.raw;

interface Arguments {
    name: string, description: string, price: number, condition: string
  }

async function createCustomProduct(
  root: any,
  { name, description, price, condition}: Arguments, context: Context): Promise<any> {

    let photo='This will be the photo string';

    const product = await context.query.Product.createOne({
    data: {
      name: name, description: description, photo: photo, condition: condition, price: price, 
    },
  });

  
  return product;
}

export default createCustomProduct;