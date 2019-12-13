import { parse } from 'qs';

export function getPageQuery() {
  return parse(window.location.href.split('?')[1]);
}

export function setAuthority(authority: string | string[]) {
 // debugger
  const proAuthority = typeof authority === 'string' ? [authority] : authority;
  return localStorage.setItem('antd-pro-authority', JSON.stringify(proAuthority));
}

// 获取身份
export function getAuthority() {
  return localStorage.getItem('antd-pro-authority');
}