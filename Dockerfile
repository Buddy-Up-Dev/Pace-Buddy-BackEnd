FROM node:12
WORKDIR /app
COPY package*.json ./
RUN echo 'Docker Container Start'
COPY . .
EXPOSE 3000
RUN npm install

#COPY --from=builder "/app/dist/" "/app/dist/"
#COPY --from=builder "/app/node_modules/" "/app/node_modules/"
#COPY --from=builder "/app/package.json" "/app/package.json"

CMD ["npm", "run", "start"]