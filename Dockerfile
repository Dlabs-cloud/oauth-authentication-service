FROM node:14.10.1-alpine3.12

WORKDIR /app

COPY .docker/node_modules ./node_modules
COPY views ./views
COPY dist/ ./dist
RUN ls -la

CMD ["node","dist/src/main.js" ]