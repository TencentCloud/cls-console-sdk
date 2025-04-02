FROM node:20-alpine as builder

LABEL service=cls_console_sdk

ENV NODE_ENV build
WORKDIR /BUILD
COPY . /BUILD

RUN npm config set registry "http://mirrors.tencent.com/npm/" --global
RUN npm i -g pnpm@9.15.0
RUN pnpm install && cd ./capi-forward && pnpm install && cd ../sdk-modules && pnpm install && cd ../
RUN pnpm run build

ENV NODE_ENV production

EXPOSE 3001

ENTRYPOINT node capi-forward/dist/main.js
