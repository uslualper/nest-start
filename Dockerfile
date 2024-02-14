FROM node:18-alpine as production

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npx prisma generate

RUN npm run build

CMD [ "node", "dist/main.js" ]