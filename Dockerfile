FROM node:14-alpine as builder

ENV NODE_ENV build

WORKDIR /home/node

COPY ./src/ /home/node/src/
COPY ./package*.json /home/node/
COPY ./tsconfig.build.json /home/node/
COPY ./tsconfig.json /home/node/

RUN  npm ci
RUN npm run build
#RUN pwd
#RUN ls -la ./dist

FROM node:14-alpine

ENV NODE_ENV production

USER node
WORKDIR /home/node

COPY --from=builder /home/node/package*.json /home/node/
COPY --from=builder /home/node/dist/ /home/node/dist/
#RUN ls -la ./dist
RUN npm ci --only=prod


CMD ["node", "dist/main.js"]
