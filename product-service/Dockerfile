# ---- 阶段 1: 构建 (Builder) ----
FROM node:20 AS builder 
WORKDIR /app
COPY package*.json ./
RUN npm ci 
COPY . .
RUN npm run build
RUN npm prune --production

# ---- 阶段 2: 生产 (Production) ----
FROM node:20-slim
WORKDIR /app
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

# !! 修改端口为 3002 !!
EXPOSE 3002 

CMD ["node", "dist/app.js"]