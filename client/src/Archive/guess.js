import { createContext, useState , useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

// export default AuthContext;

export const AuthProvider = (props) => {
    // const [user, setUser] = useAuth()
    
    const [isLoggedIn, setIsLoggedIn] = useState("");

  //Login form 
    const doLogin = async(username, password) => {
        try {
            const response = await axios.post('/login', {
                username,
                password
            })
            if (response.data){
                setIsLoggedIn(true);
            }
        }catch{
            console.log("There was a problem.")
        }
    }


//   async function doLogin(username, password) {
//     try{
    // const response = await axios.post('/login', {
    //     username,
    //     password
    // })
    // if (response.data){
    //     setIsLoggedIn(true);
    // }
//     } catch(e){
//     console.log("There was a problem.")
//     }
// };

  return(
    <AuthContext.Provider value={{isLoggedIn, setIsLoggedIn, doLogin}}>
        {props.children}
    </AuthContext.Provider>
  )
}

export default AuthProvider