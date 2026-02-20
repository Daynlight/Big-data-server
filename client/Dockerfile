# ---------- BUILD ----------
FROM node:20-alpine AS builder

WORKDIR /client

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# ---------- PRODUCTION ----------
FROM nginx:alpine

COPY --from=builder /client/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

CMD ["nginx", "-g", "daemon off;"]