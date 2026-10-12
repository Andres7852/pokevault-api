# ⚡ PokéVault API — Backend REST Full-Stack

API REST profesional para **PokéVault** (Tienda de Coleccionables y Cartas Pokémon TCG). Desarrollada con **Node.js**, **Express**, **TypeScript**, **Prisma ORM** y **PostgreSQL**, siguiendo estrictamente una **arquitectura limpia desacoplada en 4 capas** (Domain, Application, Infrastructure, Interface).

---

## 🌐 Enlaces de Despliegue

| Servicio         | Plataforma       | URL                       |
| :--------------- | :--------------- | :------------------------ |
| **API Backend**  | Render / Railway | --- AUN NO DISPONIBLE --- |
| **Frontend Web** | Vercel           | --- AUN NO DISPONIBLE --- |

---

## 📦 Stack Tecnológico

- **Entorno:** Node.js v20+ / TypeScript
- **Framework Web:** Express.js 4/5
- **ORM & Modelado:** Prisma ORM 5.22.0
- **Base de Datos:** PostgreSQL (alojada en Supabase / Neon)
- **Seguridad & Auth:** JSON Web Tokens (`jsonwebtoken`) y Hashing con `bcrypt`
- **Control de Acceso:** CORS dinámico y Middlewares de roles (`ADMIN` y `USER`)

---

## 🏛️ Arquitectura en 4 Capas

El backend está organizado de manera que la lógica de negocio permanezca independiente de la base de datos y de la capa HTTP:

```
src/
├── domain/                      # 1. CAPA DE DOMINIO
│   └── entities/                # Modelos y contratos puros (User, Producto, Pedido)
├── application/                 # 2. CAPA DE APLICACIÓN
│   └── use-cases/               # Casos de uso de negocio (Auth, Producto, Pedido)
├── infrastructure/              # 3. CAPA DE INFRAESTRUCTURA
│   ├── database/                # Conexión y cliente Prisma
│   └── security/                # Hashing con Bcrypt y firma/verificación JWT
└── interface/                   # 4. CAPA DE INTERFAZ (PRESENTACIÓN)
    ├── controllers/             # Controladores Express
    ├── routes/                  # Definición de routers y endpoints
    └── middlewares/             # Auth JWT, Role Admin y Manejador de Errores
```

---

## 🔑 Credenciales de Prueba (Cargadas vía Seed)

Credenciales habilitadas para evaluación y pruebas del entorno de entrega:

| Rol       | Nombre       | Correo Electrónico    | Contraseña  | Permisos                                                                      |
| :-------- | :----------- | :-------------------- | :---------- | :---------------------------------------------------------------------------- |
| **ADMIN** | Profesor Oak | `admin@pokevault.com` | `Admin123*` | Lectura, creación, edición y eliminación del catálogo + ver todos los pedidos |
| **USER**  | Ash Ketchum  | `ash@pokevault.com`   | `User123*`  | Lectura del catálogo, crear pedidos a su nombre y ver sus propios pedidos     |

---

## 🚀 Instalación y Ejecución Local

### 1. Clonar el repositorio y entrar a la carpeta

```bash
git clone https://github.com/TU_USUARIO/pokevault-api.git
cd pokevault-api
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Crea tu archivo `.env` a partir del ejemplo:

```bash
cp .env.example .env
```

Edita el archivo `.env` con tus datos de conexión:

```env
PORT=4000
DATABASE_URL="postgresql://postgres:TU_PASSWORD@localhost:5432/pokevault_db?schema=public"
JWT_SECRET="pokevault_super_secret_jwt_key_2026"
JWT_EXPIRES_IN="24h"
FRONTEND_URL="http://localhost:3000"
```

### 4. Ejecutar migraciones y poblar la base de datos (Seed)

Aplica el esquema en PostgreSQL y genera los 21 productos de Entrega 1:

```bash
npx prisma migrate dev --name init
npm run prisma:seed
```

### 5. Iniciar en modo desarrollo

```bash
npm run dev
```

El servidor quedará disponible en: `http://localhost:4000`

---

## 📡 Tabla de Endpoints de la API

| Método   | Endpoint             | Acceso          | Descripción                                          |
| :------- | :------------------- | :-------------- | :--------------------------------------------------- |
| `POST`   | `/api/auth/register` | Público         | Registro de usuario (valida email único `409`)       |
| `POST`   | `/api/auth/login`    | Público         | Autenticación de usuario (emite JWT con expiración)  |
| `GET`    | `/api/productos`     | Público         | Lista catálogo con paginación `{ pagination, data }` |
| `GET`    | `/api/productos/:id` | Público         | Obtiene detalle de un producto específico            |
| `POST`   | `/api/productos`     | **Solo Admin**  | Crea un producto en el catálogo                      |
| `PUT`    | `/api/productos/:id` | **Solo Admin**  | Modifica un producto existente                       |
| `DELETE` | `/api/productos/:id` | **Solo Admin**  | Elimina un producto del catálogo                     |
| `POST`   | `/api/pedidos`       | **Autenticado** | Crea pedido asociando el `userId` desde el token     |
| `GET`    | `/api/pedidos/mias`  | **Autenticado** | Retorna únicamente los pedidos del usuario en sesión |
| `GET`    | `/api/pedidos`       | **Solo Admin**  | Retorna todos los pedidos registrados en el sistema  |

