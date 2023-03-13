# Auth Server

General-purpose HTTP-based authentication and authorization server. Built with [Node.js](https://nodejs.org/) and [Nest.js](https://nestjs.com/).

**Features**
- User registration and verification via email.
- Basic authentication using email and password.
- Authorization using [JSON Web Tokens](https://jwt.io/).
- Delete not verified users after the verification token expires.
- Reset password via email.
- Change email address via email.
- API [documentation](https://adcimon.github.io/auth-server/api/) available.

## Installation

1. Configure the `.env` file.

2. Install `Node 16`.

3. Install packages.
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
