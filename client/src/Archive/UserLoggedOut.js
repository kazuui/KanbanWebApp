import React, {useEffect, useState} from "react";
import axios from "axios";

function UserLoggedOut(props) {

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  async function doLogin(e) {
    e.preventDefault();
    try{
      const response = await axios.post('/login', {
        username,
        password
      })
      // console.log(response.data);
    } catch(e){
      console.log("There was a problem.")
    }
  };

  return (
    <form onSubmit={doLogin}>
      <div className="form-group">

        

        <input id="username" name="username" className="form-control" type="text" autoComplete="off" placeholder="Username" onChange={(e) =>{
          setUsername(e.target.value);
        }}/>
      </div>

      <div className="form-group">
        <input id="password-login" name="password" className="form-control" type="password" placeholder="Password" onChange={(e) =>{
          setPassword(e.target.value);
        }}/>
      </div>

      <button type="submit" className="py-3 mt-4 btn btn-lg btn-success btn-block" onClick={doLogin}> Login</button>

    </form>
  )
}

export default UserLoggedOut