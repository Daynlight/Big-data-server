FROM node:20-alpine

WORKDIR /server

COPY package*.json ./
RUN npm install

COPY . .

ENV NODE_ENV=production
ENV PORT=3000

RUN npm run build

CMD ["node", "dist/main.js"]
