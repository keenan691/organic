---
inject: true
to: src/<%= moduleKind %>/<%= moduleName %>/selectors.ts
before: !!js/regexp /}\n*export default/g
---
  <%= name %>,