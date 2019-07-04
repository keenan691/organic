---
inject: true
before: !!js/regexp /\nexport default/g
to: src/store/reducers.ts
---
import { reducers as <%= name %>Reducers, REDUX_SLICE_NAME as <%= h.changeCase.constant(name) %>_SLICE_NAME } from 'core/<%= name %>'