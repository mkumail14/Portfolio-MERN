# 1. Base Image
FROM node:20

# 2. Container ke andar app folder set karein
WORKDIR /app

# 3. Sirf package files copy karein (for caching)
COPY package*.json ./

# 4. Dependencies install karein
RUN npm install

# 5. Baqi saara backend code copy karein
COPY . .

# 6. Vite default port 5173 use karta hai
EXPOSE 5173

# 7. Startup command with the special --host flag for Docker
CMD ["npm", "run", "dev", "--", "--host"]
