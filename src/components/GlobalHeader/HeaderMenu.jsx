import {Menu} from 'antd';
import React from 'react';
import {Link} from 'umi';
import {_u} from "../../utils/url";
import SubMenu from "antd/es/menu/SubMenu";
import {MoneyCollectOutlined, FolderOutlined, AppstoreOutlined} from "@ant-design/icons";

export default function HeaderMenu({routes, location}) {

    const defaultSelectedKeys = routes.filter(item => item.path === location.pathname).map(item => item.name);

    return (
        <Menu mode="horizontal" defaultSelectedKeys={defaultSelectedKeys}>
            <Menu.Item key="Main" icon={<AppstoreOutlined/>}>
                <a href={_u('/../')}>Основная система</a>
            </Menu.Item>
            <Menu.Item key="Документы" icon={<FolderOutlined/>}>
                <Link to={'/lv/front/doc-templates'}>Шаблоны документов</Link>
            </Menu.Item>
            <SubMenu key="tariffs" icon={<MoneyCollectOutlined/>} title="Тарифы">
                <Menu.Item key="Тарифы">
                    <Link to={'/lv/front/rate/highway'}>Магистральные</Link>
                </Menu.Item>
                <Menu.Item key="Срочность Магистралей">
                    <Link to={'/lv/front/rate/highway/urgency-incr'}>Надбавка за срочность (магистрали)</Link>
                </Menu.Item>
                <Menu.Item key="Город">
                    <Link to={'/lv/front/rate/stock'}>Забор/Доставка по городу</Link>
                </Menu.Item>
                <Menu.Item key="Срочность">
                    <Link to={'/lv/front/rate/urgency-incr'}>Надбавка за срочность (заборы)</Link>
                </Menu.Item>
                <Menu.Item key="Настройки">
                    <Link to={'/lv/front/rate/settings'}>Настройки</Link>
                </Menu.Item>
            </SubMenu>
          <Menu.Item key="контрагент" icon={<FolderOutlined/>}>
            <Link to={'/lv/front/counterparty'}>Отправители Получатели</Link>
          </Menu.Item>
        </Menu>
    )
}
