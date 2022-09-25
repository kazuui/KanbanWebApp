import React, { useState, useEffect ,  useContext } from "react";
import { Link } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import axios from "axios";

//Context
import AuthContext from "../context/authContext"
import ApplicationContext from "../context/appContext"

function NavBar(props) {

  const { auth, thisUserID, setThisUserID , isLoggedIn, setIsLoggedIn } = useContext(AuthContext);
  const { setCurrApplication } = useContext(ApplicationContext);

  const [userData,  setUserData] = useState({});

  useEffect(() => {
    var user = sessionStorage.getItem("user");
    user = JSON.parse(user);
    setUserData(user);
  }, [isLoggedIn])

  const doLogout  = () => {
    sessionStorage.clear();
    setThisUserID("");
    setCurrApplication("");
    setUserData({});
    setIsLoggedIn(false);
  }

  const getUserOfSpecificGroup = async() =>{
    let groupName = "Project Lead"

    const response = await axios.post('/groups/users', {
      groupName
    })
    console.log(response.data)
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
      // console.log(userData.role)
      if(userData.role === "admin"){
        return (
          <div>
            <ul className="nav">
              {/* <button onClick={getUserOfSpecificGroup}>
                Group
              </button> */}
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
          </div>
        ) 
      } else {
        return(
          <div>
            <ul className="nav">
              {/* <button onClick={getUserOfSpecificGroup}>
                Group
              </button> */}
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
  
  return (
    <header className="header-bar bg-primary mb-3">
      <div className="container d-flex flex-column flex-md-row align-items-center p-3">
        {navIcon()}
        {authLink()}
      </div>
    </header>
  )
}

export default NavBar