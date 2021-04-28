import { guitars } from './data';

export async function insertSeedData(ks: any) {
  // Keystone API changed, so we need to check for both versions to get keystone
  const keystone = ks.keystone || ks;
  const adapter = keystone.adapters?.MongooseAdapter || keystone.adapter;

  console.log(`🌱 Inserting Seed Data: ${guitars.length} Guitars`);
  const { mongoose } = adapter;
  for (const guitar of guitars) {
    console.log(`  🛍️ Adding Guitar: ${guitar.name}`);
    const { _id } = await mongoose
    .model('GuitarImage')
    .create({ image: guitar.photo, altText: guitar.description });
    guitar.photo = _id;
    await mongoose.model('Guitar').create(guitar);
  }
  console.log(`✅ Seed Data Inserted: ${guitars.length} Guitars`);
  console.log(`👋 Please start the process with \`yarn dev\` or \`npm run dev\``);
  process.exit();
}
