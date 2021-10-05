import React, {useEffect, useState} from 'react';
import {Button, Col, Input, Modal, Row, Select} from "antd";
import {queryGetSettingsRate, queryGetStock, queryPostSettingsRate} from "@/pages/Rate/service";
import {LoadingOutlined} from "@ant-design/icons";


const Settings = () => {


        const [stockList, setStockList] = useState([]);
        const [stock, setStock] = useState();
        const [stockSettings, setStockSettings] = useState({});
        const [percent, setPercent] = useState();
        const [saveDataLoading, setSaveDataLoading] = useState(false);

        useEffect(() => {
            queryGetStock().then((r) => setStockList(r.data));
            queryGetSettingsRate().then((r) => {
                r.data.forEach(item => {
                    if (item.key === "percent") {
                        setPercent(item.config.percent);
                    } else {
                        stockSettings[parseInt(item.key, 10)] = item.config;
                        setStockSettings(stockSettings);
                    }

                });
            });

        }, []);

        const changeStock = (value) => {
            if (!stockSettings[value]) {
                stockSettings[value] = {};
                stockSettings[value].loader = {BYN: null, RUB: null};
                stockSettings[value].driverAssistance = {BYN: null, RUB: null};
            }
            if (stockSettings[value] && !stockSettings[value].loader) {
                stockSettings[value].loader = {BYN: null, RUB: null};
            }
            if (stockSettings[value] && !stockSettings[value].driverAssistance) {
                stockSettings[value].driverAssistance = {BYN: null, RUB: null};
            }
            setStockSettings({});
            setTimeout(() => {
                setStockSettings({...stockSettings});
            });
            setStock(value);
        };

        const checkNumeric = (e) => {
            if (!(/^-?[\d.]+(?:e-?\d+)?$/.test(e.data))) {
                e.preventDefault();
            }
        };

        const success = () => {
            Modal.success({
                content: 'Тарифы сохранены',
                okText: 'Закрыть '
            });
        };

        const saveData = () => {
            if (!saveDataLoading) {
                setSaveDataLoading(true);
                queryPostSettingsRate({
                    percent,
                    stockSettings,
                }).then(() => {
                    success();
                    setSaveDataLoading(false);
                });
            }
        };

        return (
            <div style={{
                background: '#ffffff',
                padding: 15
            }}>
                <Row gutter={[15, 15]}>
                    <Col span={24}>Стоимость страховки</Col>
                    <Col span={6}>
                        <Input style={{maxWidth: 200}} addonAfter="%" value={percent} onBeforeInput={checkNumeric}
                               onChange={e => setPercent(e.target.value)}/>
                    </Col>
                </Row>
                <div>
                    <Row gutter={[15, 15]} style={{padding: "15px 0"}}>
                        <Col>
                            <p>Стоимость грузчиков</p>
                            <Select onChange={value => changeStock(value)} defaultValue="default" style={{width: 200}}>
                                <Select.Option key={null} value={'default'} disabled={true}> Город </Select.Option>
                                {Object.keys(stockList).map((key) =>
                                    <Select.Option key={stockList[key].id}
                                                   value={stockList[key].id}>{stockList[key].name}</Select.Option>
                                )}
                            </Select>
                        </Col>
                    </Row>
                    {stock && <div>
                        <Row gutter={[15, 15]}>
                            <Col span={24}>Стоимость одного грузчика</Col>
                            {stockSettings[stock] && Object.keys(stockSettings[stock].loader).map((key) =>
                                <Col key={key.toString()} >
                                    <Input style={{maxWidth: 200}}
                                           addonAfter={key.toString()}
                                           defaultValue={stockSettings[stock].loader[key]}
                                           onBeforeInput={checkNumeric}
                                           onChange={e => {
                                               stockSettings[stock].loader[key] = e.target.value
                                               setStockSettings(stockSettings);
                                           }}/>
                                </Col>)}
                        </Row>
                        <Row style={{marginTop: 15}} gutter={[15, 15]}>
                            <Col span={24}>Стоимость помощи водителя</Col>
                            {stockSettings[stock] && Object.keys(stockSettings[stock].driverAssistance).map((key) =>
                                <Col key={key.toString()} >
                                    <Input style={{maxWidth: 200}}
                                           addonAfter={key.toString()}
                                           onBeforeInput={checkNumeric}
                                           defaultValue={stockSettings[stock].driverAssistance[key]}
                                           onChange={e => {
                                               stockSettings[stock].driverAssistance[key] = e.target.value
                                               setStockSettings(stockSettings);
                                           }}/>
                                </Col>)}
                        </Row>
                    </div>}
                </div>
                <Row justify={'end'}>
                    <Button onClick={saveData} style={{marginTop: 15}} type={'primary'}>
                        {!saveDataLoading ? 'Сохранить' :
                            <LoadingOutlined/>}
                    </Button>
                </Row>
            </div>);
    };

export default Settings;
