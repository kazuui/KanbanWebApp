import React, { useEffect } from "react"
import Page from '../../components/Page';

function Unauthorized() {
  return (
    <Page title="Login">
      <div className="align-items-center">
        <h1 className="display-3 display-3-center center_align">Page Not Found</h1>
      </div>
    </Page>
  )
}

export default Unauthorized