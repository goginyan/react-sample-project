import request from '@/utils/request';
import { _u } from '@/utils/url';
import { isEmpty, map, pickBy } from 'lodash';
import Qs from 'qs';

/**
 * Возвращает функцию, которая маппит ProTable запросы на QueryBuilder из Laravel
 * @param urn
 * @returns {function(*=, *=): {total: *, data: *, success: boolean}}
 */
export default function proTableToLaravelQueryBuilderRequest(urn, defaultSorter = {}) {
    return async function (params, sorter) {
        let sort = '';

        if (!isEmpty(sorter) || !isEmpty(defaultSorter)) {
            sort = map(!isEmpty(sorter) ? sorter : defaultSorter, ((value, key) => {
                return (value === 'ascend' ? '' : '-') + key;
            })).join(',');
        }

        const filters = pickBy(params, function (value, key) {
            return key !== 'pageSize' && key !== 'current';
        });

        let resp = await request(_u(urn), {
            params: {
                sort: sort,
                filter: filters,
                pageSize: params.pageSize,
                page: params.current
            },
            paramsSerializer: function (params) {
                return Qs.stringify(params, {arrayFormat: 'brackets'});
            },
        });

        return {
            data: resp.data,
            // Please return true for success.
            // otherwise the table will stop parsing the data, even if there is data
            success: true,
            // not passed will use the length of the data, if it is paged you must pass
            total: resp.meta.total,
        };
    }
}