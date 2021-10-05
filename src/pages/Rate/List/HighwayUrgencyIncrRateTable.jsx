import React, {createRef, useEffect, useState} from 'react';
import {Select, Row, Col, Button, Modal} from "antd";
import {queryGetStocksHighway, queryGetRateHighway, queryPostHighwayUrgencyIncrRate} from "../service";
import {LoadingOutlined} from '@ant-design/icons';
import DynamicTable from "@/components/Table/DynamicTable";

const HighwayUrgencyIncrRateTable = () => {

    const [data, setData] = useState([]);
    const [defTableData, setDefTableData] = useState([]);
    const [sendDataLoading, setSendDataLoading] = useState(false);
    const [percent, setPercent] = useState('ECONOMY');
    const [highway, setHighway] = useState();
    const [highwayList, setHighwayList] = useState({});

    const tableRef = createRef();

    const parentDiv = {
        background: '#ffffff',
        padding: 15
    };

    useEffect(() => {

        queryGetStocksHighway().then((r) => setHighwayList(r.data));

        queryGetRateHighway().then(r => setData(r.data));
    },[]);

    const success = () => {
        Modal.success({
            content: 'Тарифы обновлены',
            okText: 'Закрыть'
        });
    };

    const warning = () => {
        Modal.warning({
            content: 'Ошибка сохранения. Проверьте данные.',
            okText: 'Закрыть'
        });
    };

    const changePercent = (vale) => {
        setPercent(vale);
    };

    const changeHighway = (value) => {
        setDefTableData(data.filter(item => item.highway === value));
        setHighway(value);
    };


    const sendData = () => {
        const tableData = tableRef.current.getTableData();

        if (!sendDataLoading && tableData) {
            setSendDataLoading(true);
            queryPostHighwayUrgencyIncrRate({
                highwayRates: tableData.map(item => {
                    item.highway = highway;
                    return item;
                })
            }).then((r) => {
                setSendDataLoading(false);
                if (r && r.data) {
                    success();
                    setData(r.data);
                    setDefTableData(r.data.filter(item => item.highway === highway));
                }
            });
        }else {
            warning();
        }
    };

    return (
        <div style={parentDiv}>
            <Row gutter={15} style={{padding: "15px 0"}}>
                <Col>
                    <Select onChange={value => changeHighway(value)} defaultValue="default" style={{width: 220}}>
                        <Select.Option key={null} value={'default'} disabled={true}> Магистраль </Select.Option>
                        {Object.keys(highwayList).map((key, index) =>
                            <Select.Option key={index.toString()} value={key}>{highwayList[key]}</Select.Option>
                        )}
                    </Select>
                </Col>
                <Col>
                    <Select onChange={vale => changePercent(vale)} defaultValue={percent} style={{width: 220}}>
                        <Select.Option value="ECONOMY">Эконом</Select.Option>
                        <Select.Option value="EXPRESS">Экспресс</Select.Option>
                    </Select>
                </Col>
            </Row>
                <DynamicTable
                    ref={tableRef}
                    data={(defTableData.length !== 0) && defTableData}
                    initialDataConst={{volume: 'Обьём (куб.м)', weight: 'Вес (кг)'}}
                    row={'weight'}
                    column={'volume'}
                    defaultItem={'percent'}
                    defaultItemValue={percent}
                    defaultValue={{ECONOMY: null, EXPRESS: null}}
                    disableHeaders={true}
                    dynamic={false}
                />
            {defTableData.length !== 0 && (<Col>
                <Row justify={'end'}>
                    <Button onClick={sendData} style={{marginTop: 15}} type={'primary'}>
                        {!sendDataLoading ? 'Сохранить' :
                            <LoadingOutlined/>}
                    </Button>
                </Row>
            </Col>)}
        </div>
    );
};

export default HighwayUrgencyIncrRateTable;
