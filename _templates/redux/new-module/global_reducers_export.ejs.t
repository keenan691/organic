---
inject: true
after: export default
to: src/store/reducers.ts
---
  [<%= h.changeCase.constant(name) %>_SLICE_NAME]: <%= name %>Reducers,