import request from '@/utils/request';
import {_u} from '@/utils/url';

/**
 *
 * @returns {Promise<any>}
 */
export function queryGetCounterparty( params) {

    return request(_u('/api/counterparty'), {
        method: 'GET',
        params,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' }
    });
}
