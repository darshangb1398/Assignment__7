/* global db print */
/* eslint no-restricted-globals: "off" */

db.items.remove({});
db.deleted_products.remove({});
const count = db.items.count();
print('Inserted', count, 'items');
db.counters.remove({ _id: 'items' });
db.counters.insert({ _id: 'items', current: count });
db.items.createIndex({ id: 1 }, { unique: true });
db.items.createIndex({ product_name: 1 });
db.items.createIndex({ product_price: 1 });
db.items.createIndex({ product_image: 1 });
db.deleted_products.createIndex({ id: 1 }, { unique: true });
