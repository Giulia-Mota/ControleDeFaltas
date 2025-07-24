# Backend - Controle de Faltas

## Configuração

1. Copie o arquivo `.env.example` para `.env` e preencha com suas informações:
   - `MONGODB_URI`: string de conexão do MongoDB Atlas
   - `JWT_SECRET`: uma chave secreta para autenticação JWT
   - `PORT`: porta para rodar o servidor (padrão: 5000)

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Inicie o servidor:
   ```bash
   npm start
   ```

## Estrutura de Pastas
- `src/controllers`: lógica dos endpoints
- `src/models`: modelos do banco de dados
- `src/routes`: rotas da API
- `src/middlewares`: middlewares de autenticação e outros 