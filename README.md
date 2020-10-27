# hello coding club people

This is a simple webpack-bundled web app that renders a canvas using WebGL.

![example](example.png)

## but how does it work?

The PixiJS (`pixi.js`) library is used for creating the stage and managing the sprites, etc. While
not really necessary for this simple project, support for SCSS and React (aliased to `preact/compat`
because bundle size) are also thrown in.

This project utilizes [webpack](https://npmjs.org/package/webpack), a bundler that can package
almost any kinds of asset. I'm using `ts-loader` and `scss-loader` for TS and SCSS (mostly), and a
whole host of plugins. For a complete list, see `server/src/webpack.config.ts`.

webpack bundles all the code from `src` and everything it imports (from `node_modules`, etc) into a
few files, as well as generates an HTML file with the necessary `script` and `link` tags that can be
served to the client.

Again, API keys are read from `.env` using the `dotenv` package, but are not given to the client.
Instead, the client makes a GET request to the server, which makes the request for the cat image and
sends the data back.

### project structure

TS and SCSS source files for the frontend live in `src`. The EJS template for HTML Webpack Plugin is
also there. The script entrypoint is `src/index.tsx`.

Backend source files, including the webpack config, are inside `server`. The server entrypoint
is `server/server.ts`.

Generated files for the frontend and backend are at `dist` and `server/dist` respectively.

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

4. build the project with `yarn build`
5. start the webserver with `yarn start`
   1. docker files availble: you can run `docker build .` to build an image and
      `docker run -p <port>:<port> <image id>` to start it
6. navigate to http://localhost:PORT for cats
