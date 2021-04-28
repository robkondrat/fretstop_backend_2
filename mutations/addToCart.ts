/* eslint-disable */
import { KeystoneContext } from "@keystone-next/types";
import { CartItemCreateInput } from "../.keystone/schema-types";
import { Session } from "../types";

export default async function addToCart(
  root: any,
  { guitarId }: { guitarId: string },
  context: KeystoneContext
): Promise<CartItemCreateInput> {
  console.log("adding to cart");
  // 1. query the curent user see if they are signed in
  const sesh = context.session as Session;
  if (!sesh.itemId) {
    throw new Error("You must be logged in to do this");
  }
  // 2. query the current users cart
  const allCartItems = await context.lists.CartItem.findMany({
    where: { user: { id: sesh.itemId }, guitar: { id: guitarId } },
    resolveFields: "id,quantity",
  });
  const [existingCartItem] = allCartItems;
  if (existingCartItem) {
    console.log(
      `There is already ${existingCartItem.quantity} in the cart, increment by 1!`
    );
    // 3. see if the current item is in their cart
    // 4. if it is, increment by 1. If it isn't create a new cart item.
    return await context.lists.CartItem.updateOne({
      id: existingCartItem.id,
      data: { quantity: existingCartItem.quantity + 1 },
    });
  }
  return await context.lists.CartItem.createOne({
    data: {
      guitar: { connect: { id: guitarId } },
      user: { connect: { id: sesh.itemId } },
    },
  });
}
