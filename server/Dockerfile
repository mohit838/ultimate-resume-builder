# 1) build your app with dev tools
FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# 2) produce a slim runtime image
FROM node:22-alpine AS runtime
WORKDIR /app

# install only production deps
COPY --from=build /app/package*.json ./
RUN npm ci --omit=dev \
  && npm cache clean --force \
  && rm -rf /var/cache/apk/*

# copy build output
COPY --from=build /app/dist ./dist

EXPOSE 3333
CMD ["node","dist/server.js"]
