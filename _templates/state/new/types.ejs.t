---
inject: true
to: src/<%= moduleKind %>/<%= moduleName %>/types.ts
after: export type InitialState
---
<% fieldName = name.split('-')[0] -%>
<% fieldType = {
    undefined: 'any',
    s: 'string',
    b: 'boolean',
    a: 'any[]',
    n: 'number',
    o: 'object'
  }[name.split('-')[1]]
-%>
  <%= fieldName %>: <%= fieldType %>,