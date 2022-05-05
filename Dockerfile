FROM node:16-alpine as builder

LABEL service=cls_console_sdk

ENV NODE_ENV build
WORKDIR /BUILD
COPY . /BUILD

RUN npm i -g pnpm pm2
RUN pnpm recursive install --frozen-lockfile=true
RUN pnpm run build


ENV NODE_ENV production

CMD ["pm2-runtime", "start", "capi-forward/dist/main.js"]

EXPOSE 3001
