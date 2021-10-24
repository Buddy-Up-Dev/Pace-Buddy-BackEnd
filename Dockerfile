FROM node:12
WORKDIR /app
COPY package*.json ./
RUN echo 'Docker Container Start'
COPY . .
EXPOSE 3000