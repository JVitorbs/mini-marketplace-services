FROM node:20

WORKDIR /backend

COPY package*.json ./

# Primeiro copia Prisma schema )
# Depois então `prisma generate`
COPY prisma ./prisma

RUN if [ -f package-lock.json ]; then npm ci; else npm install; fi

COPY . .

RUN npx prisma generate --schema=prisma/schema.prisma

EXPOSE 3000

CMD ["npm", "start"]
