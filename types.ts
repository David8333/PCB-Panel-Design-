
export interface PCBConfig {
  unitWidth: number;
  unitHeight: number;
  countX: number;
  countY: number;
  railTop: number;
  railBottom: number;
  railLeft: number;
  railRight: number;
  gapX: number;
  gapY: number;
}

export interface PanelResult {
  totalWidth: number;
  totalHeight: number;
  unitArea: number;
  totalArea: number;
  totalUnits: number;
}
