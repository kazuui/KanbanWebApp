import React, { useState, useEffect, useContext } from "react";

import TaskPanels from "./taskPanel"
import CreateTaskModal from "./Modals/createTaskModal"
import TaskInfoModal from "./Modals/taskInfoModal"

//Context
import AuthContext from "../context/authContext";

function Board(props) {

  const { tasks, update, plans, accessRights, appData } = props;

  //Rights
  const [createRights, setCreateRights] = useState(false)
  const [openRights, setOpenRights] = useState(false)
  const [toDoListRights, setToDoListRights] = useState(false)
  const [doingRights, setDoingRights] = useState(false)
  const [doneRights, setDoneRights] = useState(false)

  //Tasks states
  const [openTasks, setOpenTasks] = useState([]);
  const [toDoListTasks, setToDoListTasks] = useState([]);
  const [doingTasks, setDoingTasks] = useState([]);
  const [doneTasks, setDoneTasks] = useState([]);
  const [closeTasks, setCloseTasks] = useState([]);

  //Current Tasks
  const [displayedTasks, setDisplayedTasks] = useState([]);

  //Current Task Info
  const [taskName, setTaskName] = useState("");
  const [taskPlan, setTaskPlan] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [taskNotes, setTaskNotes] = useState("");
  
  //Promote or Demote
  const [taskAction, setTaskAction] = useState("");

  //View Modal
  const [show, setShow] = useState(false);

  //Show task info modal
  const handleShowTaskInfo = (task, action) => {
    if(show){
      setShow(false)
    } else{
      setShow(true);
      setDisplayedTasks(task);
      setTaskAction(action);

      // const task = tasks.find((task) => task.task_id === e.currentTarget.id);
      //This selected the other elements like <p> rather than the button
      // console.log(e.target)
    }
  };

  //Rights (updates when task changes)
  useEffect(() => {
    const setRights = async () => {
      await Promise.all([
        setCreateRights(accessRights.create),
        setOpenRights(accessRights.open),
        setToDoListRights(accessRights.toDoList),
        setDoingRights(accessRights.doing),
        setDoneRights(accessRights.done)
      ]);
    };
    setRights();
  },[tasks])

  //Seperating current app task to states (updates when task changes)
  useEffect(() => {
    const openArr = tasks.filter((task) => {
      return task.task_state === "open";
    });

    const toDoListArr = tasks.filter((task) => {
      return task.task_state === "toDoList";
    });

    const doingArr = tasks.filter((task) => {
      return task.task_state === "doing";
    });

    const doneArr = tasks.filter((task) => {
      return task.task_state === "done";
    });

    const closeArr = tasks.filter((task) => {
      return task.task_state === "close";
    });
    setOpenTasks(openArr);
    setToDoListTasks(toDoListArr);
    setDoingTasks(doingArr);
    setDoneTasks(doneArr);
    setCloseTasks(closeArr);
  }, [tasks])

  return (
      <div className="doFlex kanban-board">
        {/* Open */}
        <div className="col-lg-3 kanban-panel">
          <h4 className="display-3-center kanban-state state-open">OPEN</h4>

          {/* Create Tasks */}
          <button disabled={!accessRights? true : !accessRights.create? true : false} type="button" className="btn btn-add btn-lg btn-add btn-block" 
          data-bs-toggle="modal" data-bs-target="#createTaskModal">+</button>

          <TaskPanels
          updateTasks={update}
          taskState={openTasks} 
          handleShowModal={handleShowTaskInfo} 
          rights={openRights}
          />

        </div>
        {/* To-do */}
        <div className="col-lg-3 kanban-panel">
          <h4 className="display-3-center kanban-state state-toDoList">TO-DO</h4>

          <TaskPanels
          updateTasks={update}
          taskState={toDoListTasks}
          handleShowModal={handleShowTaskInfo}
          rights={toDoListRights}
          />

        </div>
        {/* Doing */}
        <div className="col-lg-3 kanban-panel">
          <h4 className="display-3-center kanban-state state-doing">DOING</h4>

          <TaskPanels
          updateTasks={update}
          taskState={doingTasks}
          handleShowModal={handleShowTaskInfo}
          rights={doingRights}
          />

        </div>
        {/* Done */}
        <div className="col-lg-3 kanban-panel">
          <h4 className="display-3-center kanban-state state-done">DONE</h4>

          <TaskPanels
          updateTasks={update}
          taskState={doneTasks}
          handleShowModal={handleShowTaskInfo}
          rights={doneRights}
          />

        </div>
        {/* Close */}
        <div className="col-lg-3 kanban-panel">
          <h4 className="display-3-center kanban-state state-close">CLOSE</h4>

          <TaskPanels
          taskState={closeTasks}
          handleShowModal={handleShowTaskInfo}
          />

        </div>

        {/* Modals */}
        <CreateTaskModal plans={plans} updateTasks={update} openRights={openRights}/>
        
        <TaskInfoModal
        plans={plans}
        showModal={show}
        handleCloseModal={handleShowTaskInfo} 
        taskInfo={displayedTasks}
        taskAction={taskAction}
        updateTask={update}
        createRights={createRights}
        openRights={openRights}
        toDoRights={toDoListRights}
        doingRights={doingRights}
        doneRights={doneRights}
        />

      </div>
  )
}

export default Board;