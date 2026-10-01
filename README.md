# 🚀 Avaliação Experimental de WebSockets e Server-Sent Events em Arquiteturas de Microsserviços Reativos

[![NestJS](https://img.shields.io/badge/Framework-NestJS-red.svg)](https://nestjs.com/)
[![Docker](https://img.shields.io/badge/Containers-Docker-blue.svg)](https://www.docker.com/)
[![k6](https://img.shields.io/badge/Load_Testing-Grafana_k6-7d46bf.svg)](https://k6.io/)

Monografia de Trabalho de Conclusão de Curso (TCC) apresentada ao Curso de Ciência da Computação da **Universidade Federal do Maranhão (UFMA)**.

- **Autor:** Daniel Santos Monteiro
- **Orientador:** Prof. Dr. Mário Antonio Meireles Teixeira
- **Ano:** 2026

---

## 📌 Visão Geral

Este repositório contém o ecossistema de software, a infraestrutura distribuída e os scripts de teste utilizados na avaliação experimental dos protocolos **WebSockets** e **Server-Sent Events (SSE)** sob diferentes níveis de concorrência.

O objetivo central do trabalho foi analisar os *trade-offs* de desempenho, resiliência e estabilidade de ambos os protocolos no envio de notificações em massa em um ambiente baseado em microsserviços reativos.

A pesquisa utilizou um **Planejamento Fatorial Experimental $2^3$**, variando três fatores:

- Protocolo de comunicação;
- Carga de usuários simultâneos;
- Número de instâncias do serviço.

---

## 🏗️ Arquitetura do Sistema

O sistema foi projetado utilizando o paradigma de **Arquitetura Orientada a Eventos (EDA)** (*Event-Driven Architecture*).

A arquitetura utiliza uma API principal responsável pelo processamento das requisições, persistência dos dados e publicação de eventos. O **RabbitMQ** realiza a comunicação assíncrona com o microsserviço de notificações.

O microsserviço disponibiliza dois mecanismos distintos de entrega das notificações:

- **WebSockets**, utilizando Socket.IO e Redis Pub/Sub;
- **Server-Sent Events (SSE)**, utilizando um fluxo reativo baseado em RxJS.

```text
┌──────────────────────────────────────────────────────────────────────┐
│                        INJETOR DE CARGA (k6)                         │
└──────────────────────────────┬───────────────────────────────────────┘
                               │
                               │ Requisição HTTP
                               ▼
┌──────────────────────────────────────────────────────────────────────┐
│                         API PRINCIPAL                                │
│                            NestJS                                    │
└──────────────────────┬───────────────────────┬───────────────────────┘
                       │                       │
                       │ Persistência          │ Disparo assíncrono
                       ▼                       ▼
              ┌──────────────────┐    ┌──────────────────────┐
              │ PostgreSQL       │    │      RabbitMQ        │
              │ + Prisma ORM     │    │       Broker         │
              └──────────────────┘    └──────────┬───────────┘
                                                 │
                                                 │ Consumo da fila
                                                 ▼
                              ┌────────────────────────────────┐
                              │    MICROSSERVIÇO DE            │
                              │        NOTIFICAÇÕES             │
                              └───────────────┬────────────────┘
                                              │
                         ┌────────────────────┴────────────────────┐
                         │                                         │
                         ▼                                         ▼
              ┌──────────────────────┐              ┌──────────────────────┐
              │  Redis Adapter       │              │  Fluxo Reativo RxJS │
              │      Pub/Sub         │              │       (Stream)       │
              └──────────┬───────────┘              └──────────┬───────────┘
                         │                                     │
                         ▼                                     ▼
              ┌──────────────────────┐              ┌──────────────────────┐
              │   Gateway Socket.IO  │              │ Endpoint SSE         │
              │                      │              │ text/event-stream    │
              └──────────┬───────────┘              └──────────┬───────────┘
                         │                                     │
                         │ Full-Duplex                         │ Unidirecional
                         ▼                                     ▼
              ┌──────────────────────┐              ┌──────────────────────┐
              │  Clientes Virtuais   │              │  Clientes Virtuais   │
              │        (VUs)         │              │        (VUs)         │
              └──────────────────────┘              └──────────────────────┘
````

---

## 🛠️ Tecnologias Utilizadas

| Tecnologia               | Utilização                                        |
| ------------------------ | ------------------------------------------------- |
| **NestJS**               | Framework utilizado no backend                    |
| **Node.js / TypeScript** | Ambiente de execução e linguagem                  |
| **PostgreSQL**           | Banco de dados relacional                         |
| **Prisma ORM**           | Camada de acesso ao banco de dados                |
| **RabbitMQ**             | Mensageria e comunicação assíncrona               |
| **Redis Pub/Sub**        | Comunicação entre instâncias do serviço           |
| **Socket.IO**            | Implementação das conexões WebSocket              |
| **RxJS**                 | Implementação do fluxo reativo utilizado pelo SSE |
| **Nginx**                | Proxy reverso e balanceamento de carga            |
| **Grafana k6**           | Testes de carga e geração de usuários virtuais    |
| **Docker**               | Containerização dos serviços                      |
| **Docker Compose**       | Orquestração do ambiente                          |

---

## 🧪 Desenho Experimental ($2^3$)

O experimento foi estruturado utilizando uma matriz fatorial completa, resultando em **8 combinações experimentais**.

| Fator              | Nível Inferior (-) | Nível Superior (+)       |
| ------------------ | ------------------ | ------------------------ |
| **A — Protocolo**  | WebSockets         | Server-Sent Events (SSE) |
| **B — Carga**      | 100 VUs            | 1000 VUs                 |
| **C — Instâncias** | 1 instância        | 3 instâncias             |

### Combinações Experimentais

| Ensaio | Protocolo  |    Carga | Instâncias |
| -----: | ---------- | -------: | ---------: |
|      1 | WebSockets |  100 VUs |          1 |
|      2 | SSE        |  100 VUs |          1 |
|      3 | WebSockets | 1000 VUs |          1 |
|      4 | SSE        | 1000 VUs |          1 |
|      5 | WebSockets |  100 VUs |          3 |
|      6 | SSE        |  100 VUs |          3 |
|      7 | WebSockets | 1000 VUs |          3 |
|      8 | SSE        | 1000 VUs |          3 |

---

## 📊 Métricas Analisadas

### Latência de Entrega

Tempo decorrido entre o consumo da mensagem pelo microsserviço de notificações e a recepção da notificação pelo cliente.

A análise considera principalmente o **percentil 95 (p95)** da distribuição de latência.

### Taxa de Sucesso

Percentual de conexões e notificações concluídas com sucesso durante cada ensaio, considerando falhas e estouros de tempo limite.

---

## 📈 Principais Resultados

### WebSockets sob alta concorrência

No cenário de **1000 VUs**, o WebSockets apresentou uma redução significativa na taxa de sucesso, chegando a **7,10%** no cenário com uma instância.

Durante os testes, o principal gargalo identificado não esteve relacionado ao uso de CPU, mas ao limite de **descritores de arquivos (*File Descriptors*)** configurado no sistema operacional.

O esgotamento desse recurso provocou falhas nas conexões, incluindo erros `unexpected EOF`.

### Server-Sent Events sob alta concorrência

No cenário de **1000 VUs**, o SSE apresentou:

* **48,51% de sucesso** com 1 instância;
* **89,34% de sucesso** com 3 instâncias.

Os resultados demonstraram melhora significativa com a utilização de múltiplas instâncias do serviço.

### Escalabilidade Horizontal

A adição de instâncias apresentou comportamentos diferentes entre os protocolos.

No cenário WebSockets, o aumento do número de instâncias não eliminou o gargalo relacionado ao limite de descritores de arquivos do host.

No SSE, por outro lado, a distribuição das conexões entre múltiplas instâncias proporcionou uma melhora significativa na taxa de sucesso.

---

## 🚦 Como Executar o Projeto

### Pré-requisitos

Certifique-se de possuir os seguintes softwares instalados:

* [Docker](https://www.docker.com/)
* [Docker Compose](https://docs.docker.com/compose/)
* [Grafana k6](https://k6.io/docs/get-started/installation/)
* Node.js 18 ou superior (opcional para desenvolvimento local)
* Git

---

### 1. Clonar o Repositório

```bash
git clone https://github.com/dsmonteiro25/tcc-websockets-sse.git
cd tcc-websockets-sse
```

---

### 2. Subir a Infraestrutura

Inicie os containers da aplicação, banco de dados, RabbitMQ, Redis e Nginx:

```bash
docker compose up -d --build
```

Para verificar os containers em execução:

```bash
docker compose ps
```

---

### 3. Executar os Testes de Carga

Os testes são executados utilizando o **Grafana k6**.

Defina a URL do protocolo e o número de usuários virtuais desejados através das variáveis de ambiente.

#### Teste SSE — 1000 VUs

```bash
k6 run \
  -e PROTOCOL_URL="http://<IP_DO_HOST>:3000/notifications/stream" \
  -e TARGET_VUS=1000 \
  scripts/k6-load-test.js
```

#### Teste WebSockets — 1000 VUs

```bash
k6 run \
  -e PROTOCOL_URL="ws://<IP_DO_HOST>:3000" \
  -e TARGET_VUS=1000 \
  scripts/k6-load-test.js
```

Substitua `<IP_DO_HOST>` pelo endereço IP do host que executa a aplicação.

---

## 🐳 Gerenciamento dos Containers

### Visualizar os containers

```bash
docker compose ps
```

### Visualizar os logs

```bash
docker compose logs -f
```

Para visualizar os logs de um serviço específico:

```bash
docker compose logs -f notifications-api
```

### Parar a infraestrutura

```bash
docker compose down
```

### Reconstruir os containers

```bash
docker compose up -d --build
```

---

## 📁 Estrutura do Projeto

```text
tcc-websockets-sse/
│
├── scripts/
│   └── k6-load-test.js
│
├── notifications-api/
│   ├── src/
│   │   ├── notifications/
│   │   ├── gateway/
│   │   └── ...
│   ├── Dockerfile
│   └── package.json
│
├── docker-compose.yml
├── nginx.conf
├── README.md
└── ...
```

---

## 🔬 Reprodutibilidade

O ambiente experimental foi desenvolvido utilizando containers Docker para garantir maior padronização da infraestrutura utilizada nos ensaios.

A configuração permite reproduzir os cenários variando:

* Protocolo de comunicação;
* Número de usuários virtuais;
* Quantidade de instâncias;
* Configuração do balanceador;
* Recursos disponíveis no host.

Os scripts de teste utilizados nos experimentos estão disponíveis neste repositório.

---

## 📚 Referências

O projeto está relacionado ao Trabalho de Conclusão de Curso:

> **Avaliação Experimental de WebSockets e Server-Sent Events em Arquiteturas de Microsserviços Reativos**

**Curso:** Ciência da Computação
**Instituição:** Universidade Federal do Maranhão — UFMA
**Autor:** Daniel Santos Monteiro
**Orientador:** Prof. Dr. Mário Antonio Meireles Teixeira
**Ano:** 2026

---

## 📜 Direitos Autorais

Este trabalho acadêmico está protegido por direitos autorais.

O código-fonte disponibilizado neste repositório pode ser utilizado para fins de estudo e pesquisa, desde que a fonte original seja devidamente citada.

---

## ✉️ Contato

**Daniel Santos Monteiro**

* GitHub: [@dsmonteiro25](https://github.com/dsmonteiro25)
* Curso de Ciência da Computação — UFMA

---

```
