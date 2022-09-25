import React, { useState, useEffect, useContext } from "react";
import axios from "axios";

import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

import { Dialog } from "@mui/material";
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import ListItemText from '@mui/material/ListItemText';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

//Context
import ApplicationContext from "../../context/appContext"

const AppModal = (props) => {
  const { handleShowModal, showModal , appData, update , isInLead} = props;
  const { GroupsArray } = useContext(ApplicationContext);

  //Toast
  const notify = (status) => {
    if(status === "success") {
      toast.success('Task successfully created', {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        });
    } else if (status === "warning") {
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

  //Multi-Selector
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

  const [permitCreate, setPermitCreate] = useState([]);
  const [permitOpen, setPermitOpen] = useState([]);
  const [permitToDoList, setPermitToDoList] = useState([]);
  const [permitDoing, setPermitDoing] = useState([]);
  const [permitDone, setPermitDone] = useState([]);

  useEffect(() => {
    const setPermitInfo = async() =>{
      await Promise.all([
        setPermitCreate(JSON.parse(appData.app_permit_create)),
        setPermitOpen(JSON.parse(appData.app_permit_open)),
        setPermitToDoList(JSON.parse(appData.app_permit_toDoList)),
        setPermitDoing(JSON.parse(appData.app_permit_doing)),
        setPermitDone(JSON.parse(appData.app_permit_done)),
      ])
    }
    setPermitInfo()
  },[appData])

  const handleCreateChange = (event) => {
    const {
      target: { value },
    } = event;

    setPermitCreate(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value,
    );
  };

  const handleOpenChange = (event) => {
    const {
      target: { value },
    } = event;

    setPermitOpen(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value,
    );
  };
  
  const handleToDoListChange = (event) => {
    const {
      target: { value },
    } = event;

    setPermitToDoList(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value,
    );
  };
  
  const handleDoingChange = (event) => {
    const {
      target: { value },
    } = event;

    setPermitDoing(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value,
    );
  };

  const handleDoneChange = (event) => {
    const {
      target: { value },
    } = event;

    setPermitDone(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value,
    );
  };

  //Submit Create Task
  async function handleUpdateApp(e) {
    e.preventDefault();

    let username = await (JSON.parse(sessionStorage.getItem('user'))).username;
    let appAcronym = appData.app_acronym

    try{
      const response = await axios.post('/apps/update', {
        appAcronym,
        permitCreate,
        permitOpen,
        permitToDoList,
        permitDoing,
        permitDone
      });

      if (response.data === "success"){
        update(username);
        handleShowModal();
        // console.log("to do accessRights update");
      }
    } catch {

    }
  }

  return (
    <Modal size="lg" show={showModal} onHide={handleShowModal} >
      <Modal.Header closeButton>
        <Modal.Title>Application Information</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form id="appInfoForm" onSubmit={handleUpdateApp}>
          <div className="form row">
            {/* Left */}
            <div className="col-6">
              <div className="form-row py-lg-3">
                <div className="col-6">
                  <label className="" htmlFor="app-acronym">Application Acronym</label>
                  <input disabled value={appData.app_acronym} id="app-acronym" type="text" className="form-control"/>
                </div>
                <div className="col-6">
                  <label className="" htmlFor="app-Rnumber">Running Number</label>
                  <input disabled value={appData.app_Rnumber} id="app-Rnumber" type="number" className="form-control"/>
                </div>
              </div>
              <div className="form-row py-lg-2">
                <div className="col-6">
                  <label className="" htmlFor="app-startDate">Start Date</label>
                  <input disabled value={appData? (appData.app_startDate).slice(0, 10):""} id="app-startDate" type="date" className="form-control"/>
                </div>
                <div className="col-6">
                  <label className="" htmlFor="app-endDate">End Date</label>
                  <input disabled value={appData? (appData.app_endDate).slice(0, 10):""} id="app-endDate" type="date" className="form-control"/>
                </div>
              </div>
            </div>

            {/* Right */}
            <div className="col-6 py-lg-3">
              <div className="form-group">
                <label htmlFor="app-description">Description</label>
                <textarea disabled value={appData.app_description} className="form-control" id="app-description" rows="5"></textarea>
              </div>
            </div>
          </div>

          <label>Edit Permits</label>
          <div className="form-row">
            <div className="col-4">
              <FormControl>
                <InputLabel id="demo-multiple-name-label">Create</InputLabel>
                <Dialog disableEnforceFocus></Dialog>
                <Select 
                  disabled={
                    !isInLead
                      ? true
                      : false
                  }
                  className="select-form"
                  labelId="multiple-checkbox-label"
                  id="multiple-checkbox"
                  multiple
                  value={permitCreate}
                  onChange={handleCreateChange}
                  input={<OutlinedInput label="Create" />}
                  renderValue={(selected) => selected.join(', ')}
                  MenuProps={MenuProps}
                >
                  {GroupsArray?.map((groups) => {
                    return(
                      <MenuItem key={groups} value={groups}>
                      <Checkbox checked={permitCreate.indexOf(groups) > -1} />
                      <ListItemText primary={groups} />
                      </MenuItem>
                    )
                  })}
                  </Select>
              </FormControl>
            </div>
            <div className="col-4">
              <FormControl>
                <InputLabel id="demo-multiple-name-label">Open</InputLabel>
                <Dialog disableEnforceFocus></Dialog>
                <Select 
                  disabled={
                    !isInLead
                      ? true
                      : false
                  }
                  className="select-form"
                  labelId="multiple-checkbox-label"
                  id="multiple-checkbox"
                  multiple
                  value={permitOpen}
                  onChange={handleOpenChange}
                  input={<OutlinedInput label="Open" />}
                  renderValue={(selected) => selected.join(', ')}
                  MenuProps={MenuProps}
                >
                  {GroupsArray.map((groups) => {
                    return(
                      <MenuItem key={groups} value={groups}>
                      <Checkbox checked={permitOpen.indexOf(groups) > -1} />
                      <ListItemText primary={groups} />
                      </MenuItem>
                    )
                  })}
                  </Select>
              </FormControl>
            </div>
            <div className="col-4">
              <FormControl>
                <InputLabel id="demo-multiple-name-label">To-Do</InputLabel>
                <Dialog disableEnforceFocus></Dialog>
                <Select 
                  disabled={
                    !isInLead
                      ? true
                      : false
                  }
                  className="select-form"
                  labelId="multiple-checkbox-label"
                  id="multiple-checkbox"
                  multiple
                  value={permitToDoList}
                  onChange={handleToDoListChange}
                  input={<OutlinedInput label="To-Do" />}
                  renderValue={(selected) => selected.join(', ')}
                  MenuProps={MenuProps}
                >
                  {GroupsArray.map((groups) => {
                    return(
                      <MenuItem key={groups} value={groups}>
                      <Checkbox checked={permitToDoList.indexOf(groups) > -1} />
                      <ListItemText primary={groups} />
                      </MenuItem>
                    )
                  })}
                  </Select>
              </FormControl>
            </div>
          </div>

          <div className="form-row py-md-4">
            <div className="col-4">
              <FormControl>
                <InputLabel id="demo-multiple-name-label">Doing</InputLabel>
                <Dialog disableEnforceFocus></Dialog>
                <Select 
                  disabled={
                    !isInLead
                      ? true
                      : false
                  }
                  className="select-form"
                  labelId="multiple-checkbox-label"
                  id="multiple-checkbox"
                  multiple
                  value={permitDoing}
                  onChange={handleDoingChange}
                  input={<OutlinedInput label="Doing" />}
                  renderValue={(selected) => selected.join(', ')}
                  MenuProps={MenuProps}
                >
                  {GroupsArray.map((groups) => {
                    return(
                      <MenuItem key={groups} value={groups}>
                      <Checkbox checked={permitDoing.indexOf(groups) > -1} />
                      <ListItemText primary={groups} />
                      </MenuItem>
                    )
                  })}
                  </Select>
              </FormControl>
            </div>
            <div className="col-4">
              <FormControl>
                <InputLabel id="demo-multiple-name-label">Done</InputLabel>
                <Dialog disableEnforceFocus></Dialog>
                <Select 
                  disabled={
                    !isInLead
                      ? true
                      : false
                  }
                  className="select-form"
                  labelId="multiple-checkbox-label"
                  id="multiple-checkbox"
                  multiple
                  value={permitDone}
                  onChange={handleDoneChange}
                  input={<OutlinedInput label="Done" />}
                  renderValue={(selected) => selected.join(', ')}
                  MenuProps={MenuProps}
                >
                  {GroupsArray.map((groups) => {
                    return(
                      <MenuItem key={groups} value={groups}>
                      <Checkbox checked={permitDone.indexOf(groups) > -1} />
                      <ListItemText primary={groups} />
                      </MenuItem>
                    )
                  })}
                  </Select>
              </FormControl>
            </div>
          </div>
        </form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleShowModal}>
          Close
        </Button>
        {
          !isInLead
            ? ""
            : <Button variant="primary" onClick={handleUpdateApp} className="btn btn-primary">
                Update Permits
              </Button>
        }
      </Modal.Footer>
    </Modal>
  );
};

export default AppModal;
