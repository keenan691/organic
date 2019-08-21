---
inject: true
before: !!js/regexp /\nexport/g
to: src/store/effects.ts
---
import { effects as <%= name %>Effects } from 'redux/<%= name %>'