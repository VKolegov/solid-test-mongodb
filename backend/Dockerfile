FROM node:lts-alpine
WORKDIR /node-server
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 80
CMD [ "/node-server/node_modules/.bin/nodemon", "server.js" ]