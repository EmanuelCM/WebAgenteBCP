
# Agente BCP API

## Descripción
API para el sistema Agente BCP que proporciona servicios de gestión y autenticación de usuarios.

## Requisitos Previos
- Node.js (v14 o superior)
- MongoDB
- npm o yarn
- Cuenta de Gmail (para el servicio de correos)

## Instalación

1. Clonar el repositorio
```bash
git clone <url-del-repositorio>
cd agente-bcp
```

2. Instalar dependencias
```bash
npm install
# o
yarn install
```

3. Configurar variables de entorno
Crear un archivo `.env` en la raíz del proyecto con las siguientes variables:

```env
# Puerto del servidor
PORT=3000

# Configuración de MongoDB
MONGO_URL=mongodb://mongo-user:123456@localhost:27017
MONGO_DB_NAME=agentebcp

# JWT
JWT_SEED=mi_clave_super_secreta

# Configuración del servicio de correos
MAILERSERVICE=gmail
MAILEREMAIL=your-email@gmail.com
MAILERSECRETKEY=your-app-specific-password

# URL del servicio web
WEBSERVICE_URL=localhost:3000/api
```

### Desarrollo
```bash
npm run dev
# o
yarn dev
```

### Producción
```bash
npm run build
npm start
# o
yarn build
yarn start
```

## Endpoints Principales

- `POST /api/auth/login` - Autenticación de usuarios
- `POST /api/auth/register` - Registro de nuevos usuarios
- `GET /api/users` - Obtener usuarios (requiere autenticación)

Para más detalles sobre los endpoints disponibles, consulta la documentación de la API.

## Scripts Disponibles

- `npm run dev` - Inicia el servidor en modo desarrollo
- `npm run build` - Compila el proyecto
- `npm start` - Inicia el servidor en modo producción
- `npm test` - Ejecuta las pruebas


## Contacto

Emanuel Chaupis - emanuel.chaupis1@gmail.com

Link del proyecto: [https://github.com/your-username/agente-bcp](https://github.com/your-username/agente-bcp)
