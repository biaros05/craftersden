FROM node:lts-bookworm-slim AS build-client

USER node

WORKDIR /app/client

COPY --chown=node:node client/package*.json .
RUN npm ci --omit=dev

COPY --chown=node:node client/ .

RUN npm run build


# Server
FROM node:lts-bookworm-slim AS run-server

WORKDIR /app/server

COPY --chown=node:node server/package*.json .
RUN npm ci --omit=dev

COPY --chown=node:node server/ .

COPY --from=build-client /app/client/dist /app/client/dist 

EXPOSE 3000

ENTRYPOINT ["node", "bin/www"]