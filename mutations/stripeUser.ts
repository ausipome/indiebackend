import { Context } from '.keystone/types';
import stripeConfig from '../lib/stripe';
import { welcomeEmail } from '../lib/welcomeMail';

const graphql = String.raw;

interface Arguments {
    email: string, name: string, password: string
  }

async function stripeUser(
  root: any,
  { email, name, password }: Arguments, context: Context): Promise<any> {

  const account = await stripeConfig.accounts.create({
    country: 'GB',
    type: 'express',
    capabilities: {transfers: {requested: true},card_payments: {requested: true}},
    business_type: 'individual',
    business_profile: {product_description: 'Selling clothes on the Indie Bubba marketplace'},
    business_profile: {url: 'https://indiebubba.com'},
    business_profile: {mcc: '5641'},
    email: email,
  }).catch(err => {
    throw new Error(err.message);
  });

    const user = await context.query.User.createOne({
    data: {
      email: email, name: name, password: password, stripeId: account.id, confirmed: 'no', 
    },
  });

  await welcomeEmail(user.id, email);
  
  return user;
}

export default stripeUser;