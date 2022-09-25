import React, { useState, useEffect } from "react";
import {BrowserRouter, Routes, Route , Outlet } from "react-router-dom"
import './App.css';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css'
// import { useImmerReducer } from "use-immer";

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

//Context
import { AuthProvider } from "./context/authContext";
import { ApplicationProvider } from "./context/appContext";
import { ModalProvider } from "./context/modalContext";

// Components
import PrivateRoutes from "./utils/PrivateRoute";
import Unauthorized from "./pages/Unauthorized/Unauthorized";
import PageNotFound from "./pages/Unauthorized/PageNotFound";
import NavBar from './components/NavBar';
import Login from "./pages/Login/Login"
import Footer from "./components/Footer"
import Home from "./pages/Home/Home"
import Profile from "./pages/Profile/Profile"
import UserManagement from "./components/UserManagement"
import GroupManagement from "./components/GroupManagement"
import UpdateUser from "./components/updateUser"
import CreateUser from "./components/createUser"
import ApplicationBoard from "./components/Board"
import Testing from "./pages/Testing";


function App() {

  return (
    <AuthProvider>
    <ModalProvider>
    <ApplicationProvider>
    <BrowserRouter>
      <ToastContainer />
      <NavBar/>
      <Routes>
        {/* Public */}
        <Route path="/" element={<Login />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="*" element={<PageNotFound />} />
        {/* Testing Modal */}
        <Route path="/test" element={<Testing/>} />

        
        {/* Protected all users */}
        <Route element={<PrivateRoutes allowedRoles={["admin", "user"]}/>}>
          <Route path="/home" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/users/update/:id" element={<UpdateUser />} />
        </Route>

        {/* Protected admin ONLY */}
        <Route element={<PrivateRoutes allowedRoles={["admin"]}/>}>
          <Route path="/users" element={<UserManagement />} />
          <Route path="/users/create" element={<CreateUser />} />
          <Route path="/groups" element={<GroupManagement/>} />
          {/* <Route path="/app" element={<ApplicationBoard/>} /> */}
        </Route>
      </Routes>
      <Footer />
    </BrowserRouter>
    </ApplicationProvider>
    </ModalProvider>
    </AuthProvider>
  );
}

export default App;