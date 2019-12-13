import request from '@/utils/request';
import { AccountTableListParams } from './data.d';

export async function queryAccount(params: AccountTableListParams) {
  return request('/api/account/selectAccountFiscalYearMappingList', {
    params,
  });
}

export async function removeAccount(params: AccountTableListParams) {
  return request('/api/account/removeAccountFiscalYearMapping', {
    params,
  });
}

export async function addAccount(params: AccountTableListParams) {
  return request('/api/account/insertAccountFiscalYearMapping', {
    params,
  });
}

export async function updateAccount(params: AccountTableListParams) {
  return request('/api/account/updateAccountFiscalYearMapping', {
    params,
  });
}
