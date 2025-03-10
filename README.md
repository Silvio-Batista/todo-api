# To-Do API - Gerenciamento de Tarefas

## 📌 Sobre o Projeto
Esta API RESTful permite a criação, leitura, atualização e exclusão de tarefas. Desenvolvida utilizando **NestJS** com **PostgreSQL**, a API segue boas práticas de Clean Code e conta com autenticação JWT, paginação e filtros.

## 🚀 Tecnologias Utilizadas
- **Node.js** + **NestJS**
- **TypeScript**
- **PostgreSQL** + **TypeORM**
- **Swagger** para documentação
- **Docker** para facilitar a instalação
- **JWT** para autenticação
- **Jest** para testes unitários

## 📂 Instalação e Execução

### 🔧 Pré-requisitos
- [Node.js](https://nodejs.org/en/) (v16+ recomendado)
- [Docker](https://www.docker.com/) (opcional, mas recomendado)

### 📥 Clonar o Repositório
```sh
 git clone https://github.com/Silvio-Batista/todo-api.git
 cd todo-api
```

### ⚙️ Instalar Dependências
```sh
 npm install
```

### 🛠️ Configurar Banco de Dados
Crie um arquivo `.env` e configure as variáveis:
```env
DATABASE_HOST=seu_host
DATABASE_PORT=sua_porta
DATABASE_USER=seu_user
DATABASE_PASSWORD=sua_senha
DATABASE_NAME=seu_banco
JWT_SECRET=seu_token

```

### 🏗️ Rodar Migrations
```sh
 npm run migration:run
```

### ▶️ Executar o Servidor
```sh
 npm run start
```
A API estará disponível em `http://localhost:3000`.

## 📜 Documentação Swagger
Acesse a documentação da API em:
```
http://localhost:3000/api
```

## 🔑 Autenticação
A API usa **JWT**. Para acessar endpoints protegidos:
1. **Crie um usuário:**
   ```sh
   POST /auth/register
   {
     "email": "usuario@email.com",
     "password": "senha123"
   }
   ```
2. **Faça login e obtenha um token:**
   ```sh
   POST /auth/login
   {
     "email": "usuario@email.com",
     "password": "senha123"
   }
   ```
   Resposta:
   ```json
   {
     "access_token": "TOKEN_GERADO"
   }
   ```
3. **Use o token no header:**
   ```sh
   Authorization: Bearer TOKEN_GERADO
   ```

## 📌 Endpoints Principais

### ✅ Criar Tarefa
```sh
POST /tasks
Authorization: Bearer TOKEN_GERADO
{
  "title": "Fazer compras",
  "description": "Ir ao mercado",
  "dueDate": "2025-03-15T10:00:00.000Z",
  "status": "pendente"
}
```

### 📋 Listar Tarefas (com filtros e paginação)
```sh
GET /tasks?status=pendente&page=1&limit=10
Authorization: Bearer TOKEN_GERADO
```

### ✏️ Atualizar Tarefa
```sh
PATCH /tasks/:id
Authorization: Bearer TOKEN_GERADO
{
  "status": "concluído"
}
```

### 🗑️ Deletar Tarefa
```sh
DELETE /tasks/:id
Authorization: Bearer TOKEN_GERADO
```

## 🧪 Testes
Para rodar os testes unitários:
```sh
npm run test
```

## 📦 Rodando com Docker
Para subir a API e o banco de dados com Docker:
```sh
docker-compose up -d
```

## 📜 Licença
Este projeto está sob a licença **MIT**.

---

🚀 **Desenvolvido por [Silvio Batista](https://github.com/Silvio-Batista)**