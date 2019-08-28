---
inject: true
after: export const devScreens =
to: _devscreen/index.tsx
---
  <%= h.changeCase.pascal(name) %>: require('./components/<%= h.changeCase.pascal(name) %>').default,