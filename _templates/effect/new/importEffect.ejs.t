---
inject: true
before: !!js/regexp /\n// prettier-ignore/g
to: src/<%= moduleKind %>/<%= moduleName %>/effects/index.ts
---
<% effectFile=name.split('-')[1] -%>
import <%= effectFile %> from './<%= effectFile %>'