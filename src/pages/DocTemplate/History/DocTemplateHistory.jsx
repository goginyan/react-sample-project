import {ConfigProvider, Drawer} from 'antd';
import React, { useState, useRef } from 'react';
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import ProDescriptions from '@ant-design/pro-descriptions';
import { queryHistory, queryDoc } from '../service';
import { _u } from '../../../utils/url';
import ruRUIntl from 'antd/lib/locale/ru_RU';
import {formatWithTime} from "../../../utils/date";
import { Link } from 'umi';
import companies from "../../../yii/companies";

/**
 * Таблица история изменений документов
 * @returns {*}
 * @constructor
 */
const DocTemplateHistory = (props) => {
    const [showDetail, setShowDetail] = useState(false);
    const actionRef = useRef();
    const [currentRow, setCurrentRow] = useState();
    const [description, setDescription] = useState('Загрузка...')

    const columns = [
        {
            title: "Пользователь",
            dataIndex: 'username',
            hideInSearch: true,
        },
        {
            title: "Последнее обновление",
            sorter: true,
            dataIndex: 'updated_at',
            defaultSortOrder: 'descend',
            valueType: 'dateTime',
            hideInSearch: true,
            render: (_, record) => <span>{formatWithTime(record.updated_at)}</span>
        },
        {
            render: (_, record) => [
                <a
                    key="config"
                    target={'_blank'}
                    href={_u('/doc-templates/word/history/' + record.id)}
                >
                    Открыть в редакторе
                </a>
            ],
        },
    ];

    queryDoc(props.location.query.id).then(function(resp) {
        setDescription(resp.caption + ' - ' + companies[resp.company_id].text ?? '');
    });

    return (
        <div>
            {/* Дока: https://procomponents.ant.design/en-US/components/table */}
            <ConfigProvider locale={ruRUIntl}>
                <ProTable
                    headerTitle={`История документа - ${description}`}
                    actionRef={actionRef}
                    rowKey="key"
                    pagination={{
                        defaultPageSize: 100
                    }}
                    sorter={{
                        'updated_at': 'descend'
                    }}
                    search={{
                        filterType: 'light',
                    }}
                    request={queryHistory(props.location.query.id, {'updated_at': 'descend'})}
                    columns={columns}
                />
            </ConfigProvider>

            <Drawer
                width={600}
                visible={showDetail}
                onClose={() => {
                    setCurrentRow(undefined);
                    setShowDetail(false);
                }}
                closable={false}
            >
                {currentRow?.caption && (
                    <ProDescriptions
                        column={2}
                        title={currentRow?.name}
                        request={async () => ({
                            data: currentRow || {},
                        })}
                        params={{
                            id: currentRow?.name,
                        }}
                        columns={columns}
                    />
                )}
            </Drawer>
        </div>
    );
};

export default DocTemplateHistory;
