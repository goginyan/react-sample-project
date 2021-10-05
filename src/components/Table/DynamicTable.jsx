import {Dropdown, Menu} from "antd";
import React, {useEffect, useImperativeHandle, useState} from "react";
import window from "../../../../vendor/swagger-api/swagger-ui/src/core/window";


const DynamicTable = React.forwardRef((props, ref) => {

    const {
        disableHeaders = false,
        dynamic = true,
        data,
        row,
        initialDataConst,
        column,
        defaultItem,
        defaultItemValue,
        defaultValue
    } = props;

    const [tableData, setTableData] = useState([
        [initialDataConst]
    ]);

    const tdStyle = {
        border: '1px solid #f0f0f0',
        padding: '12px 8px',
        background: '#ffffff',
        outline: 'none'
    };

    const tableStyle = {
        width: '100%',
        tableLayout: 'fixed',
        borderCollapse: 'collapse',
    };

    const trStyle = {};
    /**
     *
     * @param tableDataUpdate
     */
    const refreshData = (tableDataUpdate) => {
        if (tableDataUpdate) {
            setTableData([]);
            setTimeout(() => {
                setTableData(tableDataUpdate);
            });
        } else {
            setTableData([]);
            setTimeout(() => {
                setTableData(tableData);
            });
        }
    };

    /**
     *
     * @returns {boolean}
     */
    const validate = () => {
        refreshData(tableData);

        if (tableData[0].length !== tableData[0].map((value, index) => (index === 0) ? value : parseFloat(value)).filter((value, index, self) => self.indexOf(value) === index).length) {

            return false;
        }

        return tableData.map(value => value[0]).length === tableData.map((value, index) => (index === 0) ? value[0] : parseFloat(value[0])).filter((value, index, self) => self.indexOf(value) === index).length;
    };

    /**
     *
     * @param rowKey
     * @param columnKey
     * @returns {boolean}
     */
    const checkEditable = (rowKey, columnKey) => {
        if (disableHeaders) {
            if (rowKey === 0 || columnKey === 0) {

                return false;
            }
        }

        return true;
    };

    useImperativeHandle(ref, () => ({

        getTableData() {
            if (validate()) {
                const returnData = [];
                refreshData(tableData);
                tableData.forEach((_row, rowIndex) => {
                    if (rowIndex !== 0) {
                        _row.forEach((_column, columnIndex) => {
                            if (columnIndex !== 0) {
                                returnData.push({
                                    [row]: _row[0],
                                    [column]: tableData[0][columnIndex],
                                    [defaultItem]: _column
                                });
                            }
                        });
                    }
                });

                return returnData;
            }

            return false;
        }

    }));

    useEffect(() => {

        const tableInitialData = [[initialDataConst]];
        if(typeof data === 'boolean') {
            if(!data){
                refreshData([]);
            }
        }else
        if (data.length) {
            data.forEach(item => {
                if (!tableInitialData[0].includes(item[column])) {
                    tableInitialData[0].push(item[column]);
                }
                let insert = true;
                tableInitialData.forEach(tableItem => {
                    if (tableItem[0] === item[row]) {
                        insert = false;
                    }
                });
                if (insert) {
                    tableInitialData.push([item[row]]);
                }
                tableInitialData.map((i) => {
                    if (i[0] === item[row]) {
                        i.push(item[defaultItem] ? item[defaultItem] : {...defaultValue});
                    }
                    return i;
                });

            });
            refreshData(tableInitialData);
        } else {
            refreshData([
                [initialDataConst, null],
                [null, {...defaultValue}]
            ]);
        }

    }, [data]);

    useEffect(() => {

        refreshData();

    }, [defaultItemValue]);


    const tdHtmlContent = (rowKey, key, item) => {
        if (rowKey === 0 || key === 0) {
            if (rowKey === 0 && key === 0) {
                return (
                    <div>
                        <span style={{position: 'absolute', left: 2, bottom: 2}}> {item[row]} </span>
                        <span style={{position: 'absolute', right: 2, top: 2}}> {item[column]} </span>
                    </div>
                )
            }

            return (<span>{item}</span>)
        }

        return (<span>{item[defaultItemValue]}</span>)
    };

    const menu = (e) => {
        const cord = [];
        if (e && e.target.getAttribute && e.target.getAttribute('data-key')) {
            cord.push(...e.target.getAttribute('data-key').split(',').map((item) => parseInt(item, 10)));
        }

        return (<Menu>
            {(typeof cord[0] === 'number' && cord[0] !== 0) &&
            <Menu.Item
                key={"1"}
                onClick={() => {
                    if (typeof cord[0] === 'number') {
                        const pushedArray = []
                        tableData[0].map((key, index) =>
                            pushedArray.push(index === 0 ? null : {...defaultValue})
                        )
                        tableData.splice(cord[0], 0, pushedArray)
                        refreshData()
                    }
                }}> вставить строку выше </Menu.Item>}

            <Menu.Item
                key={"2"}
                onClick={() => {
                    if (typeof cord[0] === 'number') {
                        const pushedArray = []
                        tableData[0].map((key, index) =>
                            pushedArray.push(index === 0 ? null : {...defaultValue})
                        )
                        tableData.splice((cord[0] + 1), 0, pushedArray);
                        refreshData();
                    }
                }}>вставить строку ниже</Menu.Item>

            {(typeof cord[1] === 'number' && cord[1] !== 0) &&
            <Menu.Item
                key={"3"}
                onClick={() => {
                    if (typeof cord[1] === 'number') {
                        refreshData(setTableData(tableData.map((item, index) => {
                            item.splice(cord[1], 0, index === 0 ? null : {...defaultValue})

                            return item;
                        })));
                    }
                }}>вставить столбец слева</Menu.Item>}

            <Menu.Item
                key={"4"}
                onClick={() => {
                    if (typeof cord[1] === 'number') {
                        refreshData(tableData.map((item, index) => {
                            item.splice(cord[1] + 1, 0, index === 0 ? null : {...defaultValue})

                            return item;
                        }))
                    }
                }}>вставить столбец справа</Menu.Item>

            {(typeof cord[1] === 'number' && cord[1] !== 0) &&
            <Menu.Item
                key={"5"}
                onClick={() => {
                    if (typeof cord[1] === 'number') {
                        refreshData(tableData.map(item => {
                            item.splice(cord[1], 1)

                            return item;
                        }));
                    }
                }}>удалить столбец</Menu.Item>}

            {(typeof cord[0] === 'number' && cord[0] !== 0) &&
            <Menu.Item
                key={"6"}
                onClick={() => {
                    if (typeof cord[0] === 'number') {
                        tableData.splice(cord[0], 1)
                        refreshData()
                    }
                }}>удалить строку</Menu.Item>}
        </Menu>)
    };

    const backgroundTd = (rowKey, key, background) => {
        switch (true) {
            case (rowKey === 0 && key === 0):
                return 'linear-gradient(to top right, rgba(0,0,0,0) 0%, rgba(0,0,0,0) calc(50% - 0.8px), #f0f0f0 50%, rgba(0,0,0,0) calc(50% + 0.8px), rgba(0,0,0,0) 100%), #fafafa';
            case (rowKey === 0 || key === 0):
                return '#fafafa';
            default:
                return background;
        }
    };

    return (
        <Dropdown disabled={!dynamic} overlay={() => menu(event)} trigger={['contextMenu']}>
            <table style={tableStyle}>
                <tbody>
                {(tableData.length > 1) && tableData.map((cols, rowKey) =>
                    <tr style={trStyle} key={rowKey.toString()}>
                        {cols.map((item, key) =>
                            <td style={
                                {
                                    ...tdStyle,
                                    width: (rowKey === 0 && key === 0) ? 190 : 'auto',
                                    padding: (rowKey === 0 && key === 0) ? 0 : tdStyle.padding,
                                    position: (rowKey === 0 && key === 0) ? 'relative' : 'inherit',
                                    color: (rowKey === 0 || key === 0) ? 'rgba(0, 0, 0, 0.85)' : 'inherit',
                                    fontWeight: (rowKey === 0 || key === 0) ? 500 : 'inherit',
                                    background: backgroundTd(rowKey, key, tdStyle.background)
                                }}
                                onPaste={event => {
                                  event.preventDefault()
                                }}
                                className="site-dropdown-context-menu"
                                suppressContentEditableWarning={true}
                                key={`${rowKey.toString()},${key.toString()}`}
                                contentEditable={checkEditable(rowKey, key)}
                                data-key={`${rowKey},${key}`}
                                onInput={(e) => {
                                    if ((rowKey === 0 || key === 0)) {
                                        tableData[rowKey][key] = e.currentTarget.innerText
                                    } else {
                                        tableData[rowKey][key][defaultItemValue] = e.currentTarget.innerText
                                    }
                                }}
                                onBeforeInput={(e) => {
                                    if (!(/^-?[\d.-]+(?:e-?\d+)?$/.test(e.data))) {
                                        e.preventDefault()
                                    }
                                }}
                            > {tdHtmlContent(rowKey, key, item)} </td>
                        )}
                    </tr>
                )}
                </tbody>
            </table>
        </Dropdown>)
});

export default DynamicTable;
