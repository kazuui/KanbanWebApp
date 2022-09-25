import React, { useEffect } from "react"
import Page from '../../components/Page';

function Unauthorized() {
  return (
    <Page title="Login">
      <div className="align-items-center">
        <h1 className="display-3 display-3-center center_align">Unauthorized</h1>
        {/* <p className="lead text-muted display-3-center">Please log in.</p> */}
      </div>
    </Page>
  )
}

export default Unauthorized