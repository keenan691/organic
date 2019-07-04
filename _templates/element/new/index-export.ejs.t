---
inject: true
to: src/elements/index.ts
after: import
---
import <%= h.changeCase.pascal(name) %> from './<%= h.changeCase.param(name) %>'