import React, {useEffect, useState , useContext } from "react";
import Page from './Page';
import {Link , useParams, useNavigate} from 'react-router-dom';
import axios from "axios";

import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import ListItemText from '@mui/material/ListItemText';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import AuthContext from "../context/authContext"

function UpdateUser() {

  let Navigate = useNavigate();

  const { isLoggedIn } = useContext(AuthContext);

  const [userData,  setUserData] = useState({});

  useEffect(() => {
    var user = sessionStorage.getItem("user");
    user = JSON.parse(user);
    setUserData(user);
  }, [isLoggedIn])

   //Toast
   const notify = (status) => {
    if(status === "success") {
      toast.success('User successfully updated', {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        });
    } else if (status === "warning") {
      toast.warn('User has not been updated', {
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

  //Update group selection if user is admin
  const updateGroupSelect = () =>{
    if(userData.role === "admin"){
      return (
        <div className="form-group">
          <label>Groups:</label>
          <Select 
            className="select-form2"
            labelId="multiple-checkbox-label"
            id="multiple-checkbox"
            multiple
            value={selectedGroups}
            onChange={handleChange}
            input={<OutlinedInput label="Tag" />}
            renderValue={(selected) => selected.join(', ')}
            MenuProps={MenuProps}
          >
            {allGroups.map((name) => {

              return(
                <MenuItem key={name} value={name}>
                <Checkbox checked={selectedGroups.indexOf(name) > -1} />
                <ListItemText primary={name} />
                </MenuItem>
              )
            })}
          </Select>
        </div>
      ) 
    }
  }

  let { id } = useParams();

  useEffect( () => {
    fetchUser();
  }, []);

  useEffect( () => {
    fetchGroups();
  }, []);


  const [Users, setUsers] = useState([]);

  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [allGroups, setAllGroups] = useState([]);
  const [selectedGroups, setSelectedGroups] = useState([]);

  const [groupInfo, setGroupInfo] = useState([]);
  const [previousGroup, setPreviousGroup] = useState([]);

  const fetchUser = async() => {
    const data = await fetch(`/users/${id}`); //fetching data from port 5000 on proxy
    const users = await data.json();

    const [userData] = users;

    var selectedGroupArray = users.map(function(group) {
      return group['group_name'];
    });

    setUsers(userData);
    setEmail(userData.email);
    setSelectedGroups(selectedGroupArray);
    setPreviousGroup(selectedGroupArray);
  };

  // Remove first item if null
  if(selectedGroups[0] === null){
    const removeNull = selectedGroups.filter(group => {
      return group !== null;
    });

    setSelectedGroups(removeNull);
  }

  const fetchGroups = async() => {
    const data = await fetch('/groups'); //fetching data from port 5000 on proxy
    const groups = await data.json();

    var groupArray = groups.map(function(group) {
      return group['group_name'];
    });

    setGroupInfo(groups);
    setAllGroups(groupArray);
  };


  async function doUpdate(e) {

    e.preventDefault();
    try{

      const response = await axios.post(`/users/update/${id}`, {
        password,
        email,
        // selectedGroups,
      })

      // console.log(response.data);
      if(response.data === "password criteria"){
        notify("password criteria");
      } else {
        if(selectedGroups){

          if (previousGroup){
            //Refresh Group
            const response = await axios.post(`/users/group/${id}`);
          }
  
          for(var i = 0 ; i < selectedGroups.length; i++){
            var currentGroupName = selectedGroups[i]
            var getGroupID = groupInfo.find(x => x.group_name === currentGroupName).group_id;
            try{
              let response = await axios.post(`/users/update-group/${id}`, {
                getGroupID,
              })
            } catch {
              notify("warning");
              console.log("There was a problem.")
            }
          }
        }
        notify("success");
        {
          userData.role === "admin"
            ?Navigate("/users", { replace: true })
            :Navigate("/profile", { replace: true })
        }
      }
    } catch(e){
      notify("warning");
      console.log("There was a problem.")
    }
  };

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

  // const [groupName, setGroupName] = React.useState([]);
  // var getGroupID = groupInfo.find(x => x.group_name === 'Oreo').group_id;
  // console.log(getGroupID);

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;

    setSelectedGroups(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value,
    );
  };

    return (
    <Page title="Update">
      <div className="align-items-center">
        <p className="lead text-muted display-3-center">Update User</p>
        <div className="col-lg-4 py-lg-5 center_align form-user">

          <form onSubmit={doUpdate}>

            <div className="form-group">
              <label>Username</label>
              <input disabled value={Users.username} id="username" name="username" className="form-control" type="text" autoComplete="off" placeholder="Username" />
            </div>
            
            <div className="form-group">
              <label>Password</label>
              <input id="password-create" name="password" className="form-control" type="password" placeholder="New Password" 
              onChange={(e) =>{ setPassword(e.target.value) }}/>
            </div>

            <div className="form-group">
              <label>Email</label>
              <input value={email} id="email" name="email" className="form-control" type="email" placeholder="Email" 
              onChange={(e) =>{ setEmail(e.target.value) }}/>
            </div>

            {updateGroupSelect()}
            
            <button type="submit" className="py-3 mt-4 btn btn-lg btn-success btn-block"> Update </button>

          </form>

        </div>
      </div>
    </Page>
    )
};

export default UpdateUser;