# Client
FROM node:lts-bookworm-slim AS build-client
ARG artifact=false

USER node

WORKDIR /app/client

COPY --chown=node:node client/package*.json .
RUN if [[ "${artifact}" = "false" ]]; then npm ci --omit=dev; fi

COPY --chown=node:node client/ .

RUN if [[ "${artifact}" = "false" ]]; then npm run build; fi


# Server
FROM node:lts-bookworm-slim AS run-server

WORKDIR /app/server

COPY --chown=node:node server/package*.json .
RUN npm ci --omit=dev

COPY --chown=node:node server/ .

COPY --from=build-client /app/client/dist /app/client/dist 

EXPOSE 3000

ENTRYPOINT ["node", "bin/www"]