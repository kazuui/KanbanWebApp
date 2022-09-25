import React,  { createContext, useState , useEffect , useContext } from "react";

//Context
// import AuthContext from "./authContext"

const ApplicationContext = createContext();

export default ApplicationContext;

export const ApplicationProvider = ({ children, ...rest }) => {

  const [GroupsArray, setGroupsArray] = useState([]);
  const [currApplication, setCurrApplication] = useState("");
  const [currentAppData, setCurrentAppData] = useState("");

  return(
    <ApplicationContext.Provider value={{ GroupsArray , setGroupsArray , currApplication, setCurrApplication, currentAppData, setCurrentAppData}}>
        {children}
    </ApplicationContext.Provider>
  )
}