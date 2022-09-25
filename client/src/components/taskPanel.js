import React, { useState, useEffect, useContext } from "react";
import axios from "axios";

//Context
import ApplicationContext from "../context/appContext"

function TaskPanel(props) {

  const { updateTasks, taskState, handleShowModal, rights } = props;
  const { currApplication } = useContext(ApplicationContext);
  // document.getElementById("helloHello").style.backgroundColor = "lightblue";

  const handleMoveTask = async (taskInfo, taskAction) => {
    let username = await (JSON.parse(sessionStorage.getItem('user'))).username;
    let updateType = taskAction
    let currentState = taskInfo.task_state

    const response = await axios.post('/apps/tasks/move-state', {
      username,
      updateType,
      taskInfo
    })

    if (response.data === "success"){
      // notify("success", taskName);
      updateTasks()

      if (updateType === "promote" && currentState === "doing"){
        const sendEmail = await axios.post('/task/send-email', {
          username,
          taskInfo
        })
      }
    }
  };

  return (
    taskState.map((task) => {
      
      let state = task.task_state;
      var bgColour = "";

      switch (state) {
        case "open":
          bgColour = "#7376D0"
          break;
        case "toDoList":
          bgColour = "#FF8282"
          break;
        case "doing":
          bgColour = "#FECA65"
          break;
        case "done":
          bgColour = "#5FC656"
          break;
        case "close":
          bgColour = "#646363"
          break;
        default:
          bgColour = "lightblue"
      }

      return(
        <div>
          <div className="task-panel">
          <button id={task.task_id} type="button" className="task-button" 
          onClick={()=>handleShowModal(task)}>
            {/* <button id={task.task_id} type="button" className="task-button" data-bs-toggle="modal" data-bs-target="#taskInfoModal"> */}
              <div className="top-section doFlex">
                <div id="task-colour" className="indicate-colour" style={{ backgroundColor: bgColour }}></div>
                <div className="task-info">
                  <p className="task-owner-name">Owner: {task.task_owner}</p>
                  <p className="plan-name">{task.task_plan? task.task_plan : ''}</p>
                  <h4 className="task-name">{task.task_name}</h4>
                  <p className="task-panel-description">{task.task_description? task.task_description : ' '}</p>
                </div>
              </div>
            </button>
            <div className="task-navigation">
              
              {/* Left button */}
              <button disabled={
                task.task_state==="close"
                  ? true 
                  : task.task_state==="open" 
                    ? true 
                    : task.task_state==="toDoList"
                      ? true
                      :!rights
                        ? true
                        : false
              }
                type="button" className="btn-arrow" 
                onClick={() => handleMoveTask(task,"demote")}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-caret-left-fill" viewBox="0 0 16 16">
                  <path d="m3.86 8.753 5.482 4.796c.646.566 1.658.106 1.658-.753V3.204a1 1 0 0 0-1.659-.753l-5.48 4.796a1 1 0 0 0 0 1.506z"/>
                </svg>
              </button>
              
              {/* Right Button */}
              <button disabled={
                task.task_state==="close"
                  ? true 
                  : !rights
                    ? true
                    : false
              }
                 type="button" className="btn-arrow btn-align-right"
                 onClick={() => handleMoveTask(task,"promote")}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-caret-right-fill" viewBox="0 0 16 16">
                  <path d="m12.14 8.753-5.482 4.796c-.646.566-1.658.106-1.658-.753V3.204a1 1 0 0 1 1.659-.753l5.48 4.796a1 1 0 0 1 0 1.506z"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      )
    })

    // <div>
    //   <div className="task-panel">
    //     <button type="button" className="task-button" data-bs-toggle="modal" data-bs-target="#taskInfoModal">
    //       <div className="top-section doFlex">
    //         <div id="helloHello" className="indicate-colour"></div>
    //         <div className="task-info">
    //           <p className="task-owner-name">Owner: XXXX</p>
    //           <p>Sprint 1</p>
    //           <h4>Task</h4>
    //           <p>Description...</p>
    //         </div>
    //       </div>
    //     </button>
    //     <div className="task-navigation">
          
    //       {/* Left button */}
    //       <button type="button" className="btn-arrow">
    //         <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-caret-left-fill" viewBox="0 0 16 16">
    //           <path d="m3.86 8.753 5.482 4.796c.646.566 1.658.106 1.658-.753V3.204a1 1 0 0 0-1.659-.753l-5.48 4.796a1 1 0 0 0 0 1.506z"/>
    //         </svg>
    //       </button>
          
    //       {/* Right Button */}
    //       <button type="button" className="btn-arrow btn-align-right">
    //         <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-caret-right-fill" viewBox="0 0 16 16">
    //           <path d="m12.14 8.753-5.482 4.796c-.646.566-1.658.106-1.658-.753V3.204a1 1 0 0 1 1.659-.753l5.48 4.796a1 1 0 0 1 0 1.506z"/>
    //         </svg>
    //       </button>
    //     </div>
    //   </div>
    // </div>

    
  )
}

export default TaskPanel;