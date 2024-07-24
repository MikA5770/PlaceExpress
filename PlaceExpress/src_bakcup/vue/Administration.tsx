import { Header } from "./header/Header"
import React, { useState } from 'react';
import {
  UserSwitchOutlined,
  DesktopOutlined,
  LineChartOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  BankOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Button, Menu } from 'antd';

import { MenuInfo } from 'rc-menu/lib/interface';

import { DivStatistique } from "./administration/DivStatistique";
import { DivRolesPermiss } from "./administration/DivRolesPermiss";
import { DivPlan } from "./administration/DivPlan";
import { DivTableauBord } from "./administration/DivTableauBord";


export function Administration() {





type MenuItem = Required<MenuProps>['items'][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
  type?: 'group',
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
    type,
  } as MenuItem;
}

const items: MenuItem[] = [
  getItem('Tableau de bord', '1', <DesktopOutlined />),
  getItem('Plans', '2', <BankOutlined />),
  getItem('Roles et permissions', '3', <UserSwitchOutlined />),
  getItem('Statistiques', '4', <LineChartOutlined />),
];

const [collapsed, setCollapsed] = useState(false);
const [elementMenuSelectionne, setElementMenuSelectionne] = useState('1');

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  const gererNavigation = (e : MenuInfo ) => {
    setElementMenuSelectionne(e.key);
  };

  const affichageContenu = () => {
    switch (elementMenuSelectionne) {
      case '1':
        return <DivTableauBord />;
      case '2':
        return <DivPlan />;
      case '3':
          return <DivRolesPermiss />;
      case '4':
        return <DivStatistique />;
      default:
        return null;
    }
  };

    return (
      <div className="bodyAdmin">

        <Header page="administration"/>

        <div className="administration">
          <div className="administration_nav"> 
            <Button type="primary" onClick={toggleCollapsed}  className="administration_nav_btnNav">
              {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            </Button>
            <Menu
              defaultSelectedKeys={['1']}
              defaultOpenKeys={['sub1']}
              mode="inline"
              theme="light"
              inlineCollapsed={collapsed}
              items={items}
              className="administration_nav_menu"
              onClick={gererNavigation}
            />
            <div className="administration_fondBlanc"> 
            
            </div>
          </div>
          

        {affichageContenu()}

        </div>
      </div>
    )
  }
  