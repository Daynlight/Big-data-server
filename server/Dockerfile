# ---------- BUILD ----------
FROM node:20-alpine AS builder

WORKDIR /server

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build


# ---------- PRODUCTION ----------
FROM node:20-alpine

WORKDIR /server

COPY package*.json ./
RUN npm install --omit=dev

ENV NODE_ENV=production
ENV PORT=3000

COPY --from=builder /server/dist ./dist

CMD ["node", "dist/main.js"]
