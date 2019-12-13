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

export interface TableListItem {
  id: number;
  //disabled?: boolean;
  branch_id:number;
  branch: string;
  city: string;
  customer_no:string;
  customer_name: string;
  customer_name_en: string;
  customer_type_id:number;
  customer_type: string;
  cnoc: string;
  province: string;
  region: string;
} 

export interface TableListPagination {
  total: number;
  pageSize: number;
  current: number;
}

export interface TableListData {
  branchList: Branch[];
  customerTypeList:CustomerType[];
  list: TableListItem[];
  pagination: Partial<TableListPagination>;
  result: number;
}

export interface TableListParams {
  sorter: string;
  status: string;
  name: string;
  pageSize: number;
  currentPage: number;
}

export class ExportItem {
  id: any;
  branch: any;
  city: any;
  customer_name: any;
  customer_name_en: any;
  customer_type: any;
  cnoc: any;
  province: any;
  region: any;
}

export class Branch {
  branch_id:number;
  branch_name:string;
}

export class CustomerType {
  customerType_id:number;
  customerType_name:string;
}