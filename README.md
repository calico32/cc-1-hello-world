# hello coding club people

This is a fairly standard server-side typescript project.

All it does is send "hello world" and a random image of a cat to any GET request it receives.

![example](example.png)

## but how does it work?

This project uses `express`, an package to easily create webservers in Node.js.

Every time a GET request is made to any path, the EJS template at `views/index.ejs` is filled with
the current date and the URL to a cat image, provided by <https://thecatapi.com>. Images are
preloaded to reduce loading time.

API keys and other secrets can be read from `.env` using the `dotenv` package.

See `src/server.ts` and `src/cat.ts` for more info.

## how to install

1. clone this repo (green button at the top)
2. install dependencies: `yarn`
3. copy `.env.example` to `.env` and fill in the fields
   1. get a cat API key at <https://thecatapi.com>
   2. define some port (otherwise it will be random)

your `.env` should look like this:

```sh
CAT_API_KEY='XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX'
PORT=1234
```

4. start the bot by either running `yarn dev` or `yarn build && yarn start`
   1. docker files availble: you can run `docker build .` to build an image and
      `docker run -p <port>:<port> <image id>` to start it
