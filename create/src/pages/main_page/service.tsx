import request from '@/utils/request';

export async function fakeChartData() {
  return request('/api/fake_chart_data');
}

export async function queryChartData() {
  return request('/api/project/selectChartData');
}

export async function queryLineChartData(params: any) {
  return request('/api/project/selectLineChartData', {
    params,
  });
}

export async function queryTableData(params: any) {
  return request('/api/project/selectTableData', {
    params,
  });
}

export async function queryChartDataWithDate(params: any) {
  return request('/api/project/selectChartDataWithDate', {
    params,
  });
}
