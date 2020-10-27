import axios from 'axios';
import https from 'https';

let imageUrlCache: string;
let headersCache: Record<string, string | undefined>;
let imageCache: Buffer;
let isCacheValid = true;

const getUrl = async () => {
  const url = 'https://api.thecatapi.com/v1/images/search';

  const response = await axios.get(url, {
    headers: {
      'x-api-key': process.env.CAT_API_KEY,
    },
  });

  return (imageUrlCache = response.data ? response.data[0].url : null);
};

const getImage = () =>
  new Promise<Buffer>((resolve, reject) => {
    const buffers: Buffer[] = [];

    https.get(imageUrlCache, image => {
      headersCache = {
        Connection: 'close',
        'Content-Type': image.headers['content-type'],
        'Content-Length': image.headers['content-length'],
      };

      image.on('data', chunk => buffers.push(chunk));

      image.on('close', () => {
        const buffer = Buffer.concat(buffers);

        imageCache = buffer;

        resolve(buffer);
      });
    });
  });

export const getCatImage = async (): Promise<Buffer> => {
  if (isCacheValid) {
    setTimeout(async () => {
      await getUrl();
      await getImage();
      isCacheValid = true;
    }, 10);
    isCacheValid = false;
    return imageCache;
  } else {
    await getUrl();
    return await getImage();
  }
};

export const getHeaders = (): typeof headersCache => headersCache;
