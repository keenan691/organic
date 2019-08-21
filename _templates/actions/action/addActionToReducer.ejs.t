---
inject: true
to: src/<%= moduleKind %>/<%= moduleName %>/reducers.ts
after: const reducer = createReducer
---
  .handleAction(actions.<%= name %>, state => state)