# comandei-platform

API back-end + SPA para controle de comandas em estabelecimentos alimentícios.

Resumo rápido
- Propósito: gerenciar mesas, comandas, itens, produtos e usuários/atendentes. Suporta operações CRUD, adicionar/remover itens e fechar comandas.
- Estrutura: back-end Java (Spring Boot) + front-end React (Vite + TypeScript).

Tecnologias principais
- Back-end: Java 17, Spring Boot 3.5.x, Spring Data JPA (Hibernate), Spring Security, Flyway, JJWT (JWT), Bean Validation.
- Banco de dados: PostgreSQL (driver no pom).
- Front-end: React 19, TypeScript, Vite.
- Build / gerência: Maven (back-end), npm (front-end).
- Testes: spring-boot-starter-test, spring-security-test, JUnit.

Estrutura do projeto
- /api — serviço Spring Boot (código Java, JPA entities em src/main/models). Ex.: User entity em:
  /home/lofs/Projetos/apps-academicos/comandei-platform/api/src/main/models/User.java
- /web — SPA React (package.json com scripts dev/build/preview)
- pom.xml — dependências e configuração do back-end

Pré-requisitos
- JDK 17+
- Node 18+ / npm
- PostgreSQL (ou outra base compatível)
- Maven (ou usar wrapper ./mvnw)

Configuração (exemplo)
- Variáveis típicas (export no shell ou .env local):
  - SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/comandei
  - SPRING_DATASOURCE_USERNAME=postgres
  - SPRING_DATASOURCE_PASSWORD=postgres
  - SPRING_JPA_HIBERNATE_DDL_AUTO=validate
  - APP_JWT_SECRET=uma_chave_secreta_aqui
- Flyway: as migrações são executadas automaticamente ao iniciar a aplicação (se configurado).

Como rodar (Linux)
1. Banco de dados
- Criar banco Postgres:
  sudo -u postgres createdb comandei
  export SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/comandei
  export SPRING_DATASOURCE_USERNAME=postgres
  export SPRING_DATASOURCE_PASSWORD=postgres

2. Back-end
- Entrar na pasta api:
  cd api
- Usar wrapper Maven (se existir) ou mvn:
  ./mvnw spring-boot:run
  ou
  mvn spring-boot:run

3. Front-end
- Entrar na pasta web:
  cd web
- Instalar e rodar:
  npm install
  npm run dev
- Build de produção:
  npm run build

Comandos úteis
- Testes back-end:
  cd api && ./mvnw test
- Lint front-end:
  cd web && npm run lint

Exemplos de chamadas (genéricas)
- Criar usuário (se endpoint existir):
  curl -X POST http://localhost:8080/api/users -H "Content-Type: application/json" -d '{"name":"Ana","email":"a@a.com","password":"senha"}'
- Criar comanda / adicionar item:
  curl -X POST http://localhost:8080/api/comandas -d '{...}'
  curl -X POST http://localhost:8080/api/comandas/{id}/items -d '{ "productId": 1, "quantity": 2 }'
- Consultar comanda:
  curl http://localhost:8080/api/comandas/{id}

Observações de segurança e operações
- Autenticação/autorizações: Spring Security + JWT (JJWT) — token em Authorization: Bearer <token>.
- Senhas devem ser armazenadas em hash — ver camada de segurança do projeto.
- Migrações de schema gerenciadas por Flyway.

Onde olhar no código
- Entidades JPA: api/src/main/models
- Repositories: api/src/main/repositories
- Services (regras de negócio): api/src/main/services
- Controllers (endpoints REST): api/src/main/controllers
- Front-end: web/src

Contribuição
- Abrir issues ou pull requests com mudanças pequenas.
- Executar testes localmente antes de submeter PRs.

Licença
- Repositório sem licença explícita.
