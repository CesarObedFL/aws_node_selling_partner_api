FROM keymetrics/pm2:latest-alpine

RUN apk update && apk add bash

# Bundle APP files
RUN mkdir -p /src
WORKDIR /src
COPY . .

# Install app dependencies
ENV NPM_CONFIG_LOGLEVEL warn
RUN npm install
RUN npm audit fix --force


CMD [ "pm2-runtime", "start", "pm2.json" ]