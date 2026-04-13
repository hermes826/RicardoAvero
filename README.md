# Patch corregido para FactoryMotorBike / Ricardo Avero

## Archivos que debes reemplazar

### Backend
- `backend/src/routes/bikeRoutes.js`
- `backend/src/controllers/bikeController.js`
- `backend/.env.example`

### Frontend
- `frontend/src/pages/admin/BikeForm.jsx`
- `frontend/.env.example`

## Qué corrige

- En `NODE_ENV=development` ya no usa Cloudinary para subir imágenes.
- En desarrollo, las imágenes se guardan en `backend/uploads/` y se sirven desde `/api/files/...`.
- En producción, se sigue usando Cloudinary como antes.
- Al eliminar una imagen desde editar anuncio, el admin vuelve a cargar el vehículo y la galería queda sincronizada.
- Se añaden ejemplos de variables de entorno.

## Variables de entorno backend

```env
NODE_ENV=development
PORT=4000
MONGODB_URI=mongodb://127.0.0.1:27017/ricardoavero
JWT_SECRET=pon_una_clave_larga_y_segura
ADMIN_EMAIL=admin@ricardoavero.com
ADMIN_PASSWORD=Admin1234@
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

## Variables de entorno frontend

```env
VITE_BACKEND_URL=http://localhost:4000
```

## Cómo probar en local

### 1. Backend
```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

### 2. Seed opcional
```bash
npm run seed
```

### 3. Frontend
```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

## URLs típicas

- Backend: `http://localhost:4000`
- Healthcheck: `http://localhost:4000/api/health`
- Archivos locales: `http://localhost:4000/api/files/nombre.jpg`
- Frontend Vite: `http://localhost:5173`
