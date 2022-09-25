import React, {useEffect, useState} from "react";
import {Link} from 'react-router-dom';
import axios from "axios";

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function GroupTable () {

  //Toast
  const notify = (status) => {
    if(status === "success") {
      toast.success('Group created successfully', {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        });
    } else if (status === "warning") {
      toast.warn('Group creation failed', {
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
  
  useEffect( () => {
    fetchGroups();
  }, []);

  const [groupName, setGroupName] = useState("");
  const [Groups, setGroups] = useState([]);

  const fetchGroups = async() => {
    const data = await fetch('/groups'); //fetching data from port 5000 on proxy
    const groups = await data.json();
    setGroups(groups);
  };

  async function doGroupCreate(e) {
    e.preventDefault();
    try{
      const response = await axios.post(`/groups/create`, {
        groupName,
      });
      setTimeout(() => fetchGroups(), 500);
      notify("success");
      document.getElementById("createGroupForm").reset();
    } catch(e){
      notify("warning");
      console.log("There was a problem.")
    }
  };

  return (
    <section>
      <table className="styled-table">
        <thead>
          <tr>
            <th style={{ textAlign: "left" }}>ID</th>
            <th style={{ textAlign: "left" }}>Group Name</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td colSpan={3}>
              <form id="createGroupForm" className="form-size" onSubmit={doGroupCreate}>
                <div className="form-group doFlex">
                <input autoFocus required id="groupName" name="groupName" className="form-control" type="text" autoComplete="off" placeholder="Group name" onChange={(e) =>{ setGroupName(e.target.value) }} />
                <button className="btn btn-primary btn-edit">Create</button>
                </div>
              </form>
            </td>
          </tr>
          {Groups.map((group, index) => {
            return (
              <tr key={group.group_id}>
                <th scope="row">{group.group_id}</th>
                <td>{group.group_name}</td>
                <td></td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </section>
  )
}

export default GroupTable;