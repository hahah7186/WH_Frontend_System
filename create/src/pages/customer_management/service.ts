import request from '@/utils/request';
import { TableListParams } from './data.d';

export async function queryCustomer(params: TableListParams) {
  return request('/api/customer/selectCustomerList', {
    params,
  });
}

export async function removeCustomer(params: TableListParams) {
  return request('/api/customer/removeCustomer', {
    params,
  });
}

export async function addCustomer(params: TableListParams) {
  return request('/api/customer/insertCustomer', {
    params,
  });
}

export async function updateCustomer(params: TableListParams) {
  return request('/api/customer/updateCustomer', {
    params,
  });
}
