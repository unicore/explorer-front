FROM mhart/alpine-node:17
USER root
WORKDIR /app

RUN apk add yarn g++ bash make curl python3
COPY package*.json ./
RUN yarn global add @quasar/cli
COPY . .
