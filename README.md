💰 Finance Tracker
Aplicação fullstack de controle financeiro pessoal — visualize receitas, despesas e saldo mensal com gráficos e categorias customizadas.
🔗 Demo: finance-tracker-kohl-xi-68.vercel.app
📖 API Docs: Swagger UI
---
🛠 Stack
Frontend
Next.js 16 + TypeScript
Tailwind CSS v4 + Shadcn/ui
TanStack Query (React Query) — cache e sincronização de dados
Zustand — gerenciamento de estado global
React Hook Form + Zod — formulários e validação
Recharts — gráficos
Backend
Java 21 + Spring Boot 3.5
Spring Security + JWT — autenticação stateless
Spring Data JPA + Hibernate — ORM
PostgreSQL (produção) / H2 (desenvolvimento)
Swagger/OpenAPI — documentação da API
Infra & DevOps
Vercel — deploy do frontend
Railway — deploy do backend + PostgreSQL
GitHub Actions — CI com testes automáticos
---
✨ Funcionalidades
✅ Autenticação com JWT (registro e login)
✅ Dashboard com resumo financeiro mensal
✅ Gráfico de gastos por categoria (donut chart)
✅ CRUD de transações (receitas e despesas)
✅ CRUD de categorias
✅ Filtro por mês
✅ Layout responsivo com menu mobile
✅ Proteção de rotas com middleware
---
🧪 Testes
37 testes cobrindo as principais camadas da aplicação.
Frontend (Vitest + Testing Library)
```bash
cd frontend
npm run test:run
```
Arquivo	Testes
`auth-store.test.ts`	6
`use-transactions.test.ts`	4
`use-summary.test.ts`	2
`use-categories.test.ts`	2
`login.test.tsx`	5
`register.test.tsx`	5
Backend (JUnit 5 + Mockito)
```bash
cd backend
./mvnw test
```
Arquivo	Testes
`AuthServiceTest`	3
`TransactionServiceTest`	5
`AuthControllerTest`	4
`ApiApplicationTests`	1
---
🚀 Rodando localmente
Pré-requisitos
Java 21
Node.js 20+
Maven (ou use o `mvnw` incluído)
Backend
```bash
cd backend
./mvnw spring-boot:run
```
Acesse em `http://localhost:8080`
Swagger UI: `http://localhost:8080/swagger-ui/index.html`
H2 Console: `http://localhost:8080/h2-console` (JDBC URL: `jdbc:h2:mem:financedb`)
Frontend
```bash
cd frontend
npm install
npm run dev
```
Acesse em `http://localhost:3000`
Variáveis de ambiente (frontend)
Cria um arquivo `.env.local` em `frontend/`:
```env
NEXT_PUBLIC_API_URL=http://localhost:8080
```
---
📁 Estrutura do projeto
```
finance-tracker/
├── backend/                  # Spring Boot API
│   └── src/main/java/
│       └── com/financetracker/api/
│           ├── config/       # SecurityConfig, CorsConfig, SwaggerConfig
│           ├── controller/   # AuthController, TransactionController...
│           ├── dto/          # Request/Response DTOs
│           ├── model/        # Entidades JPA
│           ├── repository/   # Spring Data repositories
│           ├── security/     # JwtAuthFilter, JwtService
│           └── service/      # AuthService, TransactionService
├── frontend/                 # Next.js App
│   └── src/
│       ├── app/              # Rotas (login, register, dashboard)
│       ├── components/       # Componentes UI (Shadcn)
│       ├── hooks/            # React Query hooks
│       ├── lib/              # api.ts (fetch wrapper)
│       └── store/            # Zustand auth store
└── .github/workflows/        # CI/CD GitHub Actions
```
---
📡 Endpoints da API
Método	Endpoint	Descrição	Auth
POST	`/api/auth/register`	Registro	❌
POST	`/api/auth/login`	Login	❌
GET	`/api/categories`	Listar categorias	✅
POST	`/api/categories`	Criar categoria	✅
DELETE	`/api/categories/{id}`	Deletar categoria	✅
GET	`/api/transactions`	Listar transações	✅
POST	`/api/transactions`	Criar transação	✅
PUT	`/api/transactions/{id}`	Atualizar transação	✅
DELETE	`/api/transactions/{id}`	Deletar transação	✅
GET	`/api/summary?month=yyyy-MM`	Resumo mensal	✅
---
👩‍💻 Autora
Bruna Szarin — Desenvolvedora Fullstack
![GitHub](https://img.shields.io/badge/GitHub-brunaszarin-181717?style=flat&logo=github)