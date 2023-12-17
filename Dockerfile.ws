FROM node:21.2

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
RUN yarn build
RUN npm install pm2 -g


EXPOSE 8080

WORKDIR /base/apps/game-server

CMD ["yarn","start"]
