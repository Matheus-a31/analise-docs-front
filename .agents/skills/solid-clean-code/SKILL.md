---
name: solid-clean-code
description: >-
  Enforces SOLID principles, Clean Code, strict TypeScript typing, and modular component architecture
  in the Frontend (React + TypeScript). Always activate and follow when writing, refactoring,
  or reviewing frontend code.
---

# SOLID & Clean Code Guidelines (Frontend — React & TypeScript)

1. **Single Responsibility Principle (SRP)**:
   - Separate UI presentation components (`DocumentCard`, `EmptyDocumentsState`, `DocumentUploadModal`, `DocumentAnalysisModal`, `SelectionActionMenu`, `Sidebar`) from data/state hooks (`useDocuments`, `useAuth`) and API services (`documents.api.ts`, `auth.api.ts`).
2. **Open/Closed (OCP) & Interface Segregation (ISP)**:
   - Components receive only the props they need through explicit TypeScript interfaces.
3. **Dependency Inversion (DIP)**:
   - UI components interact with custom hooks and typed service contracts rather than raw `fetch`/`axios` calls directly in JSX components.
4. **Clean Code**:
   - Strict TypeScript (no `any`), concise components, clear loading/error/success feedback states, and zero backend secrets in the frontend.
