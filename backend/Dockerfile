



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

# 6. Aapka server port 5000 par run ho raha hai (as per terminal)
EXPOSE 5000

# 7. Aapka custom startup command
CMD ["node", "api/index.js"]