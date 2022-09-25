import React, { useState, useEffect , useContext } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import Page from '../../components/Page';
import axios from "axios";

//Context
import AuthContext from "../../context/authContext"
import ApplicationContext from "../../context/appContext"

function Login() {

  const { doLogin } = useContext(AuthContext);
  const {currentAppID, setCurrentAppID, GroupsArray, setGroupsArray} = useContext(ApplicationContext);

  let Navigate = useNavigate();

  //Redirect if user is logged in
  useEffect(() => {
    const data = JSON.parse(sessionStorage.getItem("user"));
    if(data){
      Navigate("/home", { replace: true });
    }
  });
  
  //Login form
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit  = async (e) => {
    e.preventDefault()
    const result = await doLogin(username, password);
    // console.log(result)

    //check if user is logged in
    if(result === true) {
      Navigate("/home", { replace: true });
    }
  }

  //Previous form
  // async function doLogin(e) {
  //   e.preventDefault();
  //   try{
  //     const response = await axios.post('/login', {
  //       username,
  //       password
  //     })
  //     if (response.data){
  //       Navigate("/home", { replace: true });
  //     }
  //   } catch(e){
  //     console.log("There was a problem.")
  //   }
  // };

  return (
    <Page title="Login">
      <div className="align-items-center">
        <h1 className="display-3 display-3-center center_align">Login</h1>
        <p className="lead text-muted display-3-center">To get your tasks sorted.</p>
        <div className="col-lg-4 py-lg-5 center_align">
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <input required id="username" name="username" className="form-control" type="text" autoComplete="off" placeholder="Username" onChange={(e) =>{ setUsername(e.target.value) }}/>
            </div>
            
            <div className="form-group">
              <input required id="password-login" name="password" className="form-control" type="password" placeholder="Password" onChange={(e) =>{
                setPassword(e.target.value) }}/>
            </div>
            
            <button type="submit" className="py-3 mt-4 btn btn-lg btn-success btn-block"> Login</button>

          </form>

        </div>
      </div>
      {/* <div className="display-3-center center_align">
        <p>Lead: admin </p>
        <p>Project Lead: dev1 </p>
        <p>Project Manager: dev2 </p>
        <p>Team Member: dev3</p>
      </div> */}
    </Page>
  )
}

export default Login;