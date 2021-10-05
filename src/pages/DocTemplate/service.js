import proTableToLaravelQueryBuilderRequest from "../../services/protable/proTableToLaravelQueryBuilderRequest";
import Qs from "qs";
import request from '@/utils/request';
import { _u } from '@/utils/url';

export function queryDocs(defaultSorter) {
    return proTableToLaravelQueryBuilderRequest('/api/doc-templates', defaultSorter);
}

export function queryHistory(id, defaultSorter) {
    return proTableToLaravelQueryBuilderRequest('/api/doc-templates/history/list/' + id, defaultSorter);
}

export async function queryDoc(id) {
    return await request(_u('/api/doc-templates/' + id), {});
}