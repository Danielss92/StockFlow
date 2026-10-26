# StockFlow — Sistema de Gerenciamento de Estoque

Aplicação web de gerenciamento de estoque desenvolvida como projeto de portfólio, com foco na integração entre frontend e backend, gerenciamento de produtos e categorias e controle de vendas.

## Funcionalidades

- **Produtos:** cadastro, consulta, atualização e exclusão de produtos.
- **Categorias:** cadastro, consulta, atualização e exclusão de categorias.
- **Vendas:** registro e consulta de vendas.
- **Controle de estoque:** atualização automática das quantidades após vendas e reposição do estoque ao excluir uma venda.
- **Validações:** prevenção de vendas com estoque insuficiente e rejeição de dados inválidos.
- **Autenticação:** cadastro e login de usuários, com senhas protegidas por hash e rotas autenticadas.

## Tecnologias utilizadas

### Frontend
- React
- JavaScript
- Vite
- CSS
- React Router

### Backend
- Node.js
- Express
- Prisma ORM
- PostgreSQL
- JSON Web Tokens (JWT)
- bcrypt

## Estrutura do projeto

- `backend/`: API, rotas, validações, autenticação e acesso ao banco de dados.
- `frontend/`: interface web, páginas e componentes React.

## Objetivos e aprendizados

O projeto foi desenvolvido para praticar conceitos de desenvolvimento web, operações CRUD, criação de APIs REST, autenticação, integração entre frontend e backend, acesso a banco de dados relacional e regras de negócio para controle de estoque.

## Status

Projeto de portfólio em desenvolvimento.

## Demonstração

*Capturas de tela da aplicação serão adicionadas aqui.*

## Como executar o projeto

### Pré-requisitos

- Node.js e npm instalados.
- PostgreSQL instalado ou acesso a um banco PostgreSQL.
- Git instalado para clonar o repositório.

### 1. Clonar o repositório

```bash
git clone https://github.com/Danielss92/StockFlow.git
cd StockFlow
```

### 2. Configurar as variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto e configure a variável `DATABASE_URL` com a string de conexão do banco de dados PostgreSQL.

Não publique credenciais reais no repositório.

### 3. Instalar as dependências

No terminal do backend:

```bash
cd backend
npm install
```

Em outro terminal, partindo da pasta principal do projeto, instale as dependências do frontend:

```bash
cd frontend
npm install
```

### 4. Iniciar a aplicação

No terminal do backend, dentro da pasta `backend`:

```bash
npx tsx server.js
```

No terminal do frontend, dentro da pasta `frontend`:

```bash
npm run dev
```

Acesse o endereço local exibido pelo Vite no terminal.



