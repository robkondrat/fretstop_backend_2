import { integer, relationship, select, text } from "@keystone-next/fields";
import { list } from "@keystone-next/keystone/schema";
import { isSignedIn, rules } from "../access";

export const Guitar = list({
  access: {
    create: isSignedIn,
    read: rules.canReadGuitars,
    update: rules.canManageGuitars,
    delete: rules.canManageGuitars,
  },
  fields: {
    name: text({ isRequired: true }),
    description: text({
      ui: {
        displayMode: "textarea",
      },
    }),
    photo: relationship({
      ref: "GuitarImage.guitar",
      ui: {
        displayMode: "cards",
        cardFields: ["image", "altText"],
        inlineCreate: { fields: ["image", "altText"] },
        inlineEdit: { fields: ["image", "altText"] },
      },
    }),
    status: select({
      options: [
        { label: "Draft", value: "DRAFT" },
        { label: "Available", value: "AVAILABLE" },
        { label: "Unavailable", value: "UNAVAILABLE" },
      ],
      defaultValue: "DRAFT",
      ui: {
        displayMode: "segmented-control",
        createView: { fieldMode: "hidden" },
      },
    }),
    price: integer(),
    user: relationship({
      ref: "User.guitars",
      defaultValue: ({ context }) => ({
        connect: { id: context.session.itemId },
      }),
    }),
  },
  ui: {
    listView: {
      initialColumns: ["name", "status", "description", "price"],
    },
  },
});
