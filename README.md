# Sortearine MVP (estatico)

MVP de roleta para sorteio, 100% estatico, pronto para GitHub Pages:

- importacao de nomes por texto, CSV ou TXT
- sorteio justo no navegador com `crypto.getRandomValues`
- animacao da roleta no frontend

## Estrutura

- `frontend`: HTML, CSS e JavaScript puro (site estatico)
- `backend`: opcional para evolucao futura (nao necessario nesta versao)

## Como rodar localmente

Abra `frontend/index.html` no navegador.

Se preferir um servidor local:

```bash
cd frontend
npx serve .
```

## Deploy no GitHub Pages

### Opcao simples (publicar pasta `frontend`)

1. Suba o projeto para um repositorio no GitHub.
2. Em `Settings > Pages`, escolha:
   - `Source`: `Deploy from a branch`
   - `Branch`: `main` (ou `master`)
   - `Folder`: `/frontend`
3. Salve e aguarde o link do Pages ser gerado.

### Opcao alternativa (raiz do repositorio)

Se preferir publicar pela raiz, mova os arquivos de `frontend` para a raiz do repositorio e selecione `/ (root)` no Pages.

## Proximo passo para WhatsApp

Para integrar captura automatica via WhatsApp oficial, voce pode evoluir para WhatsApp Business Cloud API com webhook no backend. Para um fluxo gratis e simples, compartilhe no WhatsApp um link de inscricao e use os nomes coletados na roleta.
