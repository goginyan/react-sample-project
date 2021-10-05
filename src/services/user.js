import request from '@/utils/request';
import {_u} from "../utils/url";
export async function query() {
  return request('/api/users');
}
export async function queryCurrent() {
  return request(_u('/api/user/current'), {
    method: 'GET',
  });
}
export async function queryNotices() {
  return request('/api/notices');
}