---
inject: true
after: import,
to: src/<%= moduleKind %>/<%= moduleName %>/reducers/index.ts
---
import <%= h.changeCase.snake(name) %>Reducer from './<%= name %>'