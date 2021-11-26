FROM node:12 as builder

WORKDIR /app
COPY ./package*.json ./
RUN echo 'Docker Container Start'
RUN npm install

COPY . .
EXPOSE 3000

FROM node:slim as runtime
WORKDIR /app

ENV NODE_ENV="development"
ENV DOCKER_ENV="development"

COPY --from=builder "/app/dist/" "/app/dist/"
COPY --from=builder "/app/node_modules/" "/app/node_modules/"
COPY --from=builder "/app/package.json" "/app/package.json"

CMD ["npm", "run", "start"]