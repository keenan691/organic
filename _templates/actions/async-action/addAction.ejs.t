---
inject: true
to: src/<%= moduleKind %>/<%= moduleName %>/actions.ts
before: !!js/regexp /\nexport default/g
---
<% constName = h.changeCase.constant(name) -%>
const <%= name %> = asyncAction(
  '<%= moduleName %>/<%= constName %>_REQUEST',
  '<%= moduleName %>/<%= constName %>_SUCCESS',
  '<%= moduleName %>/<%= constName %>_FAILURE',
  '<%= moduleName %>/<%= constName %>_CANCEL'
)<string, any[], Error, string>();