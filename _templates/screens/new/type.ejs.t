---
inject: true
to: src/screens/index.ts
after: export type Screens
---
  '<%= moduleName %>/<%= h.changeCase.pascal(name) %>' |