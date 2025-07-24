<<<<<<< HEAD
# Controle de Faltas

## Sobre o Projeto

O **Controle de Faltas** é um sistema web para estudantes acompanharem suas faltas em cada matéria ao longo do semestre. O objetivo é facilitar o controle, evitar reprovação por excesso de faltas e dar uma visão clara do progresso em cada disciplina.

## Funcionalidades
- Cadastro e login de usuário (com autenticação segura)
- Cadastro de matérias (nome, professor, carga horária, aulas por semana/dia, limite de faltas)
- Visualização de todas as matérias cadastradas
- Ao clicar em uma matéria, visualizar e gerenciar as faltas daquela disciplina
- Adicionar, editar e deletar faltas por data e observação
- Barra de progresso de faltas por matéria (visual e numérica)
- Relatório geral com resumo de todas as matérias, matérias em risco e totais
- Interface moderna, responsiva e intuitiva (React + TailwindCSS)

## Como executar o projeto

### 1. Backend (API)

1. Acesse a pasta `backend`:
   ```bash
   cd backend
   ```
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Configure o arquivo `.env` (baseie-se no `.env.example`):
   - `MONGODB_URI`: string de conexão do MongoDB Atlas
   - `JWT_SECRET`: uma chave secreta para autenticação JWT
   - `PORT`: porta do servidor (padrão: 5000)
4. Inicie o backend:
   ```bash
   npm start
   ```

### 2. Frontend (Web)

1. Acesse a pasta `frontend`:
   ```bash
   cd frontend
   ```
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Inicie o frontend:
   ```bash
   npm start
   ```
4. Acesse o sistema em [http://localhost:3000](http://localhost:3000)

## Observações
- O backend deve estar rodando em `http://localhost:5000` para o frontend funcionar corretamente.
- O banco de dados utilizado é o MongoDB Atlas (nuvem, gratuito).
- O sistema é totalmente responsivo e pode ser usado no computador ou celular.

---

Desenvolvido com ❤️ para facilitar sua vida acadêmica! 
=======
# Controle-de-Faltas
>>>>>>> 0756b9eeef30cf2e6283d27e7c929eda255ebe72
