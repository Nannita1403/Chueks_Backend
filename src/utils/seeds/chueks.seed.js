require('dotenv').config();
const mongoose = require('mongoose');
const Element = require('../../api/models/elements');
const elementsSeed = require('../../data/elements.seed');
const Product = require('../../api/models/products');
const productsSeed = require('../../data/products.seed');


const elementDocument = elementsSeed.map((product) => new Product(product));
const productDocument = productsSeed.map((product) => new Product(product));

async function seedBBDD() {
  try {
    await mongoose.connect(process.env.DB_URL);

    await Element.deleteMany();
    await Element.insertMany(elementDocument);
    console.log('Elements inserted');

    await Product.deleteMany();
    await Product.insertMany(productDocument);
    console.log('Products inserted');

  } catch (error) {
    console.error('Error seeding database: ', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from database');
  }
}

seedBBDD();