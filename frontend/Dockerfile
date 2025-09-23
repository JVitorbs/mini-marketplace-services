# Etapa de build
FROM node:20-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Etapa de execução
FROM node:20-alpine
WORKDIR /app

COPY --from=build /app/package*.json ./
RUN npm install --omit=dev

COPY --from=build /app/build ./build
COPY --from=build /app/.svelte-kit ./.svelte-kit

EXPOSE 3000
CMD ["node", "build"]
