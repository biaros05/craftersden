FROM node:lts-bookworm-slim

USER node

WORKDIR /app

COPY --chown=node:node package*.json .

RUN npm ci --omit=dev

COPY --chown=node:node . .

EXPOSE 3000

ENTRYPOINT ["node", "bin/www"]