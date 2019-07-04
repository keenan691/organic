---
inject: true
to: src/<%= moduleKind %>/<%= moduleName %>/reducers.ts
after: const initialState
---
<% fieldName = name.split('-')[0] -%>
<% fieldType = name.split('-')[1] -%>
<% fieldValue = name.split('-')[2] || {
    undefined: 'null',
    s: '""',
    b: 'false',
    a: '[]',
    n: '0',
    o: '{}'
  }[fieldType]
-%>
  <%= fieldName %>: <%- fieldValue %>,