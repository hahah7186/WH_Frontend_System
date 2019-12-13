import request from '@/utils/request';
import { FormDataType } from './index';

export async function accountLogin(params: FormDataType) {
  //debugger
  return request('/api/member/selectMemberByNamePassword', {
    params,
  });
}

export async function getFakeCaptcha(mobile: string) {
  return request(`/api/login/captcha?mobile=${mobile}`);
}
