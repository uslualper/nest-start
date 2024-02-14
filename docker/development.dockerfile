FROM node:18-alpine AS development

WORKDIR /app

COPY package*.json ./

RUN npm install rimraf

RUN npm install --only=dev

COPY . .

RUN npx prisma generate

CMD ["npm", "run", "start:dev"]