import React, { useState, useEffect, useContext } from "react";
import { Link } from 'react-router-dom';
import Page from '../../components/Page';
import axios from "axios";

import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

//Context
import AuthContext from "../../context/authContext";
import ApplicationContext from "../../context/appContext"

//Components
import ApplicationBoard from "../../components/Board"
import CreateAppModal from "../../components/Modals/createAppModal"
import CreatePlanModal from "../../components/Modals/createPlanModal"
import ApplicationModal from "../../components/Modals/appModal"
import PlanModal from "../../components/Modals/planInfoModal"

function Home() {
  document.title = `Home | Task Management App`;

  const { userAccessRights, thisUsername } = useContext(AuthContext);
  const { currApplication, setCurrApplication, setGroupsArray, currentAppData, setCurrentAppData } = useContext(ApplicationContext);

  //User is in "Lead" group
  const [isInLead, setIsInLead] = useState(false);
  
  // const [firstApp, setFirstApp] = useState("");
  const [currentAppTasks, setCurrentAppTasks] = useState([]);
  const [currentAppPlans, setCurrentAppPlans] = useState([]);
  const [currentAppRights, setCurrentAppRights] = useState([]);

  //View App Info Modal
  const [allApplicationArray, setAllApplicationArray] = useState("");
  const [showAppInfo, setShowAppInfo] = useState(false);

  //View Plan Info Modal
  const [showPlanInfo, setShowPlanInfo] = useState(false);
  const [displayedPlans, setDisplayedPlans] = useState([]);

  //Application selector
  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
      },
    },
  };

  const [allApplication, setAllApplication] = React.useState([]);

  useEffect(() => {
    const fetchAll = async () => {
      await Promise.all([
        fetchAllApps(),
        fetchAllGroups(),
        checkLead(),
      ]);
    };
    fetchAll();
  }, []);

  // Fetch current app task when application changes
  useEffect(() => {
    fetchCurrentAppTask();
    fetchCurrentAppPlan();
    getCurrentAppRights();
    getCurrentAppData(currApplication);
  }, [currApplication]);

  const updateApps = async(username) => {
    await userAccessRights(username, "update")
    await fetchAllApps();
    //Wait for rights after update
    await getCurrentAppRights();
  };

  const updatePlans = async() => {
    fetchCurrentAppPlan();
  };

  const updateTasks = async() => {
    fetchCurrentAppTask();
  };

  const fetchAllApps = async() => {
    //Get all apps
    var firstApp

    const data = await fetch('/apps'); //fetching data from port 5000 on proxy
    const apps = await data.json();
    setAllApplicationArray(apps);

    if(apps){
      firstApp = ((apps[0]).app_acronym);
    }

    //Set first app as current
    if(!currApplication){
      setCurrApplication(firstApp);
      getCurrentAppData(firstApp);
    }

    //Set array of apps (for app select)
    var appsArray = apps.map(function(apps) {
      return apps['app_acronym'];
    });
    setAllApplication(appsArray);
    // accessRights(apps);
  };

  const fetchAllGroups = async() => {
    //Get all groups
    const data2 = await fetch('/groups'); //fetching data from port 5000 on proxy
    const groups = await data2.json();

    var groupArray = groups.map(function(group) {
      return group['group_name'];
    });
    setGroupsArray(groupArray);
  }

  const fetchCurrentAppTask = async() => {
    if(currApplication){
      const data = await fetch(`/apps/tasks/${currApplication}`); //fetching data from port 5000 on proxy
      setCurrentAppTasks(await data.json());
      // console.log(application, " " , currentAppTasks);
    }
  };

  const fetchCurrentAppPlan = async() => {
    if(currApplication){
      const data = await fetch(`/apps/plans/${currApplication}`); //fetching data from port 5000 on proxy
      setCurrentAppPlans(await data.json());
      // console.log(application, " " , currentAppPlans);
    }
  };

  const getCurrentAppData = async(currApp) =>{
    if(allApplicationArray){
      const currAppArr = await allApplicationArray.filter((app) => {
        return app.app_acronym === currApp;
      });
      setCurrentAppData(currAppArr[0]);
    }
  }
  
  const getCurrentAppRights = async() => {
    let sessionRights = await JSON.parse(sessionStorage.getItem('accessRights'));
    if (sessionRights){
      const appRights = await sessionRights.find((app) => app.app === currApplication);
      setCurrentAppRights(appRights);
    }
  }

  const checkLead = async()=>{
    let username = await (JSON.parse(sessionStorage.getItem('user'))).username;
    const response = await axios.post('/check-lead', {
      username
    })
    setIsInLead(response.data)
  }

  const handleAppChange = (event) => {
    setCurrApplication(event.target.value);
  };

  //Show task info modal
  const handleShowAppInfo = () => {
    if(showAppInfo){
      setShowAppInfo(false)
    } else{
      setShowAppInfo(true);
    }
  };

  //Show plan info modal
  const handleShowPlanInfo = (plan) => {
    if(showPlanInfo){
      setShowPlanInfo(false)
    } else{
      setShowPlanInfo(true);
      setDisplayedPlans(plan)
    }
  };

  // console.log(currentAppData);
  // console.log(currentAppRights.open);

  return (
    <div className="py-md-2">
      <div className="align-items-center">
        <p className="lead text-muted display-3-center">What's currently happening...</p>
        <p className="display-3-center">{JSON.parse(sessionStorage.getItem("user")).username}</p>
        {/* <div className="col-lg-12 py-lg-3 center_align">
        <p className="display-3-center">Kanban board here</p>
        </div> */}
      </div>
      <div className="doFlex">
        {/* Application Panel */}
        <div className="col-lg-2 application-panel">
          {/* Create App */}
          <button disabled={
            !isInLead
            ? true
            : false 
          } type="button" className="btn btn-add btn-lg btn-block create-app" 
          data-bs-toggle="modal" data-bs-target="#createAppModal">+</button>
          <CreateAppModal update={updateApps}/>

          {/* Application selector */}
          <div className="py-md-3">
            <FormControl fullWidth>
              <InputLabel id="demo-multiple-name-label">Current Application</InputLabel>
              <Select
                labelId="demo-multiple-name-label"
                id="demo-multiple-name"
                value={currApplication}
                onChange={handleAppChange}
                input={<OutlinedInput label="Current Application" />}
                MenuProps={MenuProps}
              >
                {allApplication.map((app) => (
                  <MenuItem key={app} value={app}>
                    {app}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>

          {/* Edit App */}
          <button type="button" className="btn btn-primary btn-lg btn-block"
          onClick={handleShowAppInfo}>
            View App
          </button>
          {!currentAppData
            ? ""
            : <ApplicationModal showModal={showAppInfo} handleShowModal={handleShowAppInfo} appData={currentAppData} update={updateApps} isInLead={isInLead}/>}

          {/* Plans */}
          <h5 className="create-text">Current Plans:</h5>
          <button disabled={
            !currentAppRights
              ?true
              :currentAppRights.open === true
                ?false
                :true
          } type="button" className="btn btn-add btn-lg btn-block create-app" 
          data-bs-toggle="modal" data-bs-target="#createPlanModal">+</button>
          <CreatePlanModal update={updatePlans}/>

          <div className="py-lg-3 center_align text-align-center">
          {currentAppPlans.map((plan) => {
            return(
              <button className="btn btn-secondary btn-lg btn-block" onClick={()=> handleShowPlanInfo(plan)}>{" "}{plan.plan_MVP_name}{" "}</button>
            )
          })}
          </div>
          {
            !displayedPlans
              ? ""
              : <PlanModal showModal={showPlanInfo} handleCloseModal={handleShowPlanInfo} planInfo={displayedPlans}/>
          }
        </div>
        <div className="col-lg-8 py-lg-4">
          <ApplicationBoard tasks={currentAppTasks} update={updateTasks} plans={currentAppPlans} accessRights={currentAppRights}/>
        </div>
      </div>
    </div>
  )
}

export default Home;