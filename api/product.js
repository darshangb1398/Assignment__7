const { getDb, getNextSequence } = require('./db.js');

async function productList() {
  const db = getDb();
  const productDB = await db.collection('items').find({}).toArray();
  return productDB;
}

async function counts() {
  const db = getDb();
  const results = await db.collection('items').aggregate([{ $group: { _id: null, count: { $sum: 1 } } }]).toArray();
  return results;
}

async function getProduct(_, { id }) {
  const db = getDb();
  const product = await db.collection('items').findOne({ id });
  return product;
}

async function productAdd(_, { product }) {
  const db = getDb();
  const newProduct = product;
  newProduct.id = await getNextSequence('items');
  const result = await db.collection('items').insertOne(product);
  const savedProduct = await db.collection('items')
    .findOne({ _id: result.insertedId });
  return savedProduct;
}

async function productUpdate(_, { id, changes }) {
  const db = getDb();
  await db.collection('items').updateOne({ id }, { $set: changes });
  const savedProduct = await db.collection('items').findOne({ id });
  return savedProduct;
}

async function remove(_, { id }) {
  const db = getDb();
  const product = await db.collection('items').findOne({ id });
  if (!product) return false;
  product.deleted = new Date();
  let result = await db.collection('deleted_products').insertOne(product);
  if (result.insertedId) {
    result = await db.collection('items').removeOne({ id });
    return result.deletedCount === 1;
  }
  return false;
}

module.exports = {
  productList,
  productAdd,
  getProduct,
  productUpdate,
  remove,
  counts,
};
