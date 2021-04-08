import request from '@/utils/request';
import { ListItemDataType } from './data.d';

export async function queryProjectList(params: ListItemDataType) {
  return request('/api/project/selectProjectList', {
    params,
  });
}

export async function queryMember(params: any) {
  return request('/api/member/selectSubMemberList', {
    params,
  });
}

export async function updateProject(params: ListItemDataType) {
  return request('/api/project/updateProjectById', {
    params,
  });
}

export async function removeProject(params: any) {
  return request('/api/project/removeProjectById', {
    params,
  });
}

export async function completeProject(params: any) {
  return request('/api/project/changeProjectStatusById', {
    params,
  });
}

export async function createProject(params: any) {
  return request('/api/project/createProject', {
    params,
  });
}

export async function exportProjectDateCalMapping(params: any) {
  return request('/api/project/ExportProjectList', {
    params,
  });
}
