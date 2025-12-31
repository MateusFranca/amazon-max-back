# Amazon Max API

Backend em NestJS para gestão de usuários, produtos, clientes, endereços e orçamentos, com autenticação JWT e documentação via Swagger.

---

## Tecnologias

| Categoria | Tecnologias |
|-----------|-------------|
| **Runtime** | Node.js 18+, TypeScript 5.3 |
| **Framework** | NestJS 10 |
| **Banco de Dados** | MySQL + Prisma ORM 6 |
| **Autenticação** | JWT, bcrypt |
| **Validação** | class-validator, class-transformer |
| **Documentação** | Swagger / OpenAPI |
| **Upload** | Multer, OCI Object Storage |
| **Testes** | Jest, Supertest |
| **Outros** | Nodemailer, Axios, Luxon |

---

## Requisitos

- Node.js 18 ou superior
- MySQL em execução
- NPM ou Yarn

---

## Instalacao e Configuracao

### 1. Instalar dependencias

```bash
npm install
```

### 2. Configurar variaveis de ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
DATABASE_URL="mysql://usuario:senha@localhost:3306/amazon_max"
JWT_SECRET="sua-chave-secreta-jwt"
ENVIRONMENT="desenvolvimento"
```

### 3. Executar migracoes

```bash
npm run migrate
```

### 4. Popular banco de dados (opcional)

```bash
npm run seed
```

### 5. Iniciar o servidor

```bash
# Desenvolvimento (com hot-reload)
npm run start:dev

# Producao
npm run build && npm run start:prod
```

---

## Endpoints

| Endpoint | Descricao |
|----------|-----------|
| `http://localhost:3007/api` | Documentacao Swagger |
| `http://localhost:3007/amazon/health` | Health check |
| `http://localhost:3007/uploads` | Arquivos estaticos |

### Rotas da API

| Prefixo | Modulo |
|---------|--------|
| `/auth` | Autenticacao |
| `/cme/usuario` | Usuarios |
| `/amazon/produtos` | Produtos |
| `/cme/clientes` | Clientes |
| `/amazon/orcamentos` | Orcamentos |
| `/cme/enderecos` | Enderecos |
| `/amazon/cidades` | Cidades |
| `/amazon/estados` | Estados |
| `/amazon/cep` | Consulta CEP |

---

## Estrutura do Projeto

```
src/
├── main.ts                 # Bootstrap da aplicacao
├── app.module.ts           # Modulo raiz
├── modules/
│   ├── autenticacao/       # Login e JWT
│   ├── usuario/            # CRUD de usuarios
│   ├── produto/            # Gestao de produtos
│   ├── cliente/            # Gestao de clientes
│   ├── endereco/           # Enderecos e CEP
│   ├── orcamento/          # Orcamentos
│   └── base/
│       ├── cidade/         # Cidades
│       └── estado/         # Estados
└── commons/
    ├── decorators/         # Decorators customizados
    ├── guards/             # AuthGuard, RoleGuard
    ├── middlewares/        # Validacoes de requisicao
    ├── validators/         # Validadores (CPF, etc)
    ├── prisma/             # Servico do Prisma
    └── utils/              # Utilitarios (storage, etc)

prisma/
├── schema.prisma           # Modelos do banco
├── migrations/             # Historico de migracoes
└── seed.ts                 # Script de seed
```

---

## Modelos de Dados

| Modelo | Descricao |
|--------|-----------|
| **Usuario** | Usuarios do sistema (admin, vendedor) |
| **Produto** | Catalogo de produtos com 4 faixas de preco |
| **Cliente** | Clientes com CPF/CNPJ |
| **Endereco** | Enderecos vinculados a cidades |
| **Estado** | Estados brasileiros |
| **Cidade** | Cidades brasileiras |
| **Orcamento** | Orcamentos de venda |
| **ProdutoOrcamento** | Itens do orcamento |

---

## Scripts Disponiveis

| Script | Descricao |
|--------|-----------|
| `npm run start` | Inicia em modo producao |
| `npm run start:dev` | Inicia em modo desenvolvimento |
| `npm run start:debug` | Inicia em modo debug |
| `npm run build` | Compila para `dist/` |
| `npm run lint` | Executa ESLint |
| `npm run test` | Executa testes unitarios |
| `npm run test:watch` | Testes em modo watch |
| `npm run test:cov` | Testes com cobertura |
| `npm run test:e2e` | Testes end-to-end |
| `npm run migrate` | Aplica migracoes Prisma |
| `npm run seed` | Popula banco com dados iniciais |

---

## Autenticacao

A API utiliza JWT para autenticacao. O token expira em 12 horas.

**Roles disponiveis:**
- `Administrador` - Acesso total
- `Vendedor` - Acesso restrito

**Exemplo de requisicao autenticada:**

```bash
curl -H "Authorization: Bearer <seu-token>" http://localhost:3007/amazon/produtos
```

---

## Configuracoes

| Variavel | Descricao |
|----------|-----------|
| `DATABASE_URL` | String de conexao MySQL |
| `JWT_SECRET` | Chave secreta para tokens JWT |
| `ENVIRONMENT` | `desenvolvimento` ou `servidor` |

**Porta padrao:** 3007

**CORS:** Configurado para origens confiáveis em `main.ts`

---

## Licenca

Projeto proprietario - Todos os direitos reservados.
