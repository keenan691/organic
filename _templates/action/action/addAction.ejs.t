---
inject: true
to: src/<%= moduleKind %>/<%= moduleName %>/actions.ts
before: !!js/regexp /\nexport default/g
---
const <%= name %> = action('<%= moduleName %>/<%= h.changeCase.constant(name) %>')()