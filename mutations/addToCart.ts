/* eslint-disable */
import { KeystoneContext, SessionStore } from "@keystone-next/types";
import { CartItem } from '../schemas/CartItem';
import { CartItemCreateInput } from '../.keystone/schema-types'
import { Session } from "../types";

export default async function addToCart(
  root: any, 
  { productId }: { productId: string }, 
  context: KeystoneContext
  ): Promise<CartItemCreateInput> {
    console.log('Add to Cart!');
    // 1. query the current user and see if they are signed in  
    const sesh = context.session as Session;
    if (!sesh.itemId) {
      throw new Error('You must be logged in to do this!');
    }
    // 2. Query the current user's cart 
    const allCartItems = await context.lists.CartItem.findMany({
      where: { user: { id: sesh.itemId }, product: { id: productId } },
      resolveFields: 'id,quantity'
    });
    const [existingCartItem] = allCartItems;

    if (existingCartItem) {
      console.log(`this item is already ${existingCartItem.quantity}, increment by 1!`)
      // 3. See if the curent item is in their cart 
      // 4. if it is, increment by 1 

      return await context.lists.CartItem.updateOne({
        id: existingCartItem.id,
        data: { quantity: existingCartItem.quantity + 1 },
        resolveFields: false,
      });
    }
    // 5. if it isn't, create a new cart item! 
    return await context.lists.CartItem.createOne({
      data: {
        product: { connect: { id: productId }},
        quantity: 1,
        user: { connect: { id: sesh.itemId }},
      },
      resolveFields: false,
    })
};