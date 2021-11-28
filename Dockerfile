FROM node:12
WORKDIR /app
COPY ./package*.json ./
RUN echo 'Docker Container Start'
RUN npm install -g nest
RUN npm install
COPY . .
EXPOSE 3000

#COPY --from=builder "/app/dist/" "/app/dist/"
#COPY --from=builder "/app/node_modules/" "/app/node_modules/"
#COPY --from=builder "/app/package.json" "/app/package.json"

CMD ["npm", "run", "start"]