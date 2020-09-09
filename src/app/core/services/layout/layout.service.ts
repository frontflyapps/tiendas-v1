import { Injectable } from '@angular/core';

export interface LayoutConfig {
  navbar?: { hidden?: boolean };
  footer?: { hidden?: boolean };
  searchBar?: { hidden?: boolean };
}

@Injectable({
  providedIn: 'root'
})
export class LayoutService {

  layoutConfig: LayoutConfig = { navbar: { hidden: false, }, footer: { hidden: false }, searchBar: { hidden: false } };
  constructor() { }

  public init(): void {
    this.layoutConfig = { navbar: { hidden: false, }, footer: { hidden: false }, searchBar: { hidden: false } };
  }

  public getLayoutConf(): LayoutConfig {
    return this.layoutConfig;
  }

  public setNewLayout(layout?: LayoutConfig) {
    if (!layout) {
      this.layoutConfig = { navbar: { hidden: false, }, footer: { hidden: false } };
    }
    this.layoutConfig.navbar = (!layout.navbar) ? { hidden: false } : layout.navbar;
    this.layoutConfig.footer = (!layout.footer) ? { hidden: false } : layout.footer;
  }

  public hideFooter() {
    this.layoutConfig.footer = { hidden: true };
  }

  public hideNavBar() {
    this.layoutConfig.navbar = { hidden: true };
  }

}
