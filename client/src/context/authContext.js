import { createContext, useState , useEffect } from "react";
import axios from "axios";
import jwt_decode from "jwt-decode";

//Toast
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AuthContext = createContext();

// export default AuthContext;

export const AuthProvider = ({ children, ...rest }) => {

  //Toast
  const notify = (status) => {
    if (status === "warning") {
      toast.warn('Wrong username/password', {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        });
    } else if (status === "deactivated") {
      toast.warn('Something went wrong', {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        });
    }
  }

  //Check admin
  const [userRole, setUserRole] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState("");
  const [auth, setAuth] = useState({});
  const [thisUserID, setThisUserID] = useState("");
  const [userInfo, setUserInfo] = useState("");
  const [thisUsername, setThisUsername] = useState("");

  //Permit access rights
  // const [userAccess, setUserAccess] = useState("");

  useEffect(() =>{
    const setUsername = async () => {
      let session = await JSON.parse(sessionStorage.getItem('user'));
      if(session){
        setThisUsername(session.username);
      }
    }
  },[])

  //Login form 
  async function doLogin(username, password) {

    try{
    const response = await axios.post('/login', {
        username,
        password
    })

    if(response.data === "Wrong password/username"){
      notify("warning");
    } else if (response.data === "deactivated"){
      notify("deactivated");
    }else if (response.data.token){
      setIsLoggedIn(true);

      const role = response.data.role;
      const token = response.data.token;
      sessionStorage.setItem('user', JSON.stringify({
        username,
        token,
        role
      }))

      userAccessRights(username);

      setUserRole(role);
      setAuth({username : username , role: role , token : token});
      setUserInfo(response.data);
      setThisUserID(response.data.user_id);
      return(true);
    }

    } catch(e){
    console.log("There was a problem.")
    }
  };

  const userAccessRights = async(username, update) =>{
    //Access rights
    if(!sessionStorage.getItem('accessRights')) {
      const accessRes = await axios.post('/apps/access', {
        username
      })
      sessionStorage.setItem('accessRights', JSON.stringify(accessRes.data)); 
    } else if (sessionStorage.getItem('accessRights') && update === "update"){
      //Updating when new app created
      sessionStorage.removeItem('accessRights')

      //New access
      const accessRes = await axios.post('/apps/access', {
        username
      })
      sessionStorage.setItem('accessRights', JSON.stringify(accessRes.data));
    }
  }

  return(
    <AuthContext.Provider value={{ doLogin , auth , setAuth , thisUserID, setThisUserID , userRole, isLoggedIn, setIsLoggedIn, thisUsername, userAccessRights }}>
        {children}
    </AuthContext.Provider>
  )
}

export default AuthContext;