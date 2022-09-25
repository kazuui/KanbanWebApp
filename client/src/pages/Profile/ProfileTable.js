import React, {useEffect, useState , useContext } from "react";
import {Link} from 'react-router-dom';
// import Page from "./Page";
import axios from "axios";
import 'bootstrap';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import AuthContext from "../../context/authContext"

function ProfileTable (props) {

  const { thisUserID , auth } = useContext(AuthContext);

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
  const [Users, setUsers] = useState([]);

  useEffect( () => {
    fetchUser();
  }, []);

  const fetchUser = async() => {
    const data = await fetch(`/users/${thisUserID}`); //fetching data from port 5000 on proxy
    const users = await data.json();

    const userProfile = [users[0]]
    setUsers(userProfile);
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
                    <button className="btn btn-edit btn-primary">Edit</button>
                  </Link>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
      <button onClick={scrollToTop} className="scrollTop btn" title="Go to top">Scroll up</button>
    </section>
  )
}

export default ProfileTable;