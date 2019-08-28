---
inject: true
after: export const devScreens =
to: _devscreen/index.tsx
---
<%= h.changeCase.pascal(name) %>: require('./screens/<%= moduleName %>/<%= h.changeCase.pascal(name) %>').default,