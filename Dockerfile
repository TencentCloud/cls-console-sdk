FROM node:16-alpine as builder

LABEL service=cls_console_sdk

ENV NODE_ENV build
WORKDIR /BUILD
COPY . /BUILD

# 用于前端构建时，生成代码中包含相对子路径
ARG basePath
RUN echo $basePath

RUN npm i -g pnpm pm2
RUN pnpm recursive install --frozen-lockfile=true
RUN basePath=$basePath pnpm run buildWithoutEnv


ENV NODE_ENV production

CMD ["pm2-runtime", "start", "capi-forward/dist/main.js"]

EXPOSE 3001
