import React, { useState, useEffect ,  useContext } from "react";
import { Link } from 'react-router-dom';
import { useNavigate } from "react-router-dom";

import AuthContext from "../context/authContext"

function NavBar() {
  // const { setThisUserID } = useContext(AuthContext);

  const [userData,  setUserData] = useState({});

  // useEffect(() => {
  //   const data = JSON.parse(sessionStorage.getItem("user"));
  //   setUserData(data);
  // });

  const doLogout  = () => {
    sessionStorage.clear();
    // setThisUserID("");
  }

  const navIcon = () => {
    if(!userData){
      return(
        <h4 className="my-0 mr-md-auto font-weight-normal no-underline">
          <Link to="/" className="text-white">{" "}Kanban App{" "}</Link>
        </h4>
      )
    } else {
      return(
        <h4 className="my-0 mr-md-auto font-weight-normal no-underline">
        <Link to="/home" className="text-white">{" "}Kanban App{" "}</Link>
      </h4>
      )
    }
  }

  const authLink = () =>{
    if(!userData){
      return (
        <div>
          <Link to="/" className="text-white navBarLink nav-link">{" "}Login</Link>
        </div>
      )
    } else {

      if(userData.role === "admin"){
        return (
          <div>

            <ul className="nav">
              <li className="nav-item">
                <Link to="/profile" className=" text-white navBarLink nav-link">{" "}Profile{" "}</Link>
              </li>
              <li className="nav-item">
                <Link to="/users" className="text-white navBarLink nav-link">{" "}User Management{" "}</Link>
              </li>
              <li className="nav-item">
                <Link to="/groups" className="text-white navBarLink nav-link">{" "}Group Management</Link>
              </li>
              <li className="nav-item">
                <Link to="/" className="text-white navBarLink nav-link" onClick={doLogout}>{" "}Logout</Link>
              </li>
            </ul>

            {/* <Link to="/profile" className="text-white navBarLink">{" "}Profile{" "}</Link>
            <Link to="/users" className="text-white navBarLink">{" "}User Management{" "}</Link>
            <Link to="/groups" className="text-white navBarLink">{" "}Group Management</Link>
            <Link to="/" className="text-white navBarLink" onClick={doLogout}>{" "}Logout</Link> */}
        </div>
        ) 
      } else {
        return(
          <div>
            <ul className="nav">
              <li className="nav-item">
                <Link to="/profile" className="text-white navBarLink nav-link">{" "}Profile{" "}</Link>
              </li>
              <li className="nav-item">
                <Link to="/" className="text-white navBarLink nav-link" onClick={doLogout}>{" "}Logout</Link>
              </li>
            </ul>
          </div>
        )
      }
    }
  }

  // const navIcon = () => {
  //   if(isLoggedIn !== true){
  //     return(
  //       <h4 className="my-0 mr-md-auto font-weight-normal no-underline">
  //         <Link to="/" className="text-white">{" "}Kanban App{" "}</Link>
  //       </h4>
  //     )
  //   } else {
  //     return(
  //       <h4 className="my-0 mr-md-auto font-weight-normal no-underline">
  //       <Link to="/home" className="text-white">{" "}Kanban App{" "}</Link>
  //     </h4>
  //     )
  //   }
  // }

  // const authLink = () =>{
  //   if(isLoggedIn !== true){
  //     return (
  //       <div>
  //         <Link to="/" className="text-white navBarLink nav-link">{" "}Login</Link>
  //       </div>
  //     )
  //   } else {

  //     if(userAdmin === true){
  //       return (
  //         <div>

  //           <ul className="nav">
  //             <li className="nav-item">
  //               <Link to="/profile" className=" text-white navBarLink nav-link">{" "}Profile{" "}</Link>
  //             </li>
  //             <li className="nav-item">
  //               <Link to="/users" className="text-white navBarLink nav-link">{" "}User Management{" "}</Link>
  //             </li>
  //             <li className="nav-item">
  //               <Link to="/groups" className="text-white navBarLink nav-link">{" "}Group Management</Link>
  //             </li>
  //             <li className="nav-item">
  //               <Link to="/" className="text-white navBarLink nav-link" onClick={doLogout}>{" "}Logout</Link>
  //             </li>
  //           </ul>

  //           {/* <Link to="/profile" className="text-white navBarLink">{" "}Profile{" "}</Link>
  //           <Link to="/users" className="text-white navBarLink">{" "}User Management{" "}</Link>
  //           <Link to="/groups" className="text-white navBarLink">{" "}Group Management</Link>
  //           <Link to="/" className="text-white navBarLink" onClick={doLogout}>{" "}Logout</Link> */}
  //       </div>
  //       ) 
  //     } else {
  //       return(
  //         <div>
  //           <ul className="nav">
  //             <li className="nav-item">
  //               <Link to="/profile" className="text-white navBarLink nav-link">{" "}Profile{" "}</Link>
  //             </li>
  //             <li className="nav-item">
  //               <Link to="/" className="text-white navBarLink nav-link" onClick={doLogout}>{" "}Logout</Link>
  //             </li>
  //           </ul>
  //         </div>
  //       )
  //     }
  //   }
  // }
  
  return (
    <header className="header-bar bg-primary mb-3">
      <div className="container d-flex flex-column flex-md-row align-items-center p-3">
        {navIcon()}
        {/* <div>
          <Link to="/profile" className="text-white navBarLink">{" "}Profile{" "}</Link>
          <Link to="/users" className="text-white navBarLink">{" "}User Management{" "}</Link>
          <Link to="/groups" className="text-white navBarLink">{" "}Group Management</Link>
          <Link to="/" className="text-white navBarLink">{" "}Logout</Link>
        </div> */}
        {authLink()}

      </div>
    </header>
  )
}

export default NavBar