import React, { useState, useEffect } from "react";
import Page from './Page';
import axios from "axios";
import { useNavigate } from 'react-router-dom';

import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import ListItemText from '@mui/material/ListItemText';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// import UserLoggedOut from '../components/UserLoggedOut';

function CreateUser() {

  let Navigate = useNavigate();

  //Toast
  const notify = (status) => {
    if(status === "success") {
      toast.success('User successfully created', {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        });
    } else if (status === "existed") {
      toast.warn('User already exists', {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        });
    } else if (status === "password criteria") {
      toast.warn('Password needs to be between 8 to 10 characters and consists of alphabets , numbers, and special character.', {
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

  const [allGroups, setAllGroups] = useState([]);
  const [addToGroups, setAddToGroups] = useState([]);
  const [groupInfo, setGroupInfo] = useState([]);

  useEffect( () => {
    fetchGroups();
  }, []);

  const fetchGroups = async() => {
    const data = await fetch('/groups'); //fetching data from port 5000 on proxy
    const groups = await data.json();

    var groupArray = groups.map(function(group) {
      return group['group_name'];
    });

    setGroupInfo(groups);
    setAllGroups(groupArray);
  };

  //Create
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  async function doCreate(e) {
    e.preventDefault();
    try{
      const response = await axios.post('/users/create', {
        username,
        password,
        email
      });

      // console.log(response.data);

      if(response.data === "password criteria"){
        notify("password criteria");
      } else {
        if(response.data === "existed") {
          notify("existed");
        } else {
          if(response.data === "success"){
            if (addToGroups){
              for(var i = 0 ; i < addToGroups.length; i++){
                var currentGroupName = addToGroups[i]
                var getGroupID = groupInfo.find(x => x.group_name === currentGroupName).group_id;
                let response = await axios.post(`/users/create/add-to-group`, {
                  username,
                  getGroupID,
                })
              }
            }
            notify("success");
          }
        }
      }

      document.getElementById("createUserForm").reset();
    } catch(e){
      notify("warning");
      console.log("There was a problem.")
    }
  };

  function doGoBack() {
    Navigate("/users", { replace: true });
  }

  //SELECT FIELD
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
  
  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
  
    setAddToGroups(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value,
    );
  };

  return (
    <Page title="Create">
      <div className="align-items-center">
        <p className="lead text-muted display-3-center">Create User</p>
        <div id="liveAlertPlaceholder"></div>
        <div className="col-lg-4 py-lg-5 center_align form-user">
          
          <form onSubmit={doCreate} id="createUserForm">
            <div className="form-group">
              <label>Username:</label>
              <input autoFocus required id="username" name="username" className="form-control" type="text" autoComplete="off" placeholder="Username" onChange={(e) =>{ setUsername(e.target.value) }}/>
            </div>
            
            <div className="form-group">
            <label>Password:</label>
              <input required id="password-create" name="password" className="form-control" type="password" placeholder="Password" onChange={(e) =>{
              setPassword(e.target.value) }}/>
            </div>

            <div className="form-group">
            <label>Email (optional):</label>
              <input id="email" name="password" className="form-control" type="email" placeholder="Email" onChange={(e) =>{
              setEmail(e.target.value) }}/>
            </div>

            <div className="form-group">
            <label>Groups:</label>
              <Select 
                className="select-form2"
                labelId="demo-multiple-checkbox-label"
                id="demo-multiple-checkbox"
                multiple
                value={addToGroups}
                onChange={handleChange}
                input={<OutlinedInput label="Tag" />}
                renderValue={(selected) => selected.join(', ')}
                MenuProps={MenuProps}
              >
                {allGroups.map((name) => {

                  return(
                    <MenuItem key={name} value={name}>
                    <Checkbox checked={addToGroups.indexOf(name) > -1} />
                    <ListItemText primary={name} />
                    </MenuItem>
                  )
                })}
              </Select>
            </div>
            
            <button type="submit" className="py-3 mt-4 btn btn-lg btn-success btn-block"> Create</button>
            <button className="py-3 mt-4 btn btn-lg btn-primary btn-block" onClick={doGoBack}> Back </button>
          </form>

        </div>

      </div>
    </Page>
  )
}

export default CreateUser;