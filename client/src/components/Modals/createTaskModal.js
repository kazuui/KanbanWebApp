import React, { useState, useEffect, useContext } from "react";
import axios from "axios";

import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

//Context
import ApplicationContext from "../../context/appContext"
import AuthContext from "../../context/authContext"

function Modal(props) {

  const { plans , updateTasks, openRights } = props;

  const {  thisUsername } = useContext(AuthContext);
  const { currApplication } = useContext(ApplicationContext);
  const application = currApplication;

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
    } else if (status === "task exists") {
      toast.warn('Task already exists', {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        });
    } else if (status === "no task name") {
      toast.warn('Enter task name', {
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

  const [taskName, setTaskName] = useState("");
  const [addToPlan, setAddToPlan] = useState([]);
  const [taskDescription, setTaskDescription] = useState("");
  const [taskNote, setTaskNote] = useState("");

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

  //Submit Create Task
  async function handleCreateTaskSubmit(e) {
    e.preventDefault();

    let username = await (JSON.parse(sessionStorage.getItem('user'))).username;
    // console.log(application,taskName,addToPlan,taskDescription,taskNote,username)

    try{
      const response = await axios.post('/apps/tasks/create', {
        application,
        taskName,
        addToPlan,
        taskDescription,
        taskNote,
        username
      });

      // console.log(response.data);

      if(response.data === "task exists"){
        notify("task exists");
      }else if(response.data === "no task name"){
        notify("no task name");
        document.getElementById("task-name").focus();
      } else if(response.data === "success"){
        notify("success");
        reloadForm();
        updateTasks();
      }
    }catch{
      notify("warning");
    }
  }

  const handleTaskNameChange = (event) => {
    setTaskName(event.target.value);
    // console.log(taskName);
  };

  const handleTaskDescriptionChange = (event) => {
    setTaskDescription(event.target.value);
  };

  const handlePlanChange = (event) => {
    setAddToPlan(event.target.value);
  };

  const handleTaskNoteChange = (event) => {
    setTaskNote(event.target.value);
  };

  const handleCloseCreateModal = (event) =>{

  };

  //reload form
  async function reloadForm(e) {
    document.getElementById("createTaskForm").reset();
    document.getElementById("task-name").focus();
    setTaskName("");
    setAddToPlan("");
    setTaskDescription("");
    setTaskNote("");
  }

  return (
    // Testing
    <div className="modal fade" id="createTaskModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-lg">
        <div className="modal-content">
            <div className="modal-header">
            <h5 className="modal-title" id="exampleModalLabel">Create New Task</h5>
            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>

            <div className="modal-body">
              <form id="createTaskForm" onSubmit={handleCreateTaskSubmit} autoComplete="off">
                <div className="form row">
                  {/* Left */}
                  <div className="col-6">
                    <div className="form-row py-lg-3">
                      <div className="col-12">
                        <label className="" htmlFor="task-name">Task Name</label>
                        <input required id="task-name" type="text" className="form-control" onChange={handleTaskNameChange}/>
                      </div>
                    </div>
                    <div className="form-row py-lg-2">
                      <div className="col-12">
                        <FormControl fullWidth
                        // disabled={
                        //   !openRights
                        //     ? true
                        //     : false
                        // }
                        >
                          <InputLabel id="demo-multiple-name-label">Add to Plan</InputLabel>
                          <Select
                            labelId="demo-multiple-name-label"
                            id="demo-multiple-name"
                            value={addToPlan.length !== 0 ? addToPlan :"none"}
                            onChange={handlePlanChange}
                            input={<OutlinedInput label="Add to Plan" />}
                            MenuProps={MenuProps}
                          >
                            <MenuItem key={"none"} value={"none"}>None</MenuItem>
                            {plans.map((plan) => (
                              <MenuItem key={plan.plan_MVP_name} value={plan.plan_MVP_name}>
                                {plan.plan_MVP_name}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </div>
                    </div>
                  </div>

                  {/* Right */}
                  <div className="col-6 py-lg-3">
                    <div className="form-group">
                      <label htmlFor="task-description">Task Description</label>
                      <textarea className="form-control" id="task-description" rows="5" onChange={handleTaskDescriptionChange}></textarea>
                    </div>
                  </div>
                </div>

                <div className="form-row">
                  <div className="col-12">

                  <div className="form-group">
                    <label htmlFor="task-note">Notes</label>
                    <textarea className="form-control" id="task-note" rows="5" onChange={handleTaskNoteChange}></textarea>
                  </div>

                    {/* <div className="accordion accordion-flush" id="accordionFlushExample">
                      <div className="accordion-item">
                        <h2 className="accordion-header" id="flush-headingOne">
                          <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseOne" aria-expanded="false" aria-controls="flush-collapseOne">
                            Task Notes
                          </button>
                        </h2>
                        <div id="flush-collapseOne" className="accordion-collapse collapse" aria-labelledby="flush-headingOne" data-bs-parent="#accordionFlushExample">
                          <div className="accordion-body">
                            <textarea className="form-control" id="app-description" rows="5" defaultValue="Hello" disabled></textarea>
                          </div>
                        </div>
                      </div>
                    </div> */}

                  </div>
                </div>

              </form>
            </div>

            <div className="modal-footer">
            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={handleCloseCreateModal}>Close</button>
            <button type="submit" form="createTaskForm" className="btn btn-primary">Create</button>
            </div>
        </div>
        </div>
    </div>
  )
}

export default Modal;