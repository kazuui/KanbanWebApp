import React, {useEffect, useState} from "react";
import {Link} from 'react-router-dom';
// import Page from "./Page";
import axios from "axios";
import 'bootstrap';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function UserTable (props) {

  //Toast
  const notify = (status) => {
    if(status === "success") {
      toast.success('User successfully deactivated', {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        });
    } else if (status === "warning") {
      toast.warn('User is already deactivated', {
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
  
  //Get users
  useEffect( () => {
    fetchUser();
  }, []);

  const [Users, setUsers] = useState([]);

  const fetchUser = async() => {
    const data = await fetch('/users'); //fetching data from port 5000 on proxy
    const users = await data.json();
    setUsers(users);
  };

  // Deactivate user status
  async function deactivateUser(id) {

    if (window.confirm("Confirm deactivation ?")) {
      try{
        const response = await axios.post(`/users/deactivate/${id}`);

        if (response.data === "success"){
          setTimeout(() => fetchUser(), 500);
          notify("success");
        }else {
          setTimeout(() => fetchUser(), 500);
          notify("warning");
        }

      } catch(id){
        console.log("There was a problem.")
      }
    }

  };

  //Scroll to Top
  function scrollToTop(){
    window.scrollTo({top: 0, behavior: 'smooth'});
  }
  
  return (
    <section>
      <div id="liveAlertPlaceholder"></div>

      <table className="styled-table table-width">
        <thead>
          <tr>
            <th style={{ textAlign: "left" }}>ID</th>
            <th style={{ textAlign: "left" }}>Username</th>
            <th style={{ textAlign: "left" }}>Email</th>
            <th style={{ textAlign: "left" }}>Groups</th>
            <th style={{ textAlign: "left" }}>Status</th>
            <th style={{ textAlign: "left" }}>Settings</th>
          </tr>
        </thead>
        <tbody>
        <tr>
            <td> </td>
            <td> </td>
            <td> </td>
            <td> </td>
            <td> </td>
            <td>
              <Link to={`/users/create`}>
                <button className="btn btn-primary">Create User</button>
              </Link>
            </td>
          </tr>
          {Users.map((user, index) => {

            if (user.status === 0) {
              user.status = "inactive";
            } else if (user.status === 1){
              user.status = "active";
            }

            return (
              <tr key={user.user_id}>
                <th scope="row">{user.user_id}</th>
                <td>{user.username}</td>
                <td>{user.email}</td>
                <td>{user.group}</td>
                <td>{user.status}</td>
                <td>
                  <Link to={`/users/update/${user.user_id}`}>
                    <button className="btn btn-primary btn-edit">Edit</button>
                  </Link>

                    <button className="btn btn-danger btn-delete" 
                    onClick={() => deactivateUser(user.user_id)}>Deactivate</button>

                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
      <button onClick={ scrollToTop} className="scrollTop btn btn-primary" title="Go to top">Scroll up</button>
    </section>
  )
}

export default UserTable;