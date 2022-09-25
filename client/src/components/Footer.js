import React, { useContext } from "react";
import {Link} from 'react-router-dom';

import AuthContext from "../context/authContext"

function Footer() {

  const {doLogin, isLoggedIn, setLoggedIn, userAdmin, setUserAdmin} = useContext(AuthContext);

  const authFooter = () => {
    if(isLoggedIn !== true) {
      return(
        <span>
          <p> <Link to="/" className="mx-1"> Home </Link></p>
          <p className="m-0"> Copyright &copy; {new Date().getFullYear()} {" "} <Link to="/" className="text-muted"> Kanban App </Link>. All rights reserved. </p>
        </span>
      )
    } else {
      return(
        <span>
          <p> <Link to="/home" className="mx-1"> Home </Link>{" "}|
          <Link className="mx-1" to="/app"> Application</Link></p>
          <p className="m-0"> Copyright &copy; {new Date().getFullYear()} {" "} <Link to="/" className="text-muted"> Kanban App </Link>. All rights reserved. </p>
        </span>
      )
    }
  }

  return (
  <footer className="border-top text-center small text-muted py-3">
    {authFooter()}
    {/* <p> <Link to="/" className="mx-1"> Home </Link>{" "}|
    <Link className="mx-1" to="/home"> Logged In</Link></p>
    <p className="m-0"> Copyright &copy; {new Date().getFullYear()} {" "} <Link to="/" className="text-muted"> ComplexApp </Link>. All rights reserved. </p> */}
  </footer>
  )
}

export default Footer;