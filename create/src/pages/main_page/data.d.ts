export interface VisitDataType {
  x: string;
  y: number;
}

export interface SearchDataType {
  // index: number;
  // keyword: string;
  // count: number;
  // range: number;
  // status: number;
  projectId: number;
  projectName: string;
  supportType: string;
  startTime: string;
  endTime: string;
  workingHour: number;
}

export interface OfflineDataType {
  id: string;
  name: string;
  cvr: number;
}

export interface OfflineChartData {
  // x: any;
  // y1: number;
  // y2: number;
  id: string;
  searchData: SearchDataType;
}

export interface RadarData {
  name: string;
  label: string;
  value: number;
}

export interface RankingListData {
  title: string;
  total: number;
}

export interface TotalWorkingHour {
  totalHour: number;
  normalHour: number;
  overtimeHour: number;
  totalMoney: number;
}

export interface TotalWorkingHourFiscalYear {
  totalWorkingHourFiscalYear: number;
  totalFiscalYearVolume: number;
}

export interface ProjectFiscalYear {
  projectNumber: number;
  totalProjectNumber: number;
}

export interface TeamInfo {
  apcNumber: number;
  bdNumber: number;
  pssNumber: number;
  salesNumber: number;
  ratio: number;
}

export interface CustomerInfo {
  customerNumber: number;
  customerNumberForSupport: number;
}

export interface AnalysisData {
  customerInfo: CustomerInfo;
  rankingListData: RankingListData[];
  rankingListVolume: RankingListData[];
  totalWorkingHour: TotalWorkingHour;
  projectFiscalYear: ProjectFiscalYear;
  // teamInfo: TeamInfo,
  branchProjectNumber: VisitDataType[];
  branchProjectCostNumber: VisitDataType[];
  branchCustomerNumber: VisitDataType[];
  supportProjectNumber: VisitDataType[];
  supportProjectCostNumber: VisitDataType[];
  totalWorkingHourFiscalYear: TotalWorkingHourFiscalYear;
  visitData: VisitDataType[];
  visitData2: VisitDataType[];
  salesData: VisitDataType[];
  salesVolume: VisitDataType[];
  searchData: SearchDataType[];
  offlineData: OfflineDataType[];
  offlineChartData: OfflineChartData[];
  salesTypeData: VisitDataType[];
  salesTypeDataOnline: VisitDataType[];
  salesTypeDataOffline: VisitDataType[];
  radarData: RadarData[];
}
