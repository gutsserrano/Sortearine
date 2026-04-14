# Sortearine MVP (Vercel Ready)

Projeto de roleta de sorteio com:

- importacao de nomes por texto, CSV ou TXT
- frontend estatico em `public`
- API serverless em `api`
- sorteio justo usando `crypto.randomInt`

## Estrutura

- `public`: interface web (HTML, CSS, JS)
- `api`: funcoes serverless da Vercel
- `api/draw.js`: endpoint de sorteio
- `api/health.js`: endpoint de health check

## Executar com npm

Na raiz do projeto:

```bash
npm install
npm run dev
```

Isso sobe o projeto com `vercel dev`.

## Deploy na Vercel

1. Suba o repositorio no GitHub.
2. Importe o projeto na Vercel.
3. Deploy automatico (sem ajustes extras de build).

## Endpoints

- `GET /api/health`
- `POST /api/draw`

Body:

```json
{
  "participants": ["Ana", "Bruno", "Carla"]
}
```

Resposta:

```json
{
  "drawId": "uuid",
  "winner": "Bruno",
  "winnerIndex": 1,
  "participantsCount": 3,
  "generatedAt": "2026-01-01T00:00:00.000Z"
}
```

## Proximo passo para WhatsApp

Integrar WhatsApp Business Cloud API via webhook para preencher a lista de participantes automaticamente antes do sorteio.
