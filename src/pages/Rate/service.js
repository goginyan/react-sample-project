import request from '@/utils/request';
import {_u} from '@/utils/url';

/**
 *
 * @returns {Promise<any>}
 */
export function queryGetStocksHighway() {
    return request(_u('/api/highway'), {
        method: 'GET',
    });
}

/**
 *
 * @param data
 * @returns {Promise<any>}
 */
export function queryPostRateHighway(data) {
    return request(_u('/api/rate/highway'), {
        method: 'POST',
        data
    });
}

/**
 *
 * @returns {Promise<any>}
 */
export function queryGetRateHighway() {
    return request(_u('/api/rate/highway'), {
        method: 'GET',
    });
}

/**
 *
 * @returns {Promise<any>}
 */
export function queryGetStock() {
    return request(_u('/api/stock'), {
        method: 'GET',
    });
}

/**
 *
 * @returns {Promise<any>}
 */
export function queryGetRateStock() {
    return request(_u('/api/rate/stock'), {
        method: 'GET',
    });
}

/**
 *
 * @param data
 * @returns {Promise<any>}
 */
export function queryPostRateStock(data) {
    return request(_u('/api/rate/stock'), {
        method: 'POST',
        data
    });
}

/**
 *
 * @param data
 * @returns {Promise<any>}
 */
export function queryPostUrgencyIncrRate(data) {
    return request(_u('/api/rate/stock/urgency-incr'), {
        method: 'POST',
        data
    });
}

/**
 *
 * @param data
 * @returns {Promise<any>}
 */
export function queryPostHighwayUrgencyIncrRate(data) {
    return request(_u('/api/rate/highway/urgency-incr'), {
        method: 'POST',
        data
    });
}
/**
 *
 * @param data
 * @returns {Promise<any>}
 */
export function queryGetSettingsRate(data) {
    return request(_u('/api/rate/settings'), {
        method: 'GET',
        data
    });
}/**
 *
 * @param data
 * @returns {Promise<any>}
 */
export function queryPostSettingsRate(data) {
    return request(_u('/api/rate/settings'), {
        method: 'POST',
        data
    });
}
