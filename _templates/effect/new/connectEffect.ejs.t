---
inject: true
after: export default
to: src/<%= moduleKind %>/<%= moduleName %>/effects/index.ts
---
<% effectName=name.split('-')[1] -%>
<% actionName=name.split('-')[0] -%>
  takeLatest(getType(actions.<%= actionName %>), <%= effectName %>),