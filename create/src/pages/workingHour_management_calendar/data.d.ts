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

export interface WHListPagenation{
  total: number;
  pageSize: number;
  current: number;
}

export interface WHListItem{
  key: number,
  prj_name: string,
  prj_id: number,
  first: number,
  second: number,
  third:number,
  fourth:number,
  fifth:number,
  sixth:number,
  seventh:number,
  eighth:number,
  ninth:number,
  tenth:number,
  eleventh:number,
  twelfth:number,
  thirteenth:number,
  fourteenth:number,
  fifteenth:number,
  sixteenth:number,
  seventeenth:number,
  eighteenth:number,
  nineteenth:number,
  twentieth:number,
  twenty_first:number,
  twenty_second :number,
  twenty_third:number,
  twenty_fourth:number,
  twenty_fifth:number,
  twenty_sixth:number,
  twenty_seventh:number,
  twenty_eighth:number,
  twenty_ninth:number,
  thirtieth:number,
  thirtiety_first:number,
  thirtiety_second:number,
  month:number,
  year:number,
  comments:string,
  sum:number,
}

export interface WHListComments{
  key: string,
  first: string,
  second: string,
  third:string,
  fourth:string,
  fifth:string,
  sixth:string,
  seventh:string,
  eighth:string,
  ninth:string,
  tenth:string,
  eleventh:string,
  twelfth:string,
  thirteenth:string,
  fourteenth:string,
  fifteenth:string,
  sixteenth:string,
  seventeenth:string,
  eighteenth:string,
  nineteenth:string,
  twentieth:string,
  twenty_first:string,
  twenty_second :string,
  twenty_third:string,
  twenty_fourth:string,
  twenty_fifth:string,
  twenty_sixth:string,
  twenty_seventh:string,
  twenty_eighth:string,
  twenty_ninth:string,
  thirtieth:string,
  thirtiety_first:string,
  thirtiety_second:string,
}

export interface WHListData{
  list: WHListItem[];
  pagination: Partial<WHListPagenation>;
  result: number;
  columns: WHListColumns[];
  comments:WHListComments[];
}

export interface WHListColumns {
  title: string;
  dataIndex: string;
  key: string,
  width: string,
  editable: boolean,
  fixed: string,
}


export interface MemberSearch{
  list:MemberSelect[];
  count:number;
}

export interface MemberSelect{
  value:string;
  text:string;
}