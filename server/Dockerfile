FROM node:24-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY tsconfig*.json ./
COPY nest-cli.json ./
COPY prisma ./prisma
COPY prisma.config.ts ./prisma.config.ts
COPY src ./src

RUN npm ci
RUN npm run prisma:generate
RUN npm run build


FROM node:24-alpine AS runner

COPY --from=builder /app/package.json ./app/package.json
COPY --from=builder /app/prisma ./app/prisma
COPY --from=builder /app/prisma.config.ts ./app/prisma.config.ts
COPY --from=builder /app/node_modules ./app/node_modules
COPY --from=builder /app/dist ./app/dist

EXPOSE 4200