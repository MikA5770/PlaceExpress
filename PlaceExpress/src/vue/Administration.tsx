import { Header } from "./header/Header"
import React, { useState } from 'react';
import {
  UserSwitchOutlined,
  DesktopOutlined,
  LineChartOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  BankOutlined,
  UnlockOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Button, Menu } from 'antd';

import { MenuInfo } from 'rc-menu/lib/interface';

import { DivStatistique } from "./administration/DivStatistique";
import { DivPermiss } from "./administration/DivPermiss";
import { DivPlan } from "./administration/DivPlan";
import { DivTableauBord } from "./administration/DivTableauBord";
import { DivRole } from "./administration/DivRole";
import { Footer } from "./Footer";

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
  getItem('Roles', '3', <UserSwitchOutlined />),
  getItem('Statistiques', '4', <LineChartOutlined />),
  getItem('Permissions', '5', <UnlockOutlined />),
];

const labelMobile= new Map<string,string>();
labelMobile.set('1','Tableau de bord');
labelMobile.set('2','Plans')
labelMobile.set('3','Roles')
labelMobile.set('4','Statistiques')
labelMobile.set('5','Permissions')

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
          return <DivRole />;
      case '4':
        return <DivStatistique />;
      case '5':
        return <DivPermiss />;
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
          <div className="administration_navMobile_conteneur"> 
          <div className="administration_navMobile"> 
          {Array.from(labelMobile.values()).map((label, index) => (
            <div
              key={index} 
              className= {(index + 1).toString()===elementMenuSelectionne ? "administration_navMobile_elementSelectionner" :"administration_navMobile_element" }
              onClick={() => {
                setElementMenuSelectionne((index + 1).toString());
              }}
              >
              <div>{label}</div>
              <div></div>
          </div>
            
  ))}
          </div>
        </div>
          

        {affichageContenu()}

        </div>
        <Footer couleur='dore'/>
      </div>
    )
  }
  