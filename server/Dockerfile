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

COPY --from=builder /server/dist ./dist

ENV NODE_ENV=production
ENV PORT=3000

CMD ["node", "dist/main.js"]
