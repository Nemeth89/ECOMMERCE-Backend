const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Item = require('./models/Item');

dotenv.config();
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const seedItems = [
  {
    name: 'Apple',
    price: 1.99,
    description: 'Fresh and juicy apple.',
    image: '/images/apple.jpg',
  },
  {
    name: 'Banana',
    price: 0.99,
    description: 'Ripe and sweet banana.',
    image: '/images/banana.jpg',
  },
  {
    name: 'Orange',
    price: 2.49,
    description: 'Citrusy and tangy orange.',
    image: '/images/orange.jpg',
  },
];

const seedDB = async () => {
  await Item.deleteMany({});
  await Item.insertMany(seedItems);
  console.log('Database seeded!');
  mongoose.connection.close();
};

seedDB();
