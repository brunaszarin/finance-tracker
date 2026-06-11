<div align="center">

# Finance Tracker

**Aplicação fullstack de controle financeiro pessoal**

[![Next.js](https://img.shields.io/badge/Next.js_16-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![Spring Boot](https://img.shields.io/badge/Spring_Boot_3.5-6DB33F?style=for-the-badge&logo=springboot&logoColor=white)](https://spring.io/projects/spring-boot)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Java](https://img.shields.io/badge/Java_21-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)](https://openjdk.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)

[![CI Backend](https://github.com/brunaszarin/finance-tracker/actions/workflows/ci-backend.yml/badge.svg)](https://github.com/brunaszarin/finance-tracker/actions)
[![CI Frontend](https://github.com/brunaszarin/finance-tracker/actions/workflows/ci-frontend.yml/badge.svg)](https://github.com/brunaszarin/finance-tracker/actions)

[**🚀 Ver Demo**](https://finance-tracker-kohl-xi-68.vercel.app) · [**📖 API Docs**](https://finance-tracker-production-2d7c.up.railway.app/swagger-ui/index.html)

</div>

---

<!-- Adicionar screenshot do dashboard aqui -->
<!-- ![Dashboard](./docs/dashboard.png) -->

---

## 📋 Sobre o projeto

Finance Tracker é uma aplicação fullstack para controle de finanças pessoais. O usuário pode registrar receitas e despesas por categoria, visualizar o resumo mensal com gráficos e acompanhar o histórico de transações.

O projeto foi desenvolvido como portfólio técnico, com foco em boas práticas de desenvolvimento, testes automatizados e deploy em produção.

---

## 🖥️ Screenshots

<!-- Adicionar screenshots das páginas aqui -->
<!-- ![Login](./docs/login.png) -->
<!-- ![Transactions](./docs/transactions.png) -->
<!-- ![Categories](./docs/categories.png) -->

---

## 🛠️ Stack

<table>
  <tr>
    <td valign="top" width="50%">

### Frontend
| Tecnologia | Uso |
|------------|-----|
| Next.js 16 + TypeScript | Framework principal |
| Tailwind CSS v4 + Shadcn/ui | Estilização e componentes |
| TanStack Query | Cache e sincronização de dados |
| Zustand | Gerenciamento de estado global |
| React Hook Form + Zod | Formulários e validação |
| Recharts | Gráficos interativos |
| Vitest + Testing Library | Testes unitários |

  </td>
  <td valign="top" width="50%">

### Backend
| Tecnologia | Uso |
|------------|-----|
| Java 21 + Spring Boot 3.5 | Framework principal |
| Spring Security + JWT | Autenticação stateless |
| Spring Data JPA + Hibernate | ORM e persistência |
| PostgreSQL | Banco em produção |
| H2 | Banco em desenvolvimento |
| Swagger / OpenAPI | Documentação da API |
| JUnit 5 + Mockito | Testes unitários |

  </td>
  </tr>
</table>

### Infra & DevOps
| Serviço | Uso |
|---------|-----|
| Vercel | Deploy do frontend |
| Railway | Deploy do backend + PostgreSQL |
| GitHub Actions | CI/CD com testes automáticos |

---

## ✨ Funcionalidades

- 🔐 **Autenticação** — Registro e login com JWT
- 📊 **Dashboard** — Resumo financeiro mensal com cards e gráfico donut
- 💸 **Transações** — Criar, visualizar e deletar receitas e despesas
- 🏷️ **Categorias** — Gerenciar categorias customizadas por tipo
- 📅 **Filtro por mês** — Navegar entre meses no dashboard e nas transações
- 📱 **Responsivo** — Layout adaptado para mobile com menu hamburguer
- 🛡️ **Rotas protegidas** — Middleware de autenticação no frontend

---

## 🧪 Testes

**37 testes** cobrindo as principais camadas da aplicação.

### Frontend — Vitest + Testing Library

```bash
cd frontend
npm run test:run
```

| Arquivo | Testes | Cobertura |
|---------|--------|-----------|
| `auth-store.test.ts` | 6 | Store de autenticação |
| `use-transactions.test.ts` | 4 | Hook de transações |
| `use-summary.test.ts` | 2 | Hook de resumo mensal |
| `use-categories.test.ts` | 2 | Hook de categorias |
| `login.test.tsx` | 5 | Página de login |
| `register.test.tsx` | 5 | Página de registro |

### Backend — JUnit 5 + Mockito

```bash
cd backend
./mvnw test
```

| Arquivo | Testes | Cobertura |
|---------|--------|-----------|
| `AuthServiceTest` | 3 | Serviço de autenticação |
| `TransactionServiceTest` | 5 | Serviço de transações |
| `AuthControllerTest` | 4 | Endpoints de autenticação |
| `ApiApplicationTests` | 1 | Contexto da aplicação |

---

## 🚀 Rodando localmente

### Pré-requisitos

- Java 21+
- Node.js 20+
- Maven (ou use o `./mvnw` incluído no projeto)

### 1. Clone o repositório

```bash
git clone https://github.com/brunaszarin/finance-tracker.git
cd finance-tracker
```

### 2. Backend

```bash
cd backend
./mvnw spring-boot:run
```

O servidor sobe em `http://localhost:8080`

| Recurso | URL |
|---------|-----|
| API | `http://localhost:8080` |
| Swagger UI | `http://localhost:8080/swagger-ui/index.html` |
| H2 Console | `http://localhost:8080/h2-console` |

> JDBC URL do H2: `jdbc:h2:mem:financedb` — usuário: `sa` — senha: *(vazio)*

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

A aplicação sobe em `http://localhost:3000`

Cria o arquivo `frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8080
```

---

## 📁 Estrutura do projeto

```
finance-tracker/
├── .github/
│   └── workflows/
│       ├── ci-backend.yml       # CI do backend
│       └── ci-frontend.yml      # CI do frontend
├── backend/
│   └── src/
│       ├── main/java/com/financetracker/api/
│       │   ├── config/          # SecurityConfig, CorsConfig, SwaggerConfig
│       │   ├── controller/      # AuthController, TransactionController...
│       │   ├── dto/             # Request/Response DTOs
│       │   ├── model/           # Entidades JPA
│       │   ├── repository/      # Spring Data repositories
│       │   ├── security/        # JwtAuthFilter, JwtService
│       │   └── service/         # AuthService, TransactionService
│       └── test/                # Testes unitários e de integração
└── frontend/
    └── src/
        ├── app/                 # Rotas Next.js (login, register, dashboard)
        ├── components/          # Componentes UI (Shadcn/ui)
        ├── hooks/               # React Query hooks customizados
        ├── lib/                 # api.ts — fetch wrapper com JWT
        ├── middleware.ts        # Proteção de rotas
        └── store/               # Zustand auth store
```

---

## 📡 Endpoints da API

| Método | Endpoint | Descrição | Auth |
|--------|----------|-----------|:----:|
| `POST` | `/api/auth/register` | Registrar usuário | ❌ |
| `POST` | `/api/auth/login` | Autenticar usuário | ❌ |
| `GET` | `/api/categories` | Listar categorias | ✅ |
| `POST` | `/api/categories` | Criar categoria | ✅ |
| `DELETE` | `/api/categories/{id}` | Deletar categoria | ✅ |
| `GET` | `/api/transactions` | Listar transações | ✅ |
| `POST` | `/api/transactions` | Criar transação | ✅ |
| `PUT` | `/api/transactions/{id}` | Atualizar transação | ✅ |
| `DELETE` | `/api/transactions/{id}` | Deletar transação | ✅ |
| `GET` | `/api/summary?month=yyyy-MM` | Resumo mensal | ✅ |

> Documentação completa disponível no [Swagger UI](https://finance-tracker-production-2d7c.up.railway.app/swagger-ui/index.html)

---

## 👩‍💻 Autora

<div align="center">

**Bruna Szarin**

Desenvolvedora Fullstack

[![GitHub](https://img.shields.io/badge/GitHub-brunaszarin-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/brunaszarin)

</div>
