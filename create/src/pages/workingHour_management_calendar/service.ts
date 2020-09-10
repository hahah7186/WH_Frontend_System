import request from '@/utils/request';
import { WHListParams } from './data.d';

export async function queryProjectDateCalMapping(params: WHListParams) {
  return request('/api/project/selectProjectDateMappingCalendarList', {
    params,
  });
}

// export async function queryProjectDateCalMappingByDay(params: WHListParams) {
//   return request('/api/project/selectProjectDateMappingCalendarListByDay', {
//     params,
//   });
// }

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

export async function updateProjectDateMapping(params: any) {
  return request('/api/project/updateProjectDateMappingCalendarListByDay', {
    method: 'POST',
    params,
  });
}

export async function exportProjectDateCalMapping(params: any) {
  return request('/api/project/ExportMemberWorkingHourCalendar', {
    params,
  });
}
