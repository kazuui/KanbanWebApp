import React, { useState, useEffect } from "react";
import Page from '../../components/Page';
// import axios from "axios";

// import {BrowserRouter, Routes, Route} from "react-router-dom"

import ProfileTable from "./ProfileTable";

function Profile() {

  return (
    <Page title="Profile" wide={true}>
      <div className="align-items-center">
        <p className="lead text-muted display-3-center">Your Profile</p>
        <div className="col-lg-12 py-lg-5 center_align">
          
          <p className="display-3-center">Hello there!</p>
          <ProfileTable />

        </div>
      </div>
    </Page>
  )
}

export default Profile;