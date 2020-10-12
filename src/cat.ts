import axios from 'axios';

let imageCache;

const fetch = async () => {
  const url = 'https://api.thecatapi.com/v1/images/search';

  const response = await axios.get(url, {
    headers: {
      'x-api-key': process.env.CAT_API_KEY,
    },
  });

  return (imageCache = response.data ? response.data[0].url : null);
};

export const getCatImage = async (): Promise<string> => {
  if (imageCache) {
    setTimeout(fetch, 10);
    return imageCache;
  } else {
    return await fetch();
  }
};
