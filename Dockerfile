#FROM node:12
#WORKDIR /app
#COPY ./package*.json ./
#RUN echo 'Docker Container Start'
#COPY . .
#EXPOSE 3000
#
#ENV NODE_ENV="development"
#ENV DOCKER_ENV="development"
#
##COPY --from=builder "/app/dist/" "/app/dist/"
##COPY --from=builder "/app/node_modules/" "/app/node_modules/"
##COPY --from=builder "/app/package.json" "/app/package.json"
#
##CMD ["npm", "run", "start"]



FROM node:12 as builder
WORKDIR /app

COPY ./package*.json ./
COPY ./tsconfig.json ./

RUN npm install
COPY . .

## compile typescript
RUN npm run build

## remove packages of devDependencies
#RUN npm prune --production

# ===================================================
FROM node:slim as runtime
WORKDIR /app

ENV NODE_ENV="development"
ENV DOCKER_ENV="development"

ENV PATH ./.env

## Copy the necessary files form builder
COPY --from=builder "/app/dist/" "/app/dist/"
COPY --from=builder "/app/node_modules/" "/app/node_modules/"
COPY --from=builder "/app/package.json" "/app/package.json"

EXPOSE 3000
CMD ["npm", "run", "start:prod"]