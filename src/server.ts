import dotenv from 'dotenv';
import express from 'express';
import { AddressInfo } from 'net';
import path from 'path';

import { getCatImage } from './cat';

dotenv.config();

const app = express();

app.use(express.static(path.resolve(__dirname, '..', 'public')));

app.set('views', path.resolve(__dirname, '..', 'views'));
app.set('view engine', 'ejs');

app.get('*', async (req, res) => {
  res.render('index', {
    date: new Date(),
    imageUrl: await getCatImage(),
  });
});

const server = app.listen(process.env.PORT, () => {
  // preload next image
  getCatImage();

  const address = server.address() as AddressInfo;
  return console.log(`${address.family} server opened at ${address.address}:${address.port}`);
});
