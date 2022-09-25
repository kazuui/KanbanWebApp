import React, { useState, useEffect } from "react";
import Page from './Page';
import axios from "axios";

import UserTable from './UserTable';

function UserManagement() {

  const [loggedIn, setLoggedIn] = useState();

  return (
    <Page title="Users" wide={true}>
      <div className="align-items-center">
        <p className="lead text-muted display-3-center">User Management Table</p>
        <div className="col-lg-12 py-lg-5 center_align">
          
          <UserTable />

        </div>
      </div>
    </Page>
  )
}

export default UserManagement;