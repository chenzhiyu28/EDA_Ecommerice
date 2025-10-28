# Stage 1: builder

FROM node:20 AS Builder

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY ./ ./
# remove dev dependencies
RUN npm prune --production



# Stage 2: Production
FROM node:20-slim

WORKDIR /app

COPY --from=Builder /app/package*.json ./
COPY --from=Builder /app/node_modules ./node_modules
COPY --from=Builder /app/dist ./dist

EXPOSE 3000

CMD ["node", "dist/app.js"]