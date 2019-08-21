---
inject: true
to: src/screens/index.ts
after: export type Screens
---
  '<%= moduleKind %>/<%= h.changeCase.pascal(name) %>' |