FROM node:18-alpine

WORKDIR /app

COPY package.json ./
COPY bun.lock ./

RUN bun install

COPY . .

EXPOSE 3000

RUN bun install -g pm2

CMD ["pm2", "start", "bun", "--", "run", "index.ts"]



