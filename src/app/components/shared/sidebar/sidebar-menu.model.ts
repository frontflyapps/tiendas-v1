// export class SidenavMenu {
//   constructor(public id: number,
//               public title: string,
//               public routerLink: string,
//               public href: string,
//               public target: string,
//               public hasSubMenu: boolean,
//               public parentId: number) { }
// }
export interface SidenavMenu {
  displayName: string;
  disabled?: boolean;
  iconName: any;
  material?: boolean;
  route?: string;
  id?: string;
  badge?: boolean;
  badgeCount?: number;
  children?: SidenavMenu[];
}
