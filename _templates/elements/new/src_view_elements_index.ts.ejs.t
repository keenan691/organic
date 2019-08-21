---
inject: true
to: src/elements/index.ts
after: export
---
  <%= h.changeCase.pascal(name) %>,