---

## 🧠 Decisiones Técnicas y Justificaciones

### 1. Flujo completo de Autenticación (Login)

1. **Petición del cliente:** El usuario envía `email` y `password` mediante `POST /api/auth/login`.
2. **Validación en Caso de Uso:** `AuthUseCase.login` consulta el usuario en la tabla `users` mediante Prisma.
3. **Comparación criptográfica:** Se utiliza `bcrypt.compare()` para verificar la contraseña sin desencriptarla en memoria ni exponerla en texto plano. Si falla, se emite un error `401` con mensaje genérico (_"Credenciales inválidas"_), impidiendo ataques de enumeración de usuarios.
4. **Firma del JWT:** Si las credenciales coinciden, se firma un token con `jsonwebtoken` usando la variable `JWT_SECRET` y una expiración de `24h`.
5. **Payload mínimo seguro:** El token transporta únicamente `{ id, role }`. Jamás contraseñas ni datos sensibles.
6. **Consumo protegido:** En subsecuentes llamadas a rutas privadas (ej. `/api/pedidos`), el middleware `authenticateToken` extrae el encabezado `Authorization: Bearer <token>`, valida la firma con la clave secreta y monta `req.user = payload`.
7. **Control de acceso:** El controlador lee `req.user.id` de forma confiable, garantizando la identidad del solicitante.

### 2. Almacenamiento del Token en el Frontend y Análisis de Riesgos

- **Decisión:** El token se guarda en el cliente en `localStorage` sincronizado mediante el contexto global de React/Next.js.
- **Ventaja:** Permite persistencia transparente de la sesión al refrescar la página (`F5`) y facilita el desacoplamiento entre el cliente HTTP y el servidor API.
- **Riesgo:** `localStorage` es vulnerable a ataques de tipo **XSS (Cross-Site Scripting)** si un script malicioso de terceros lograra ejecutarse en el DOM.
- **Mitigación para producción bancaria:** Para mitigar totalmente este riesgo, la alternativa superior es almacenar el JWT dentro de una **Cookie con atributos `HttpOnly`, `Secure` y `SameSite=Strict`**, bloqueando el acceso por JavaScript.

### 3. Diferenciación Práctica: Errores HTTP 401 vs 403

En PokéVault ambos códigos tienen propósitos semánticos distintos y claramente delimitados:

- **`401 Unauthorized` (Falta de Autenticación o Token Inválido):**
  - _Cuándo ocurre:_ La petición requiere identidad pero no se adjunta token o el token expiró/es corrupto.
  - _Ejemplo real en el proyecto:_ Un usuario anónimo que no ha iniciado sesión intenta enviar un encargo ejecutando `POST /api/pedidos` sin cabecera `Authorization`. El middleware `authenticateToken` rechaza inmediatamente la llamada con código `401`.
- **`403 Forbidden` (Autenticado pero sin Permiso de Rol):**
  - _Cuándo ocurre:_ El usuario presentó un token válido y está identificado, pero su rol no posee los privilegios suficientes para la operación.
  - _Ejemplo real en el proyecto:_ El usuario `ash@pokevault.com` (rol `USER`) intenta eliminar una consola del catálogo enviando `DELETE /api/productos/7`. El token es válido, pero el middleware `requireAdmin` comprueba que `req.user.role !== 'ADMIN'` y bloquea la operación con código `403`.

### 4. Uso de Inteligencia Artificial

- **¿Para qué se usó?** Como asistente técnico para agilizar la estructuración de tipos e interfaces de TypeScript, generación de scripts de migración y sintaxis inicial de middlewares. Para ayudar a resolver errores que se presentaron durante la realizacion y ayudarme a entender de mejor manera el funcionamiento de Prisma y Express.
- **¿Qué se tuvo que corregir manualmente?**
  1. Se ajustó el tipado estricto en Express donde `req.params.id` venía como `string | string[]` y producía error en `parseInt()`.
  2. Se corrigió el middleware de errores para capturar excepciones nativas de Prisma (`PrismaClientKnownRequestError`) mapeando correctamente los códigos `P2002` a `409 Conflict` y `P2025` a `404 Not Found`.
  3. Se removieron paquetes experimentales no estables asegurando compatibilidad con Prisma 5.22.

---

## 📸 Network Tab

Aun no se adjuntan imagenes de la red.
