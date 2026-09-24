# Build the React client, then run the Express server that serves it.
FROM node:22-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
COPY client/package.json client/
COPY server/package.json server/
RUN npm ci
COPY client client
RUN npm run build

FROM node:22-alpine
ENV NODE_ENV=production PORT=3001
WORKDIR /app
COPY package.json package-lock.json ./
COPY server/package.json server/
COPY client/package.json client/
RUN npm ci --omit=dev -w server
COPY server server
COPY --from=build /app/client/dist client/dist
VOLUME /app/server/data
EXPOSE 3001
CMD ["node", "server/src/index.js"]
