---
inject: true
to: src/screens/index.ts
after: export function registerScreens
---
  registerComponentWithRedux(redux)('<%= moduleName %>/<%= h.changeCase.pascal(name) %>', <%= h.changeCase.pascal(name) %>);