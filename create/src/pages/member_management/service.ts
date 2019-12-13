import request from '@/utils/request';
import { MemberTableListParams } from './data.d';

export async function queryMember(params: MemberTableListParams) {debugger
  return request('/api/member/selectMemberList', {
    params,
  });
}

export async function removeMember(params: MemberTableListParams) {
  return request('/api/member/removeMember', {
    params,
  });
}

export async function addMember(params: MemberTableListParams) {
  return request('/api/member/insertMember', {
    params,
  });
}

export async function updateMember(params: MemberTableListParams) {
  return request('/api/member/updateMember', {
    params,
  });
}
