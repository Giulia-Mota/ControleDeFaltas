# Guia de Deploy no Render

## Configuração do Backend

### 1. Variáveis de Ambiente no Render (Backend)
Configure as seguintes variáveis no seu projeto backend no Render:

```
MONGO_URI=mongodb+srv://seu_usuario:sua_senha@seu_cluster.mongodb.net/controle_faltas
FRONTEND_URL=https://seu-frontend-render.onrender.com
JWT_SECRET=sua_chave_secreta_jwt
PORT=5000
```

### 2. Configurações do Build (Backend)
- **Build Command**: `npm install`
- **Start Command**: `node src/app.js`

## Configuração do Frontend

### 1. Variáveis de Ambiente no Render (Frontend)
Configure a seguinte variável no seu projeto frontend no Render:

```
REACT_APP_API_URL=https://seu-backend-render.onrender.com/api
```

### 2. Configurações do Build (Frontend)
- **Build Command**: `npm install && npm run build`
- **Publish Directory**: `build`

## Passos para Deploy

### Backend:
1. Conecte seu repositório GitHub ao Render
2. Configure as variáveis de ambiente listadas acima
3. Deploy automático será feito

### Frontend:
1. Conecte seu repositório GitHub ao Render
2. Configure a variável `REACT_APP_API_URL` com a URL do seu backend
3. Deploy automático será feito

## URLs Exemplo:
- Backend: `https://controle-faltas-backend.onrender.com`
- Frontend: `https://controle-faltas-frontend.onrender.com`

## Verificação:
1. Acesse a URL do backend: deve mostrar "API do Controle de Faltas está funcionando!"
2. Acesse a URL do frontend: deve carregar a aplicação React
3. Teste login/cadastro: deve funcionar sem erros de CORS

## Troubleshooting:
- Se der erro de CORS: verifique se `FRONTEND_URL` está correto no backend
- Se der erro de conexão: verifique se `REACT_APP_API_URL` está correto no frontend
- Se der erro de banco: verifique se `MONGO_URI` está correto 