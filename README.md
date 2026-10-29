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

## Banco de dados e ambiente

- Docker

- Docker Compose

## Estrutura do projeto

- `backend/`: API, rotas, validações, autenticação e acesso ao banco de dados.
- `frontend/`: interface web, páginas e componentes React.

## Objetivos e aprendizados

O projeto foi desenvolvido para praticar conceitos de desenvolvimento web, operações CRUD, criação de APIs REST, autenticação, integração entre frontend e backend, acesso a banco de dados relacional e regras de negócio para controle de estoque.

## Status

Projeto de portfólio com funcionalidades principais implementadas.

## Demonstração

### Login
![Tela de login](/Screenshots/login.png)

### Cadastro
![Tela de cadastro](/Screenshots/cadastro.png)

### Dashboard
![Dashboard](/Screenshots/dashboard.png)

### Produtos
![Gerenciamento de produtos](/Screenshots/produtos.png)

### Vendas
![Gerenciamento de vendas](/Screenshots/vendas.png)

## Categorias
![Gerenciamento de categorias](/Screenshots/categorias.png)




## Como executar o projeto

### Pré-requisitos

- Git instalado.

- Node.js e npm instalados.

- Docker Desktop instalado e em execução

### 1. Clonar o repositório

```bash
git clone https://github.com/Danielss92/StockFlow.git
cd StockFlow
```

### 2. Configurar as variáveis de ambiente

Copie o conteudo do arquivo .env.example para dentro do arquivo  .env, na raiz do projeto, e confira as variáveis de conexão com o banco de dados.

Não publique o arquivo .env, pois ele pode conter credenciais.

### 3. Iniciar o banco de dados

Na raiz do projeto, execute:

```bash
docker compose up -d
```

Para verificar se o contêiner está em execução:

```bash
docker compose ps
```

### 4. Instalar as dependências

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

### 5. Aplicar as migrações do banco

No terminal do backend, execute:

```bash
npx prisma migrate deploy
```
Esse comando aplica ao banco configurado no Prisma as migrações existentes no projeto.

### 6. Iniciar a aplicação

No terminal do backend, dentro da pasta `backend`:

```bash
npx start
```

No terminal do frontend, dentro da pasta `frontend`:

```bash
npm run dev
```

Acesse o endereço local exibido pelo Vite no terminal.



