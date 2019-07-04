---
inject: true
to: src/<%= moduleKind %>/<%= moduleName %>/reducers.ts
after: const reducer = createReducer
---
  .handleAction(actions.<%= name %>.request, state => state)
  .handleAction(actions.<%= name %>.cancel, state => state)
  .handleAction(actions.<%= name %>.failure, state => state)
  .handleAction(actions.<%= name %>.success, state => state)