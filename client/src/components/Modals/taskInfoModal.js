import React, { useState, useEffect, useContext } from "react";
import axios from "axios";

import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import ListItemText from '@mui/material/ListItemText';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function TaskInfoModal(props) {

   //Toast
   const notify = (status, taskName) => {
    if(status === "success") {
      toast.success(`"${taskName}" ${taskAction}d`, {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        });
    } else if (status === "plan change") {
      toast.success(`"${taskName}" plan changed`, {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        });
    } else if (status === "desc change") {
      toast.success(`"${taskName}" description changed`, {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        });
    } else if (status === "plan desc") {
      toast.success(`"${taskName}" information changed`, {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        });
    } else if (status === "note add") {
      toast.success(`"${taskName}" new note added`, {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        });
    } else if (status === "no changes") {
      toast.warn('Nothing was updated', {
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

  const { showModal, handleCloseModal , taskInfo, taskAction, updateTask, plans, openRights, createRights, toDoRights, doingRights, doneRights } = props;

  const [application, setApplication] = React.useState('');
  const [taskDescription, setTaskDescription] = useState("");
  const [taskNote, setTaskNote] = useState("");
  const [addToPlan, setAddToPlan] = useState([]);

   //Plan selector
   const ITEM_HEIGHT = 48;
   const ITEM_PADDING_TOP = 8;
   const MenuProps = {
     PaperProps: {
       style: {
         maxHeight: ITEM_HEIGHT * 3.5 + ITEM_PADDING_TOP,
         width: 250,
       },
     },
   };

  const handleDescriptionChange = (event) => {
    setTaskDescription(event.target.value);
  };

  const handleNotesChange = (event) => {
    setTaskNote(event.target.value)
  };

  const handlePlanChange = (event) => {
    const {
      target: { value },
    } = event;

    setAddToPlan(value);
  };

  // console.log(taskInfo);

  const handleMoveTask = async (event) => {

    let username = await (JSON.parse(sessionStorage.getItem('user'))).username;
    let application = taskInfo.task_app_acronym
    let taskID = taskInfo.task_id
    let updateType = taskAction
    let taskName = taskInfo.task_name
    let currentState = taskInfo.task_state
    let taskCreator = taskInfo.task_creator

    const response = await axios.post('/apps/tasks/move', {
      username,
      application,
      updateType,
      currentState,
      taskID,
      taskName,
      addToPlan,
      taskDescription,
      taskNote
    })

    if (response.data === "success"){
      notify("success", taskName);
      updateTask()
      handleCloseModal()
      reloadForm()

      if (updateType === "promote" && currentState === "doing"){
        const sendEmail = await axios.post('/task/send-email', {
          application,
          username,
          taskCreator,
          taskName,
          taskNote
        })
        console.log(sendEmail.data);
      }

    } else {
      notify("warning", taskName);
    }

    // setApplication(event.target.value);
  };

  const handleUpdateTaskInfo = async (event) => {
    let username = await (JSON.parse(sessionStorage.getItem('user'))).username;
    let application = taskInfo.task_app_acronym
    let taskID = taskInfo.task_id
    let taskName = taskInfo.task_name
    let currentState = taskInfo.task_state

    const response = await axios.post('/apps/tasks/update', {
      username,
      application,
      currentState,
      taskID,
      taskName,
      addToPlan,
      taskDescription,
      taskNote
    });

    console.log(response.data)

    if(response.data === "no changes"){
      notify("no changes", taskName);
    } else if (response.data === "plan change") {
      reloadForm()
      notify("plan change", taskName);
      updateTask()
      handleCloseModal()
    } else if (response.data === "desc change") {
      reloadForm()
      notify("desc change", taskName);
      updateTask()
      handleCloseModal()
    } else if (response.data === "plan desc") {
      reloadForm()
      notify("plan desc", taskName);
      updateTask()
      handleCloseModal()
    } else if (response.data === "note add") {
      reloadForm()
      notify("note add", taskName);
      updateTask()
      handleCloseModal()
    } else {
      notify("warning", taskName);
    }
  };

   //reload form
  async function reloadForm() {
    setTaskDescription("");
    setTaskNote("");
    // document.getElementById("app-notes").focus();
  }

  const submitButton = ()=>{
    return(
      <Button variant="primary" onClick={handleUpdateTaskInfo}>
        Save Changes
      </Button>
    )
  }

  return (
    <Modal size="lg" show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>
            {taskAction === "promote"
              ? "Promote Task"
              : taskAction === "demote"
                ? "Demote Task"
                : "Task Information"
            }
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form id="updateForm">
            <div className="form row  py-lg-2">
              {/* Left */}
              <div className="col-6">
                <div className="form-row">
                  <div className="col-12">
                    <label className="" htmlFor="task-name">Task Name</label>
                    <input disabled id="task-name" type="text" value={taskInfo.task_name} className="form-control"/>
                  </div>
                </div>
                <div className="form-row">
                  <div className="col-12 py-lg-2">
                    <label className="" htmlFor="task-id">Task ID</label>
                    <input disabled id="task-id" type="text" value={taskInfo.task_id} className="form-control"/>
                  </div>
                </div>
                <div className="form-row">
                  <div className="col-12 py-lg-3">
                    {/* <label className="" htmlFor="task-plan-name">Plan</label>
                    <input disabled={taskInfo.task_state === "open"? "" : true} id="task-plan-name" type="text" value={taskInfo.task_plan} className="form-control"/> */}
                    <FormControl fullWidth 
                    disabled={
                      !openRights
                        ? true
                        : taskInfo.task_state === "open"
                          ? false
                          : true
                    }>
                      <InputLabel id="demo-multiple-name-label">Add to Plan</InputLabel>
                      <Select 
                        className="select-form2"
                        labelId="multiple-checkbox-label"
                        defaultValue={taskInfo.task_plan? taskInfo.task_plan : "none"}
                        onChange={handlePlanChange}
                        input={<OutlinedInput label="Add to Plan" />}
                        // renderValue={(selected) => selected.join(', ')}
                        MenuProps={MenuProps}
                      >
                        <MenuItem key={"none"} value={"none"}>
                          <ListItemText primary={"None"} />
                        </MenuItem>
                        {plans.map((plan) => {
                          return(
                            <MenuItem key={plan.plan_MVP_name} value={plan.plan_MVP_name}>
                            <ListItemText primary={plan.plan_MVP_name} />
                            </MenuItem>
                          )
                        })}
                      </Select>
                    </FormControl>
                  </div>
                </div>
              </div>
              
              {/* Right */}
              <div className="col-6">
                <div className="form-group">
                  <label htmlFor="task-description">Task Description</label>
                  <textarea 
                  disabled={
                    taskInfo.task_state === "close"
                      ? true
                      : taskInfo.task_state === "open" && openRights
                        ? false
                        : taskInfo.task_state === "toDoList" && toDoRights
                          ? false
                          : taskInfo.task_state === "doing" && doingRights
                            ? false
                            : taskInfo.task_state === "done" && doneRights
                              ? false
                              :true
                  }
                  className="form-control task-description" id="task-description" rows="8" 
                  defaultValue={taskInfo.task_description? taskInfo.task_description : ""}
                  onChange={handleDescriptionChange}
                  ></textarea>
                </div>
              </div>
            </div>
            
            <div className="form-row">
              <div className="col-12">
                <label htmlFor="app-notes">Notes</label>
                <textarea autoFocus className="form-control" id="app-notes" rows="4"
                onChange={handleNotesChange}
                ></textarea>
              </div>
              <div className="col-12 py-lg-3">
                <div className="accordion accordion-flush" id="accordionFlushExample">
                  <div className="accordion-item">
                    <h2 className="accordion-header" id="flush-headingOne">
                      <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseOne" aria-expanded="false" aria-controls="flush-collapseOne">
                        Task Notes
                      </button>
                    </h2>
                    <div id="flush-collapseOne" className="accordion-collapse collapse" aria-labelledby="flush-headingOne" data-bs-parent="#accordionFlushExample">
                      <div className="accordion-body">
                        <textarea disabled className="form-control" id="app-description" rows="8" defaultValue={taskInfo.task_notes}></textarea>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
          {/* Button for saving in open state */}
          {
            taskAction
              ?""
              :taskInfo.task_state === "close"
              ? submitButton()
              : taskInfo.task_state === "open" && openRights
                ? submitButton()
                : taskInfo.task_state === "toDoList" && toDoRights
                  ? submitButton()
                  : taskInfo.task_state === "doing" && doingRights
                    ? submitButton()
                    : taskInfo.task_state === "done" && doneRights
                      ? submitButton()
                      :""
          }
          {/* Button for promote & demote */}
          {
            !taskAction
              ? ""
              : <Button variant="primary" 
              onClick={taskAction
                ? handleMoveTask
                : handleUpdateTaskInfo
              }>
                {taskAction === "promote"
                ? "Promote Task"
                : "Demote Task"
              }
              </Button>
          }

          {/* Original */}
          {/*
            taskInfo.task_state === "close"
              ? ""
              :<Button variant="primary" 
              onClick={taskAction
                ? handleMoveTask
                : handleUpdateTaskInfo
              }>
                {taskAction === "promote"
                ? "Promote Task"
                : taskAction === "demote"
                  ? "Demote Task"
                  : "Save Changes"
              }
              </Button>
            */
          }
        </Modal.Footer>
      </Modal>
  )
}

export default TaskInfoModal;