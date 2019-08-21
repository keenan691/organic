---
inject: true
to: src/<%= moduleKind %>/<%= moduleName %>/actions.ts
before: !!js/regexp /\nexport default/g
---
<% actionName = name.split('-')[0] -%>
<% payloadType = {
    undefined: 'any',
    s: 'string',
    b: 'boolean',
    a: 'any[]',
    n: 'number',
    o: 'object'
  }[name.split('-')[1]]
-%>
const <%= actionName %> = action('<%= moduleName %>/<%= h.changeCase.constant(actionName) %>')<<%= payloadType %>>()