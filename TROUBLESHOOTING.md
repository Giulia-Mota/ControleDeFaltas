# Guia de Troubleshooting - Deploy no Render

## Problema: Erro 404 no Login

### 1. Verificar se o Backend está rodando

Após o deploy, teste estas URLs:

```
https://controledefaltas-api.onrender.com/
https://controledefaltas-api.onrender.com/test
```

**Resposta esperada:**
- `/` deve retornar: "API do Controle de Faltas está funcionando!"
- `/test` deve retornar um JSON com informações das variáveis de ambiente

### 2. Verificar Variáveis de Ambiente no Render

No dashboard do seu projeto backend no Render, verifique se estas variáveis estão configuradas:

```
MONGO_URI=mongodb+srv://seu_usuario:sua_senha@seu_cluster.mongodb.net/controle_faltas
FRONTEND_URL=https://minhasfaltas.onrender.com
JWT_SECRET=sua_chave_secreta_jwt
```

### 3. Verificar Logs do Backend

No Render, vá para:
1. Seu projeto backend
2. Clique em "Logs"
3. Verifique se há erros de:
   - Conexão com MongoDB
   - Carregamento de rotas
   - Variáveis de ambiente

### 4. Verificar Configuração do Frontend

No dashboard do seu projeto frontend no Render, verifique se esta variável está configurada:

```
REACT_APP_API_URL=https://controledefaltas-api.onrender.com/api
```

### 5. Testar Rotas da API

Se o backend estiver funcionando, teste estas rotas:

```
POST https://controledefaltas-api.onrender.com/api/auth/register
POST https://controledefaltas-api.onrender.com/api/auth/login
GET https://controledefaltas-api.onrender.com/api/materias
```

### 6. Problemas Comuns

#### A. Backend não inicia
- Verifique se `MONGO_URI` está correta
- Verifique se todas as dependências estão no `package.json`

#### B. CORS Error
- Verifique se `FRONTEND_URL` está correta no backend
- Deve ser exatamente: `https://minhasfaltas.onrender.com`

#### C. 404 nas rotas
- Verifique se as rotas estão sendo carregadas nos logs
- Verifique se o caminho das rotas está correto

### 7. Comandos de Debug

Para testar localmente:

```bash
# Backend
cd backend
npm install
npm start

# Frontend
cd frontend
npm install
npm start
```

### 8. URLs de Teste

- **Backend**: https://controledefaltas-api.onrender.com
- **Frontend**: https://minhasfaltas.onrender.com
- **Teste API**: https://controledefaltas-api.onrender.com/test

### 9. Próximos Passos

1. Aguarde o deploy automático (2-3 minutos)
2. Teste a rota `/test` no backend
3. Verifique os logs no Render
4. Teste o login no frontend
5. Se ainda der erro, verifique as variáveis de ambiente 