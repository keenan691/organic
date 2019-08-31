import { PlainOrgNode } from 'org-mode-connection';

export type InitialState = {
  objects: { [nodeId: string]: OrgEntry },
  orderingByFile: { [fileId: string]: OrgEntry['id'][]}
}

export type OrgEntry = PlainOrgNode
