---
inject: true
after: export default
to: src/<%= moduleKind %>/<%= moduleName %>/actions.ts
---
<% actionName = name.split('-')[0] -%>
  <%= actionName %>,