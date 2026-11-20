---
name: frontend-design-system
description: >-
  Enforces pixel-perfect fidelity to the Jus Digital Figma prototype (.insp/), color tokens,
  typography, responsive layout, smooth interactions, drag-and-drop, and loading/error UX states.
  Always activate and follow when creating or modifying frontend React components and pages.
---

# Jus Digital — Frontend Design System & UI/UX Guidelines

## 1. Visual Fidelity to Prototype (`.insp/`)

### Color Palette Tokens
- **Brand Primary Green** (Sidebar background, `+ Adicionar documento` button, `Salvar` button, `Visualizar analise` icon):
  - Default: `#2E9E5B` | Hover: `#26874D` | Active sidebar pill: `rgba(255, 255, 255, 0.18)`
- **Selection Accent Blue** (Selected document card & checkbox):
  - Checkbox checked fill: `#1D9BF0` | Selected card surface: `#EBF5FF`
- **Danger / Destructive Red** (`Excluir documentos` trash icon & confirm delete):
  - Accent: `#EF4444`
- **Surfaces & Borders**:
  - Main background: `#FFFFFF`
  - Outer card border: `1px solid #E5E7EB` (`rounded-xl`)
  - Empty dropzone border: `2px dashed #E5E7EB` (`rounded-xl`)
  - Card hover: `#F3F4F6`
  - Modal preview area: `#F9FAFB`
  - Form inputs & AI analysis read-only box: `#F3F4F6`

## 2. UX & Layout Rules
- **Sidebar**: `240px` fixed on desktop, collapsible drawer on mobile/tablet. Displays `Escritório / Advogados associados` at top, `Documentos` active pill, and Google profile (photo, name, email) at bottom.
- **Empty State**: Dashed dropzone supporting click and Drag-and-Drop file upload.
- **Grid & Selection Menu**: Blue checkbox at top-left of card (`#1D9BF0`), light blue selected card background (`#EBF5FF`), top counter pill (`1 documento selecionado`), and floating action menu (`Excluir documentos` for 1+ selected; `Visualizar analise` when 1 is selected).
- **Modals (`Prévia do Documento`)**: Upload mode with editable `Título`, `Instrução para IA`, and `Salvar` with AI loading state; View mode with `Título` and `Analise da IA` plus retry option on failure.
