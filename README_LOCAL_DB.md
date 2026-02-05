# Usar MongoDB local para desarrollo

Pasos rápidos para que cada desarrollador use una base de datos local (evita usar la instancia compartida):

1. Arrancar MongoDB local con Docker Compose:

```bash
docker compose -f docker-compose.local.yml up -d
```

Esto expone MongoDB en `localhost:27017` y crea la base `Handcrafted`.

2. Crear un archivo de entorno local (no comiteado):

```bash
cp .env.local.example .env.local
# Edita .env.local si necesitas cambiar secretos
```

3. Arranca la app en modo desarrollo:

```bash
npm install
npm run dev
```

4. Verifica la conexión y trabaja en tu rama local sin tocar la base compartida.

Notas:
- No subas `.env.local` al repositorio (ya está en `.gitignore`).
- Si usas Windows y Docker Desktop, asegúrate de que Docker esté en ejecución.
