import React, { useState } from 'react';
import '../styles/sideBar.css';
import { Layout, Menu, Tooltip } from 'antd'; // Import Tooltip from antd
import { Link, useMatch } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../context';
import { useDataProvider } from '../context';
import { Space, Switch } from 'antd';

const { Sider } = Layout;

export function SideBar() {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const { setUserDetails, authenticatedUserDetails } = useAuthContext();
  const { toggleDarkMode } = useDataProvider();

  const handleCollapse = (collapsed) => {
    setCollapsed(collapsed);
  };

  const logOut = () => {
    localStorage.removeItem('authenticatedUserDetails');
    setUserDetails(null);
    navigate('/login');
  };

  return (
    <Layout>
      <Sider width={200} collapsible collapsed={collapsed} onCollapse={handleCollapse}>
        <Menu mode="inline" defaultSelectedKeys={['1']} style={{ height: '100%', borderRight: 0 }}>
          {!collapsed && (
            <>
              <Menu.Item key="1">
                <Link to="/home">{collapsed ? null : 'Home'}</Link>
              </Menu.Item>
              {authenticatedUserDetails?.isAdmin && (
                <Menu.Item key="2">
                  <Link to="/payoutCalculations">Payout Calculations</Link>
                </Menu.Item>
              )}
              <Menu.Item key="3">
                <Link to="/payoutDetails">Payout Details</Link>
              </Menu.Item>
              <Menu.Item key="4">
                <Link to="/newsAnalytics">News Analytics</Link>
              </Menu.Item>
              <Menu.Item key="5">
                <Space direction="vertical">
                  <Switch
                    checkedChildren="Light"
                    unCheckedChildren="Dark"
                    onChange={(val) => toggleDarkMode(val)}
                  />
                </Space>
              </Menu.Item>
              <Menu.Item key="6" onClick={logOut}>
                {collapsed ? null : 'LogOut'}
              </Menu.Item>
            </>
          )}
        </Menu>
      </Sider>
    </Layout>
  );
}
