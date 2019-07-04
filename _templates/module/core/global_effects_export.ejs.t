---
inject: true
after: export default
to: src/store/effects.ts
---
  yield all([...<%= name %>Effects])