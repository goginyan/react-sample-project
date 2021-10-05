import React, {useEffect, useRef, useState} from 'react';
import {Table, ConfigProvider,Input, Button, Space} from "antd";
import ruRUIntl from 'antd/lib/locale/ru_RU';
import {queryGetCounterparty} from "@/pages/Counterparty/service";
import { SearchOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';


const CounterpartyIndex = () => {

    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const [params, setParams] = useState({});
    const [data, setData] = useState([]);
    const searchInput = useRef(null);

    const handleSearch = (selectedKeys, confirm, dataIndex) => {

        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
        setParams( {...params, [dataIndex]: selectedKeys[0] } );
    };

    const handleReset = (clearFilters, dataIndex) => {
        clearFilters();
        setSearchText('');
        delete params[dataIndex];
        setParams( {...params } );
    };

    useEffect(() => {
        queryGetCounterparty(params).then(r => setData(r));

    }, [params]);

    useEffect(() => {
        queryGetCounterparty().then(r => setData(r));
    }, []);

    const getColumnSearchProps = (dataIndex) => {
        return {
            filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
                <div style={{ padding: 8 }}>
                    <Input
                        ref={ searchInput }
                        placeholder={`Поиск`}
                        value={selectedKeys[0]}
                        onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                        onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
                        style={{ width: 188, marginBottom: 8, display: 'block' }}
                    />
                    <Space>
                        <Button
                            type="primary"
                            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                            icon={<SearchOutlined />}
                            size="small"
                            style={{ width: 90 }}
                        >
                            Поиск
                        </Button>
                        <Button onClick={() => handleReset(clearFilters, dataIndex)} size="small" style={{ width: 90 }}>
                            Сбросить
                        </Button>
                    </Space>
                </div>
            ),
            filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
            onFilter: (value, record) =>{
                if(dataIndex === 'contact'){
                return record[dataIndex].toString().replace(/[\(\)\-\+]+/g, '').toLowerCase().includes(value.replace(/[\(\)\-\+]+/g, '').toLowerCase()) || record[dataIndex].toString().toLowerCase().includes(value.toLowerCase());
                }
                return record[dataIndex].toString().toLowerCase().includes(value.toLowerCase());
            },
            onFilterDropdownVisibleChange: visible => {
                if (visible) {
                    // setTimeout(() => this.searchInput.select());
                }
            },
            render: text =>
                searchedColumn === dataIndex ? (
                    <Highlighter
                        highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
                        searchWords={[searchText]}
                        autoEscape
                        textToHighlight={text.toString()}
                    />
                ) : (
                    text
                ),
        }
    };


    const columns = [

        {
            title: 'Тип',
            dataIndex: 'type',
            render: text => text ? 'Получатель' : 'Отправитель',
            filters: [
                {
                    text: 'Отправитель',
                    value: 0,
                },
                {
                    text: 'Получатель',
                    value: 1,
                }
            ],
            onFilter: (value, record) => {

                return record.type === value
            },
        },
        {
            title: 'Фамилия',
            dataIndex: 'lastname',
            ...getColumnSearchProps('lastname'),
        },
        {
            title: 'Имя',
            dataIndex: 'firstname',
            ...getColumnSearchProps('firstname'),
        },
        {
            title: 'Телефон',
            dataIndex: 'contact',
            ...getColumnSearchProps('contact'),
        },
        {
            title: 'Адрес',
            dataIndex: 'address',
            ...getColumnSearchProps('address'),
        },
        {
            title: 'Паспорт',
            dataIndex: 'passport',
            ...getColumnSearchProps('passport'),
        },
        {
            title: 'Примечание',
            dataIndex: 'additional',
            ...getColumnSearchProps('additional'),
        }
    ];



    // eslint-disable-next-line no-plusplus


    return (
        <div>
            <ConfigProvider locale={ruRUIntl}>
              <Table rowKey="id"
                     columns={columns}
                     onChange = { (pagination, filters)=> {
                         setParams({...params,
                                            'type': filters.type ? filters.type.join(','): "0,1",
                                            pageSize:pagination.pageSize,
                                            page:pagination.current })
                     } }
                     dataSource={data.data}
                     pagination={{ defaultPageSize: 100,total: data.total , pageSizeOptions: [100,200,300,400,500] }}
              />
            </ConfigProvider>
        </div>
    );
};

export default CounterpartyIndex;
