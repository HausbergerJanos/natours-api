const mongoose = require('mongoose');

const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });

const app = require('./app');

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD,
);

async function xx() {
  const tourSchema = new mongoose.Schema({
    name: String,
    price: Number,
    rating: Number,
  });

  const Tour = mongoose.model('tour', tourSchema);
  const tours = await Tour.find();

  console.log(tours);
}

mongoose.connect(DB).then((con) => {
  console.log(con.connections);
  console.log('DB connection successful!');

  xx();
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
