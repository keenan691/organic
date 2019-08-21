---
inject: true
to: src/screens/index.ts
after: import
---
import <%= h.changeCase.pascal(name) %> from './<%= moduleName %>/<%= h.changeCase.pascal(name) %>'