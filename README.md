# MERN Alapú Webshop Telepítési Útmutató

1. **Klónozza a repót**
   
   Nyissa meg a terminált, és futtassa a következő parancsot:
   ```bash
   git clone https://github.com/horvathdavid212/MERN_webshop.git


## Backend Telepítése

1. **Menjen a backend mappába**
   ```bash
   cd backend

2. **Telepítse a függőségeket**
   ```bash
   npm install

3.  **Állítsa be a környezeti változókat**
    ```bash
    MONGODB_URI=mongodb+srv://<FELHASZNÁLÓNÉV>:<JELSZÓ>@cluster0.f3ppkjj.mongodb.net/<ADATBÁZISNEVE>?retryWrites=true&w=majority
    JWT_SECRET=valamiTitkos
    PAYPAL_CLIENT_ID=sb
 
  Nevezze át a .env.example fájlt .env-re, és cserélje le a valós adatokra.
  Cserélje le a <felhasználónév>, <jelszó>, <jwt_titkos_kulcs> és <paypal_kliens_id> részeket a saját MongoDB, JWT és PayPal adataira.

4.  **Backend indítása**
    ```bash
    npm run dev

## Frontend Telepítése

1. **Menjen a frontend mappába**
   ```bash
   cd frontend

2. **Telepítse a függőségeket**
   ```bash
   npm install
   
3. **Frontend indítása**
   ```bash
   npm run dev
   
