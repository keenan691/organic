import {PlainOrgNode} from 'org-mode-connection'

export type EntryPoint = {
    id: string;
    type: 'file' | 'entry';
};

export type InitialState = {
  status: 'ready' | 'loading',
  editorEntryPoint: EntryPoint | null
  agendaIds: string[]
  editorIds: string[]
  searchIds: string[]
  data: {[id: string]: OrgEntry}
}

export type OrgEntry = PlainOrgNode
