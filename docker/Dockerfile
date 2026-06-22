FROM node:20 AS build

WORKDIR /app

COPY ToTheSourceUI/package*.json ./

RUN npm install --legacy-peer-deps

COPY ToTheSourceUI/ .

RUN npm run build

FROM node:20-alpine

WORKDIR /app

COPY --from=build /app ./

EXPOSE 4000

CMD ["node", "dist/ToTheSourceUI/server/server.mjs"]
