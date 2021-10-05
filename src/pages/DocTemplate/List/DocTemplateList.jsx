import {ConfigProvider, Drawer} from 'antd';
import React, { useState, useRef } from 'react';
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import ProDescriptions from '@ant-design/pro-descriptions';
import { queryDocs } from '../service';
import { _u } from '../../../utils/url';
import ruRUIntl from 'antd/lib/locale/ru_RU';
import {formatWithTime} from "../../../utils/date";
import { Link } from 'umi';
import companies from "../../../yii/companies";

const DocTemplateList = () => {
    const [showDetail, setShowDetail] = useState(false);
    const actionRef = useRef();
    const [currentRow, setCurrentRow] = useState();

    const columns = [
        {
            title: "Документ",
            dataIndex: 'caption',
            sorter: true,
            tip: 'Документы, которые может распечатать CRM (добавляются только через программистов)'
        },
        {
            title: "Компания",
            dataIndex: 'company_id',
            sorter: true,
            valueEnum: companies,
        },
        {
            title: "Последнее обновление",
            sorter: true,
            defaultSortOrder: 'descend',
            dataIndex: 'updated_at',
            valueType: 'dateTime',
            hideInSearch: true,
            render: (_, record) => {
                return (
                    <Link to={'/lv/front/doc-templates/history?id=' + record.id}>
                        {formatWithTime(record.updated_at)}
                    </Link>
                );
            }
        },
        {
            render: (_, record) => [
                <a
                    key="config"
                    target={'_blank'}
                    href={_u('/doc-templates/word/' + record.id)}
                >
                    Редактировать
                </a>
            ],
        },
    ];
    return (
        <div>
            {/* Дока: https://procomponents.ant.design/en-US/components/table */}
            <ConfigProvider locale={ruRUIntl}>
                <ProTable
                    headerTitle={"Список документов"}
                    actionRef={actionRef}
                    rowKey="key"
                    search={{
                        filterType: 'light',
                    }}
                    pagination={{
                        defaultPageSize: 100
                    }}
                    request={queryDocs({'updated_at': 'descend'})}
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

export default DocTemplateList;
