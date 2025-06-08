# -------------------- Stage 1: Build --------------------
    FROM node:18-alpine AS builder

    # 1. Cài đặt MỌI dependencies (kể cả devDependencies)
    COPY package*.json ./
    RUN npm ci  # Cài cả devDependencies (typescript, ts-node...)
    
    # 2. Build TypeScript -> JavaScript
    COPY . .
    RUN npm run build  # Tạo thư mục /dist
    
    # -------------------- Stage 2: Production --------------------
    FROM node:18-alpine
    
    # 1. Chỉ cài production dependencies (không có devDependencies)
    COPY package*.json ./
    RUN npm ci --only=production  # <-- Chỉ production!
    
    # 2. Copy KẾT QUẢ BUILD từ Stage 1
    COPY --from=builder /app/dist ./dist  # <-- Chỉ copy thư mục /dist
    
    # 3. Chạy ứng dụng
    CMD ["npm", "start"]