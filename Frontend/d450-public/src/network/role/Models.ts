export enum RoleKind {
  Self = 'self',
  Other = 'other',
}

export interface RoleListItem {
  id: string;
  name: string;
  kind: RoleKind;
}

export interface RoleDetails {
  id: string;
  name: string;
  kind: RoleKind;
}
