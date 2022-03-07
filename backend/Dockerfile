FROM node:lts-alpine
WORKDIR /usr/src/app
COPY package-*.json ./
RUN npm install
COPY . .
EXPOSE 80
CMD [ "/usr/src/app/node_modules/.bin/nodemon", "server.js" ]