import request from '@/utils/request';
import { WHListParams } from './data.d';

export async function queryProjectDateMapping(params: WHListParams) {
  return request('/api/project/selectProjectDateMappingList', {
    params,
  });
}

export async function queryMember(params: any) {
  return request('/api/member/selectSubMemberList', {
    params,
  });
}


export async function removeProjectDateMapping(params: WHListParams) {
  return request('/api/rule', {
    method: 'POST',
    data: {
      ...params,
      method: 'delete',
    },
  });
}

export async function addProjectDateMapping(params: WHListParams) {
  //debugger
  return request('/api/project/insertProjectDateMappingBatch', {
    method: 'POST',
    params,
  });
}

export async function updateProjectDateMapping(params: WHListParams) {
  return request('/api/rule', {
    method: 'POST',
    data: {
      ...params,
      method: 'update',
    },
  });
}
