---
inject: true
to: src/<%= moduleKind %>/<%= moduleName %>/reducers.ts
after: const reducer = createReducer
---
<% actionName = name.split('-')[0] -%>
  .handleAction(actions.<%= actionName %>, (state, { payload }) => state)