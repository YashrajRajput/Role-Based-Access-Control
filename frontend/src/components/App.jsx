import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
// import Users from './UserManagement';
// import Roles from './RoleManagement';
import Permissions from './PermissionManagement';
import UserManagement from './UserManagement';
import RoleManagement from './RoleManagement';
import './App.css'; // Import the CSS file here


const App = () => {
  return (
    <Router>
      <div>
        <h1>RBAC Application</h1>
        <nav>
          <ul>
            <li>
              <a href="/">Home</a>
            </li>
            <li>
              <a href="/users">Users</a>
            </li>
            <li>
              <a href="/roles">Roles</a>
            </li>
            <li>
              <a href="/permissions">Permissions</a>
            </li>
          </ul>
        </nav>
        <Routes>
          <Route path="/" element={<h2>Welcome to RBAC App</h2>} />
          <Route path="/users" element={<UserManagement />} />
          <Route path="/roles" element={<RoleManagement />} />
          <Route path="/permissions" element={<Permissions />} />
         
        </Routes>
      </div>
    </Router>
  );
};

export default App;

