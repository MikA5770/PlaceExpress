import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { SidebarData } from '../data/SidebarData';


function Sidebar() {
  const location = useLocation();

  return (
    <React.Fragment>
      <section>
        <div className="sidebar2">
          {SidebarData.map((item, index) => {
            const isActive = location.pathname === item.path;

            return (
              <div key={index} className="sidebar-item">
                <NavLink
                  to={item.path}
                  className={`sidebar-link ${isActive ? 'active-link' : ''}`}
                >
                  <span className="sidebar-icon">{item.icon}</span>
                  <span className="sidebar-title">{item.title}</span>
                </NavLink>
              </div>
            );
          })}
        </div>
      </section>
    </React.Fragment>
  );
}

export default Sidebar;