import request from '@/utils/request';

export async function query(): Promise<any> {
  return request('/api/users');
}

export async function queryCurrent(params: any): Promise<any> {
  // debugger
  return request('/api/member/selectMemberById', {
    params,
  });
}

export async function queryNotices(): Promise<any> {
  return request('/api/notices');
}

export async function queryCustomerByName(params): Promise<any> {
  return request('/api/notices', {
    method: 'GET',
    body: {
      ...params,
      method: 'get',
    },
  });
}
