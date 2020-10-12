FROM node:12-buster

# just in case
ENV DOCKER=true

# somehow yarn comes preinstalled?

# install deps
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn

# copy everything else and build
COPY . .
RUN yarn build

CMD [ "yarn", "start" ]
