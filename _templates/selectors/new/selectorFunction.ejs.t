---
inject: true
to: src/<%= moduleKind %>/<%= moduleName %>/selectors.ts
before: !!js/regexp /\nconst selectors/g
---
<% stateName = h.changeCase.camel(name.replace(/^(get|is)/, '')) -%>
const <%= name %> = (state: InitialState) => state.<%= stateName %>