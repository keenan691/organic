---
inject: true
to: storybook/stories/index.tsx
after: configure(
---
  require('./<%= h.changeCase.param(name) %>')
