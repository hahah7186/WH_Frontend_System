/*export interface TableListItem {
  key: number;
  disabled?: boolean;
  href: string;
  avatar: string;
  name: string;
  title: string;
  owner: string;
  desc: string;
  callNo: number;
  status: number;
  updatedAt: Date;
  createdAt: Date;
  progress: number;
}*/

export interface MemberSelect{
  member_id:number;
  member_name:string;
}
export interface AccountTableListItem {
  account_id: number;
  account_name: string;
  fiscal_year: number;
  member_id: number;
  member_name: string;
  member_name_en: string;
  budget: number;
  sap_order: string;
  account_type_id: number;
  account_type_name: string;
  comments: string;  
} 

export interface AccountTableListPagination {
  total: number;
  pageSize: number;
  current: number;
}

export interface AccountTableListData {
  list: AccountTableListItem[];
  pagination: Partial<AccountTableListPagination>;
  result: number;
  resultMessage: string;
  fiscalYearList: FiscalYear[],
  accountNameList: AccountNameSel[],
  accountTypeList: AccountType[],
  apcList: MemberSelect[];
  bdList: MemberSelect[];
  pssList: MemberSelect[];
  salesList: MemberSelect[];
}

export interface AccountTableListParams {
  sorter: string;
  status: string;
  name: string;
  pageSize: number;
  currentPage: number;
}

export class AccountExportItem {
  id: any;
  account_name: any;
  member_id:any;
  member_name:any;
  member_name_en:any;
  fiscal_year: any;
  budget: any;
  sap_order: any;
  account_type_id: any;
  account_type_name: any;
  comments: any;  
  // branch: any;
  // city: any;
  // customer_name: any;
  // customer_name_en: any;
  // customer_type: any;
  // cnoc: any;
  // province: any;
  // region: any;
}

export class FiscalYear {
  fiscal_id: number;
  fiscal_year: number;
}

export class AccountType{
  type_id: number;
  type_name: string;
}

export class AccountNameSel {
  account_id: number;
  account_name: string;
}