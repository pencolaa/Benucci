# Benucci

Aplicativo Expo com backend local em Node.js + SQLite para login, produtos, carrinho, favoritos, preferencias, enderecos e historico de pedidos.

## Como iniciar

1. Suba o backend:

   ```bash
   npm run backend
   ```

2. Em outro terminal, suba o app:

   ```bash
   npx expo start
   ```

## Backend

- Arquivo principal: `backend/server.js`
- Banco SQLite local: `backend/data/benucci.sqlite`
- Health check: `http://localhost:3001/health`

## Credenciais iniciais

- Admin
  - Email: `admin@benucci.com`
  - Senha: `admin123`

- Cliente seed
  - Email: `erinadpereira934@gmail.com`
  - Senha: `123456789`

## Observacoes

- O app tenta descobrir automaticamente o IP do backend via Expo.
- Se estiver usando aparelho fisico e a deteccao automatica nao funcionar, defina `EXPO_PUBLIC_API_URL` apontando para a sua maquina, por exemplo:

  ```bash
  EXPO_PUBLIC_API_URL=http://192.168.0.10:3001
  ```
