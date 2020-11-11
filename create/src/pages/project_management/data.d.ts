// export interface Member {
//   avatar: string;
//   name: string;
//   id: string;
// }

// export interface MemberSearch{
//   list:MemberSelect[];
//   count:number;
// }

export interface MemberSelect {
  value: number;
  text: string;
}

export interface CustomerSelect {
  value: number;
  text: string;
}

export interface Member {
  member_id: number;
  member_name: string;
  member_name_en: string;
  role_id: number;
  role_name: string;
}

export interface ListItemDataType {
  id: number;
  customer_id: number;
  customer_name: string;
  project_id: number;
  project_name: string;
  project_code: string;
  support_type_id: number;
  support_type: string;
  support_reason: string;
  apc: string;
  sales: string;
  pss: string;
  bd: string;
  arrEngineerId: string[];
  engineers: string;
  owner_id: number;
  owner: string;
  arrSalesId: string[];
  arrPssId: string[];
  arrBdId: string[];
  arrApcId: string[];
  start_time: Date;
  end_time: Date;
  update_time: Date;
  str_start_time: string;
  str_end_time: string;
  str_update_time: string;
  status_id: number;
  status_name: string;
  run_status_id: number;
  run_status_name: string;
  plan_working_hours: number;
  plan_budget: number;
  actual_running_time: number;
  overtime_running_time: number;
  sales_order_volume: number;
  comments: string;
  avatar: string;
  member: Member[];
  engineer: Member[];
  accountName: number[];
  accountVol: number[];
  fiscalYear: number[];
  keys: number[];
  accounts: AccountItems;
  hour_rate: number;
  so_no: string;
  project_run_status_id: number;
  project_run_status_name: string;
}

export interface ListPagination {
  total: number;
  pageSize: number;
  current: number;
}

export interface ListItemData {
  list: ListItemDataType[];
  apcList: MemberSelect[];
  bdList: MemberSelect[];
  pssList: MemberSelect[];
  salesList: MemberSelect[];
  customerList: CustomerSelect[];
  fiscalList: FiscalYearItem[];
  accountList: AccountExportItem[];
  supportTypeList: supportType[];
  projectRunStatusList: projectRunStatus[];
  pagination: Partial<ListPagination>;
  result: number;
  resultMessage: string;
}

export interface ListItemParams {
  sorter: string;
  status: string;
  name: string;
  pageSize: number;
  currentPage: number;
}

export class AccountExportItem {
  account_id: any;
  account_name: any;
}

export class FiscalYearItem {
  fiscal_id: any;
  fiscal_year: any;
}

export class AccountItems {
  accountName: number[];
  accountVol: number[];
  fiscalYear: number[];
  keys: number[];
}

export class supportType {
  support_type_id: number;
  support_type_name: string;
}

export class projectRunStatus {
  project_run_status_id: number;
  project_run_status_name: string;
}
