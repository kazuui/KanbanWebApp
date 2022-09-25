import React, { useState, useEffect } from "react";
import Page from './Page';
import axios from "axios";

import GroupTable from './GroupTable';

function GroupManagement(props) {

    //Scroll to Top
    function scrollToTop(){
      window.scrollTo({top: 0, behavior: 'smooth'});
    }

  const [loggedIn, setLoggedIn] = useState();

  return (
    <Page title="Groups" wide={true}>
      <div className="align-items-center">
        <p className="lead text-muted display-3-center">Group Management Table</p>
        <div className="col-lg-12 py-lg-3 center_align">
          
          <GroupTable />

        </div>
      </div>
      <button onClick={scrollToTop} className="scrollTop btn btn-primary" title="Go to top">Scroll up</button>
    </Page>
  )
}

export default GroupManagement;