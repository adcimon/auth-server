# Auth Server

General-purpose HTTP-based authentication and authorization server. The project is built with [Node.js](https://nodejs.org/) and [Nest.js](https://nestjs.com/).

**Features**
- User registration and verification via email.
- Basic authentication using email and password.
- Authorization using [JSON Web Tokens](https://jwt.io/).
- Delete not verified users after the verification token expires.
- Reset password via email.

The [API documentation](https://adcimon.github.io/auth-server/api/) can be found inside the `api` folder.

The `.env` files have the environment variables used by the server.

| Variables |
| ----- |
| NODE_ENV |
| PORT |
| ENABLE_CORS |
| ENABLE_HTTPS |
| KEY_PATH |
| CERT_PATH |
| STATIC_PATH |
| APP_NAME |
| VERIFY_EMAIL_LINK |
| RESET_PASSWORD_LINK |
| TOKEN_SECRET_KEY |
| TOKEN_EXPIRATION_TIME |
| TOKEN_VERIFICATION_EXPIRATION_TIME |
| TOKEN_RESET_PASSWORD_EXPIRATION_TIME |
| DATABASE_TYPE |
| DATABASE_HOST |
| DATABASE_PORT |
| DATABASE_USERNAME |
| DATABASE_PASSWORD |
| DATABASE_NAME |
| DATABASE_ENTITIES |
| MAIL_HOST |
| MAIL_PORT |
| MAIL_SECURE |
| MAIL_USER |
| MAIL_PASSWORD |
| MAIL_NOREPLY_FROM |

## Installation

1. Install `Node 16`.

2. Install packages.
```
cd auth-server
npm install
```

## Run

Run the server for development, debug or production.
```
cd auth-server
npm run start:dev
npm run start:debug
npm run start:prod
```

## Build and Deploy

Build the project, compiling it to JavaScript.
```
cd auth-server
npm run build
```

Once the `dist` folder is created start the application.
```
node dist/main.js
```