FROM node:20-alpine

WORKDIR /client

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=3000

CMD ["npx", "vite", "preview", "--port", "3000", "--host"]