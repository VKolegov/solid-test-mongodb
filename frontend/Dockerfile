FROM node:lts-alpine
WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 8000

# Запускаем приложение
CMD ["npm", "run", "dev"]

