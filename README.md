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

## Docker

Ez az alkalmazás Docker segítségével is futtatható. Ehhez először telepíteni kell a Docker Desktop alkalmazást.

### Alkalmazás Futtatása Dockerrel

Miután telepítette és elindította a Docker Desktopot, a következő parancsot kell használni a project főkönyvtárában az alkalmazás elindításához:

```bash
docker-compose up
```

Ez a parancs elindítja az összes szükséges szolgáltatást a docker-compose.yml fájlban megadott konfiguráció alapján. Amint a szolgáltatások elindultak, az alkalmazás frontend része megnyitható a böngészőben a következő címen: http://localhost:5173. Ha csak a szerverre lenne szükség, akkor az ezen a porton megtalálható: http://localhost:5000.

Ez az útmutató leírja, hogyan lehet Docker segítségével elindítani az alkalmazást és hogyan lehet a Docker-t használni a fejlesztés során. Fontos, hogy a `docker-compose.yml` fájlban a portok és egyéb beállítások megfeleljenek az alkalmazás specifikációinak. Az útmutatóban szereplő portokat és utasításokat szükség szerint módosítani kell a projekt sajátosságaihoz igazodva. Valamint a `Dockerfile` mezőit is át kell írni, ha szükség lenne rá.
