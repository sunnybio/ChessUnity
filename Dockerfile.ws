FROM node:alpine as base

EXPOSE 8080
WORKDIR /base


COPY ["package.json", "./package.json"]
COPY ["turbo.json", "./turbo.json"]
COPY ["yarn.lock", "./yarn.lock"]
COPY ["tsconfig.json", "./tsconfig.json"]

COPY ["apps/game-server", "./apps/game-server/"]
COPY ["packages/backend", "./packages/backend"]
COPY ["packages/db", "./packages/db"]
COPY ["packages/eslint-config-custom", "./packages/eslint-config-custom"]
COPY ["packages/tsconfig", "./packages/tsconfig"]




RUN cd /base

RUN yarn
RUN npm install ts-node -g
RUN npm install pm2 -g



WORKDIR /base/apps/game-server

FROM base as development

ENV MONGODB_URL=mongodb://mongodb:27017
ENV REDIS_URL=redis://redis:6379
ENV WEBSOCKETSERVER_URL=ws://game_server:8080

CMD ["yarn","dev"]


FROM base as production 

RUN yarn build
CMD ["yarn","start"]
