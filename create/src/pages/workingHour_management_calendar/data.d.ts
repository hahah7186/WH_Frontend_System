import React from 'react';
// import RcTable from 'rc-table';

// export interface TableListItem {
//   key: number;
//   disabled?: boolean;
//   href: string;
//   avatar: string;
//   name: string;
//   title: string;
//   owner: string;
//   desc: string;
//   callNo: number;
//   status: number;
//   updatedAt: Date;
//   createdAt: Date;
//   progress: number;
// }

// export interface TableListPagination {
//   total: number;
//   pageSize: number;
//   current: number;
// }

// export interface TableListData {
//   list: TableListItem[];
//   pagination: Partial<TableListPagination>;
// }

// export interface TableListParams {
//   sorter: string;
//   status: string;
//   name: string;
//   pageSize: number;
//   currentPage: number;
// }
export interface WHListParams {
  sorter: string;
  status: string;
  name: string;
  pageSize: number;
  currentPage: number;
}

export interface WHListPagenation {
  total: number;
  pageSize: number;
  current: number;
}

export interface WHListItem {
  projectId: number;
  projectName: string;
  date: string;
  memberId: number;
  memberName: string;
  workingHour: number;
  overtimeHour: number;
  comments: string;
  type: string;
}

export interface WHListItemM {
  projectId: number;
  projectName: number;
  month: string;
  memberId: number;
  memberName: string;
  workingHour: number;
  overtimeHour: number;
}

// export interface WHListDataByDay{
//   dateProjectListByDay: WHListItem[];
//   result: number;
//   resMsg: string;
// }

export interface WHListData {
  dateProjectListByDay: any;
  dateProjectList: WHListItem[];
  monthProjectListByMon: any;
  monthProjectList: WHListItemM[];
  result: number;
  resMsg: string;
  memberList: MemberSelect[];
  dateTypeList: any[];
}

export interface WHListColumns {
  title: string;
  dataIndex: string;
  key: string;
  width: string;
  editable: boolean;
  fixed: string;
}

export interface MemberSearch {
  list: MemberSelect[];
  count: number;
}

export interface MemberSelect {
  value: string;
  text: string;
}

export interface Member {
  member_id: number;
  member_name: string;
  member_name_en: string;
  role_id: number;
  role_name: string;
}
