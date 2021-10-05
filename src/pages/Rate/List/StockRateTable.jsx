import React, {createRef, useEffect, useState} from 'react';
import {Select, Row, Col, Button, Modal} from "antd";
import {
    queryGetStock,
    queryGetRateStock,
    queryPostRateStock
} from "../service";
import {LoadingOutlined} from '@ant-design/icons';
import DynamicTable from "@/components/Table/DynamicTable";

const StockRateTable = () => {

    const [data, setData] = useState([]);
    const [defTableData, setDefTableData] = useState([]);
    const [sendDataLoading, setSendDataLoading] = useState(false);
    const [currency, setCurrency] = useState('RUB');
    const [stock, setStock] = useState();
    const [stockList, setStockList] = useState({});

    const tableRef = createRef();

    const parentDiv = {
        background: '#ffffff',
        padding: 15
    };

    useEffect(() => {
        queryGetStock().then((r) => setStockList(r.data));
        queryGetRateStock().then(r => setData(r.data));

    }, []);

    const success = () => {
        Modal.success({
            content: 'Тарифы сохранены',
            okText: 'Закрыть '
        });
    };

    const warning = () => {
        Modal.warning({
            content: 'Ошибка сохранения. Проверьте данные.',
            okText: 'Закрыть'
        });
    };

    const changeCurrency = (vale) => {
        setCurrency(vale);
    };

    const changeStock = (value) => {
        setDefTableData(data.filter( item => item.stock === value ).slice());
        setStock(value);
    };

    const sendData = () => {
        const tableData = tableRef.current.getTableData();
        if (!sendDataLoading && tableData) {
            setSendDataLoading(true);
            queryPostRateStock({
                stockRates: tableData.map(item => {
                    item.stock = stock;
                    return item;
                }),
            }).then((r) => {
                setSendDataLoading(false);
                if (r && r.data) {
                    success();
                    setData(r.data);
                    setDefTableData(r.data.filter(item => item.stock === stock));
                }
            });
        } else {
            warning();
        }
    };

    return (

        <div style={parentDiv}>
            <Row gutter={15} style={{padding: "15px 0"}}>
                <Col>
                    <Select onChange={value => changeStock(value)} defaultValue="default" style={{width: 220}}>
                        <Select.Option key={null} value={'default'} disabled={true}> Город </Select.Option>
                        {Object.keys(stockList).map((key) =>
                            <Select.Option key={stockList[key].id}
                                           value={stockList[key].id}>{stockList[key].name}</Select.Option>
                        )}
                    </Select>
                </Col>
                <Col>
                    <Select onChange={vale => changeCurrency(vale)} defaultValue={currency} style={{width: 220}}>
                        <Select.Option value="RUB">Российский рубль</Select.Option>
                        <Select.Option value="BYN">Белорусский рубль</Select.Option>
                    </Select>
                </Col>
            </Row>
            <DynamicTable
                ref={tableRef}
                data={defTableData}
                initialDataConst={{ distance: 'КМ', weight: 'КГ' }}
                row={'weight'}
                column={'distance'}
                defaultItem={'price'}
                defaultItemValue={currency}
                defaultValue={{RUB: null, BYN: null}}
            />
            <Col>
                <Row justify={'end'}>
                    <Button onClick={sendData} style={{marginTop: 15}} type={'primary'}>
                        {!sendDataLoading ? 'Сохранить' :
                            <LoadingOutlined/>}
                    </Button>
                </Row>
            </Col>
        </div>
    );
};

export default StockRateTable;
