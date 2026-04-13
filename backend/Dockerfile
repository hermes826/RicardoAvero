FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
COPY .npmrc .npmrc

RUN npm install --no-audit --no-fund --registry=https://registry.npmjs.org/

COPY . .

EXPOSE 4000

CMD ["npm", "start"]