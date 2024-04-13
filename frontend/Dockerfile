# Node.js kép használata
FROM node:16

# Munkakönyvtár beállítása a konténeren belül
WORKDIR /app

# Függőségek másolása és telepítése
COPY package*.json ./
RUN npm install

# Alkalmazás forráskódjának másolása
COPY . .

# Exponálja a Vite alapértelmezett portját
EXPOSE 5173

# Az alkalmazás indítása
CMD ["npm", "run", "dev"]
