export interface MemberTableListItem {
  member_id:number;
  member_name:string;
  member_name_en:string;
  family_name:string;
  given_name:string;
  group_id:number;
  group_name:string;
  g_id:string;
  email:string;
  mobile:string;
  portrait_url:string;
  role_name:string;
  role_id:number;
  post_name:string;
  post_id:number;
  org_name:string;
  branch_id:number;
  branch_name:string;
} 

export interface MemberTableListPagination {
  total: number;
  pageSize: number;
  current: number;
}

export interface MemberTableListData {
  list: MemberTableListItem[];
  pagination: Partial<MemberTableListPagination>;
  result: number;
  // fiscalYearList: FiscalYear[],
  // accountNameList: AccountNameSel[],
  // accountTypeList: AccountType[],
  groupList:Group[];
  roleList:Role[];
  postList:Post[];
}

export interface MemberTableListParams {
  sorter: string;
  status: string;
  name: string;
  pageSize: number;
  currentPage: number;
}

export class MemberExportItem {
  member_id:any;
  member_name:any;
  member_name_en:any;
  family_name:any;
  given_name:any;
  group:any;
  g_id:any;
  email:any;
  mobile:any;
  portrait_url:any;
  role:any;
  post:any;
  org_code:any;
}

export class Group {
  group_id: number;
  group_name: string;
}

export class Role{
  role_id: number;
  role_name: string;
}

export class Post {
  post_id: number;
  post_name: string;
}