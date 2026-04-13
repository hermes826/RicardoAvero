# Ricardo Avero Frontend

Frontend en React + Vite inspirado en el estilo de la referencia que me pasaste: hero grande, buscador centrado, paleta azul/negro y look de concesionario premium.

## Requisitos

- Node 20 recomendado
- Backend funcionando en `http://localhost:4000`

## Variables de entorno

Crea un archivo `.env` a partir de `.env.example`:

```bash
cp .env.example .env
```

Contenido:

```env
VITE_BACKEND_URL=http://localhost:4000
```

## Instalar y arrancar

```bash
npm install
npm run dev
```

## Endpoints esperados del backend

- `POST /api/auth/login`
- `GET /api/bikes`
- `GET /api/bikes/:id`
- `POST /api/bikes`
- `PUT /api/bikes/:id`
- `DELETE /api/bikes/:id`
- `POST /api/bikes/:id/images`
- `DELETE /api/bikes/:id/images/:imagePath`
- `GET /api/contact`
- `PUT /api/contact`

## Nota

La página de contacto usa los datos públicos del backend y genera contacto por WhatsApp o email. Así no dependes de tener un endpoint extra para enviar formularios.
