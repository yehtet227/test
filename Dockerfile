FROM node:21.0.0-alpine3.18 AS base

RUN npm i -g pnpm

FROM base AS dependencies

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN pnpm install

FROM base AS build

WORKDIR /app
COPY . .
COPY --from=dependencies /app/node_modules ./node_modules
RUN pnpm build
#RUN pnpm prune

# FROM base AS deply

# WORKDIR /
# COPY . .
#COPY --from=build /app/dist/ ./dist/
# COPY --from=build /app/node_modules ./node_modules

EXPOSE 3000

CMD [ "pnpm", "start" ]