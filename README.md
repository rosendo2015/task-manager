# 📌 Gerenciamento de Tarefas

Aplicação backend para gerenciamento de times e tarefas, desenvolvida com **Node.js**, **Express.js**, **PostgreSQL** e **Prisma**.  
O projeto inclui autenticação com **JWT**, validação com **Zod**, testes com **Jest** e deploy em **Render**.  

---

## 🚀 Tecnologias Utilizadas

- **Node.js** + **Express.js** – Framework backend  
- **PostgreSQL** – Banco de dados relacional  
- **Prisma** – ORM para manipulação de dados  
- **TypeScript** – Tipagem estática  
- **Zod** – Validação de dados  
- **JWT** – Autenticação e autorização  
- **Docker** – Containerização  
- **Jest** – Testes automatizados  
- **Render** – Deploy da aplicação  

---

## 🔑 Funcionalidades

### Autenticação e Autorização
- Criação de conta e login com JWT  
- Níveis de acesso:
  - **Administrador**: gerencia usuários, equipes e tarefas  
  - **Membro**: gerencia apenas suas tarefas  

### Gerenciamento de Times
- Apenas **admin** pode criar e editar times  
- Apenas **admin** pode adicionar ou remover membros  

### Tarefas
- CRUD completo de tarefas  
- Status: `Pendente`, `Em progresso`, `Concluído`  
- Prioridade: `Alta`, `Média`, `Baixa`  
- Atribuição de tarefas a membros específicos  
- Histórico de alterações de status  

---

## 🗄️ Estrutura do Banco de Dados

### Tabela `users`
| Campo       | Tipo                  | Descrição |
|-------------|-----------------------|-----------|
| id          | INTEGER (PK)          | Identificador único |
| name        | VARCHAR(100)          | Nome do usuário |
| email       | VARCHAR(150, único)   | E-mail |
| password    | VARCHAR(255)          | Senha criptografada |
| role        | ENUM('admin','member')| Nível de acesso |
| created_at  | TIMESTAMP             | Data de criação |
| updated_at  | TIMESTAMP             | Última atualização |

### Tabela `teams`
| Campo       | Tipo         | Descrição |
|-------------|--------------|-----------|
| id          | INTEGER (PK) | Identificador único |
| name        | VARCHAR(100) | Nome do time |
| description | TEXT         | Descrição opcional |
| created_at  | TIMESTAMP    | Data de criação |
| updated_at  | TIMESTAMP    | Última atualização |

### Tabela `team_members`
Relaciona usuários com times.  
- `user_id` → FK para `users.id`  
- `team_id` → FK para `teams.id`  

### Tabela `tasks`
| Campo       | Tipo         | Descrição |
|-------------|--------------|-----------|
| id          | INTEGER (PK) | Identificador único |
| title       | VARCHAR(200) | Título da tarefa |
| description | TEXT         | Descrição detalhada |
| status      | ENUM         | `pending`, `in_progress`, `completed` |
| priority    | ENUM         | `high`, `medium`, `low` |
| assigned_to | INTEGER (FK) | Usuário responsável |
| team_id     | INTEGER (FK) | Time da tarefa |
| created_at  | TIMESTAMP    | Data de criação |
| updated_at  | TIMESTAMP    | Última atualização |

### Tabela `tasks_history`
Armazena mudanças de status.  
- `task_id` → FK para `tasks.id`  
- `changed_by` → FK para `users.id`  

---

## ⚙️ Como Executar o Projeto

1. Clone o repositório:
```bash
git clone https://github.com/seu-usuario/seu-repositorio.git
cd seu-repositorio
```
2. Instale as dependências:
```bash
npm install
```
3. Configure o arquivo .env com:
```bash
DATABASE_URL="postgresql://user:password@localhost:5432/dbname"
JWT_SECRET="sua_chave_secreta"
```
4. Execute as migrações do Prisma:
```bash
npx prisma migrate dev
```

5 Inicie o servidor:
```    
npm run dev
```    


🧪 Testes

Rodar os testes com Jest:
```
npm run test
```


🚀 Deploy

O backend é deployado na plataforma Render.
Configurações de ambiente devem ser ajustadas diretamente no painel da Render.

📌 Próximos Passos

- Melhorar layout e adicionar frontend
- Criar dashboards para visualização de tarefas
- Implementar notificações em tempo real

💡 Considerações Finais

Este projeto foi desenvolvido como desafio para consolidar conhecimentos em Node.js, Express, Prisma e PostgreSQL.
A ideia é evoluir continuamente, adicionando novas funcionalidades e explorando boas práticas de desenvolvimento.

## :mailbox_closed: Contatos

> Email - rosendc30@gmail.com

> Linkedin - https://www.linkedin.com/in/francisco-rosendo-a05623241
