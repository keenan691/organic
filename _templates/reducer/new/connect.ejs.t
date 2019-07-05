---
inject: true
after: initialState,
to: src/<%= moduleKind %>/<%= moduleName %>/reducers/index.ts
---
  <%= h.changeCase.snake(name) %>Reducer,