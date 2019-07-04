---
to: src/<%= moduleKind %>/<%= moduleName %>/effects/<%= name.split('-')[1] %>.ts
---
import { call, put, select } from 'redux-saga/effects'
import { <%= moduleName %>Actions, <%= moduleName %>Selectors } from 'core/<%= moduleName %>'

export default function*(action: ReturnType<typeof <%= moduleName %>Actions.<%= name.split('-')[0] %>>): Generator {
  console.tron.error('Effect <%= name.split('-')[1] %> not implemented')
}
