# Local Development & Testing Guide

This guide explains how to run the AutoDiscovery application and its test suite against a fully local **midnight-local-dev** Docker stack, without requiring access to any public testnet.

---

## Prerequisites

| Tool | Minimum version |
|------|----------------|
| [Docker](https://docs.docker.com/get-docker/) | 20.10+ (with Compose v2) |
| Node.js | 18+ |
| npm | 10+ |

---

## Quick Start

### 1. Copy the environment template

```bash
cp .env.local.template .env.local
# Edit .env.local and fill in MY_PREVIEW_MNEMONIC / MY_UNDEPLOYED_UNSHIELDED_ADDRESS
```

### 2. Start the local stack and wait for it to be healthy

```bash
npm run dev:local
```

This command:
1. Starts the three Docker services defined in `autodiscovery-cli/standalone.yml` (proof-server, indexer, node).
2. Polls each service health endpoint until all are ready (default timeout: 120 s).

### 3. Run the full local test suite (and tear down afterwards)

```bash
npm run test:local:teardown
```

This is the single command recommended for CI dry-runs. It:
1. Brings the stack up (`dev:local`)
2. Runs `autodiscovery-cli`'s undeployed test suite
3. Tears the stack down regardless of test outcome

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                         Host machine                                │
│                                                                     │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │              Docker network (standalone.yml)                  │  │
│  │                                                              │  │
│  │  ┌──────────────────┐   ┌──────────────┐   ┌─────────────┐  │  │
│  │  │  midnight-node   │   │   indexer-   │   │   proof-    │  │  │
│  │  │  :0.20.1         │──▶│  standalone  │   │   server    │  │  │
│  │  │  port 9944       │   │  :3.1.0      │   │  :7.0.0     │  │  │
│  │  │                  │   │  port 8088   │   │  port 6300  │  │  │
│  │  └──────────────────┘   └──────────────┘   └─────────────┘  │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                     │
│  ┌──────────────────┐   ┌────────────────────────────────────────┐ │
│  │  autodiscovery-  │   │  frontend-demoland-vite-react /         │ │
│  │  cli (tests)     │   │  frontend-realdeal (npm run dev)        │ │
│  └──────────────────┘   └────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────┘
```

All three Docker services are started by `npm run dev:local:up`.  
The CLI and frontend connect to them over `localhost` using the ports shown above.

---

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev:local:up` | Start the Docker stack in the background |
| `npm run dev:local:down` | Stop and remove all containers + volumes |
| `npm run dev:local:wait` | Poll health endpoints until all services are ready |
| `npm run dev:local` | `up` + `wait` in sequence |
| `npm run test:local` | `dev:local` then run undeployed tests |
| `npm run test:local:teardown` | `test:local` then always run `dev:local:down` |

---

## Switching Between Environments

### Local (undeployed) mode

Use the variables from `.env.local.template` and point your app at `localhost` endpoints.

### Preview (testnet) mode

Use `MY_PREVIEW_MNEMONIC` with a funded preview wallet and update the endpoint variables to point at the Midnight preview network:

```env
MIDNIGHT_INDEXER=https://indexer.testnet-02.midnight.network/api/v3/graphql
MIDNIGHT_INDEXER_WS=wss://indexer.testnet-02.midnight.network/api/v3/graphql/ws
MIDNIGHT_NODE=wss://rpc.testnet-02.midnight.network
MIDNIGHT_PROOF_SERVER=https://proof.testnet-02.midnight.network
MIDNIGHT_NETWORK_ID=testnet-02
```

---

## Updating Docker Image Versions

All image tags are pinned in a single file: **`scripts/docker-versions.env`**

```env
PROOF_SERVER_IMAGE=midnightnetwork/proof-server:7.0.0
INDEXER_IMAGE=midnightntwrk/indexer-standalone:3.1.0
NODE_IMAGE=midnightntwrk/midnight-node:0.20.1
```

To upgrade, edit this file and commit the change. The `standalone.yml` Compose file reads these variables automatically via `--env-file ../scripts/docker-versions.env`.

---

## Troubleshooting

### Port already in use

If ports 6300, 8088, or 9944 are occupied by another process:

```bash
# find and kill the offending process (replace PORT with the actual port, e.g. 6300)
lsof -ti:PORT | xargs kill -9
```

Or change the host-side port mapping in `autodiscovery-cli/standalone.yml` and update the corresponding variables in your `.env.local`.

### Stack takes too long to become healthy

Increase the wait timeout:

```bash
bash scripts/wait-for-stack.sh --timeout 300
```

### Docker running out of memory

The proof server is memory-intensive. Ensure Docker has at least **8 GB** of RAM allocated (Docker Desktop → Settings → Resources).

### Proof server timeout during tests

Increase the proof server timeout in `autodiscovery-cli/vitest.config.ts` (it defaults to 45 minutes, which is usually sufficient).  
Also make sure the proof server container started successfully:

```bash
docker logs autodiscovery-proof-server
```

### Resetting the stack

To start completely fresh (purge all persisted chain data):

```bash
npm run dev:local:down   # removes volumes
npm run dev:local:up
```
