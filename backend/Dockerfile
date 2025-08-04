FROM oven/bun:1.1.13-slim

WORKDIR /app

COPY package.json ./
COPY bun.lock ./

RUN bun install

COPY . .

EXPOSE 3000

RUN bun install -g pm2

CMD ["pm2", "start", "bun", "--", "run", "index.ts"]



