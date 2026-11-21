# Jus Digital — Front-end Web (Desafio Técnico FullStack)

Aplicação web desenvolvida em **React 18 + TypeScript + Vite + Tailwind CSS**, projetada com fidelidade **pixel a pixel** ao protótipo do Figma da Jus Digital, responsividade para qualquer tamanho de tela e integração completa com **Google OAuth 2.0**, **AWS S3** e **OpenAI (`gpt-4o-mini`)** através da API Back-end.

---

## Sumário
1. [Fidelidade ao Protótipo e Design System](#1-fidelidade-ao-protótipo-e-design-system)
2. [Arquitetura e Princípios SOLID no Front-end](#2-arquitetura-e-princípios-solid-no-front-end)
3. [Diferenciais de Experiência (UX)](#3-diferenciais-de-experiência-ux)
4. [Variáveis de Ambiente](#4-variáveis-de-ambiente)
5. [Como Rodar o Projeto](#5-como-rodar-o-projeto)
6. [Testes Automatizados (Vitest)](#6-testes-automatizados-vitest)

---

## 1. Fidelidade ao Protótipo e Design System

Todas as telas foram construídas seguindo rigorosamente os espaçamentos, cores, tipografia (`Inter`) e estados interativos do protótipo:

- **Sidebar (`#2E9E5B`)**:
  - Topo com cabeçalho do escritório (**"Escritório / Advogados associados"**).
  - Item de navegação ativo **"Documentos"**.
  - Rodapé preenchido automaticamente com **Foto, Nome e E-mail** vindos da conta **Google OAuth** do usuário autenticado, além de botão para encerrar sessão.
  - Em telas menores (tablets e smartphones), converte-se automaticamente em um menu lateral retrátil (*drawer*).
- **Tela de Documentos — Estado Vazio**:
  - Container principal com borda `#E5E7EB`, botão `+ Adicionar documento` (`#2E9E5B`) e área tracejada central com ícone de busca/lista e instruções claras.
- **Grid de Documentos e Seleção**:
  - Cards exibindo ícone de documento com badge da extensão (`DOC`, `PDF`, `JPG`, etc.), título, data (`DD/MM/YYYY`) e tamanho + formato (`34 KB · .doc`).
  - Seleção individual ou múltipla com checkbox azul (`#1D9BF0`) no canto superior esquerdo e fundo azul claro (`#EBF5FF`).
  - Contador dinâmico de documentos selecionados (`1 documento selecionado` / `N documentos selecionados`).
  - **Menu Flutuante de Ações**:
    - Com **1 documento selecionado**: exibe `Excluir documentos` (ícone vermelho) e `Visualizar analise` (ícone verde).
    - Com **2 ou mais documentos selecionados**: exibe `Excluir documentos` para exclusão em lote.
- **Modal `Prévia do Documento` (Upload e Visualização da Análise)**:
  - **Modo Upload**: Miniatura do documento com tamanho e extensão (`34 KB · .pdf`), campo editável `Título` (pré-preenchido com o nome do arquivo), campo `Instrução para IA` e botão `Salvar`.
  - **Modo Visualização**: Miniatura com link para abrir o arquivo original salvo no S3, `Título` e caixa `Analise da IA` com a resposta gerada pelo `gpt-4o-mini`.

---

## 2. Arquitetura e Princípios SOLID no Front-end

- **Single Responsibility (SRP)**:
  - Componentes visuais puros e focados (`Sidebar`, `EmptyDocumentsState`, `DocumentCard`, `SelectionActionMenu`, `DocumentUploadModal`, `DocumentAnalysisModal`, `ConfirmDeleteModal`).
  - Lógica de estado e comunicação com a API isolada no custom hook `useDocuments` e no contexto `AuthContext`.
  - Camada de rede desacoplada em `src/services/` (`api-client.ts`, `auth.api.ts`, `documents.api.ts`).
- **Interface Segregation & Strict Typing**:
  - Contratos TypeScript explícitos (`DocumentItem`, `CreateDocumentPayload`, `UserProfile`) sem nenhum uso de `any`.

---

## 3. Diferenciais de Experiência (UX)

- **Arrastar e Soltar (Drag and Drop)**: Arraste arquivos diretamente para a área tracejada (ou para o grid) para abrir instantaneamente a prévia de envio.
- **Loading Claro na Análise**: Indicador visual animado enquanto o arquivo é salvo na AWS S3 e analisado pelo `gpt-4o-mini`.
- **Feedbacks (Toasts)**: Avisos claros de sucesso e erro no login, upload, análise da IA e exclusão.
- **Exclusão Segura**: Modal de confirmação antes de remover 1 ou múltiplos documentos selecionados.
- **Tratamento de Erros da IA com Retry**: Caso ocorra timeout ou limite de uso na OpenAI, o usuário pode clicar em **"Tentar novamente"** direto no modal do documento sem precisar reenviar o arquivo.

---

## 4. Variáveis de Ambiente

Copie o arquivo `.env.example` para `.env`:

```bash
cp .env.example .env
```

```env
VITE_API_URL="http://localhost:3000/api"
VITE_GOOGLE_CLIENT_ID="seu-google-client-id.apps.googleusercontent.com"
```

> **Nota**: Nenhuma chave secreta ou token da OpenAI/AWS fica no front-end. Todas as credenciais sensíveis residem apenas no repositório Back-end.

---

## 5. Como Rodar o Projeto

### Localmente com Node.js
```bash
# 1. Instale as dependências
npm install

# 2. Inicie o servidor de desenvolvimento (http://localhost:5173)
npm run dev
```

### Via Docker Compose
```bash
docker compose up -d --build
```

---

## 6. Testes Automatizados (Vitest)

A suíte de testes valida a renderização da sidebar com dados do Google, estado vazio, listagem de documentos, seleção única e múltipla, abertura da análise da IA e fluxo de upload:

```bash
npm run test
```

---

## 7. Deploy na Vercel

1. Importe o repositório `analise-docs-front` na [Vercel](https://vercel.com/).
2. Configure as **Environment Variables** no painel da Vercel:
   - `VITE_API_URL`: `https://<IP_EC2>.sslip.io/api` (ex: `https://3.143.230.43.sslip.io/api`)
   - `VITE_GOOGLE_CLIENT_ID`: mesmo Client ID público configurado no Back-end.
3. O arquivo `vercel.json` já garante o rewrite de rotas SPA (`/app/documentos`, `/login`) sem erro 404.
4. No **Google Cloud Console**, adicione a URL final gerada pela Vercel em **Origens JavaScript autorizadas** do Client ID OAuth.

"# analise-docs-front" 
