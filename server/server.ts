import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import { AddressInfo } from 'net';
import path from 'path';
import webpack from 'webpack';
import middleware from 'webpack-dev-middleware';

import { getCatImage, getHeaders } from './cat';
import webpackConfig from './webpack.config';

dotenv.config();
const devMode = process.env.NODE_ENV === 'development';

const app = express();

const allowedOrigins = [
  'http://localhost:' + process.env.PORT,
  ...(process.env.ALLOWED_DOMAINS ? process.env.ALLOWED_DOMAINS.split(',').map(s => s.trim()) : []),
];

app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin || allowedOrigins.includes(origin)) return cb(null, true);

      console.log(origin);

      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return cb(new Error(msg), false);
    },
  })
);

app.use(async (req, res, next) => {
  if (req.path.includes('tsconfig.tsbuildinfo')) res.sendStatus(404);
  else next();
});

app.get('/api/cat', async (req, res) => {
  const image = await getCatImage();
  const headers = getHeaders();

  res.writeHead(200, headers);
  res.end(image);
});

if (devMode) {
  console.log('running in development mode, starting weback');
  const compiler = webpack(webpackConfig);
  app.use(middleware(compiler, { publicPath: '/' }));
} else {
  // serve webpack bundles
  app.use(express.static(path.resolve(__dirname, '../..', 'dist')));
}

app.use(express.static(path.resolve(__dirname, '../..', 'public')));

const server = app.listen(process.env.PORT, () => {
  // preload next image
  getCatImage();

  const address = server.address() as AddressInfo;
  console.log(`${address.family} server opened at ${address.address}:${address.port}`);
});
