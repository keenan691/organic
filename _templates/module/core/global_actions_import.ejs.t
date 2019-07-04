---
inject: true
before: !!js/regexp /\nexport default/g
to: src/store/actions.ts
---
import { <%= name %>Actions } from 'core/<%= name %>'