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

function PlanInfoModal(props) {

  const { showModal, handleCloseModal , planInfo } = props;

  // const [application, setApplication] = React.useState('');
  // const [taskDescription, setTaskDescription] = useState("");
  // const [taskNote, setTaskNote] = useState("");
  // const [addToPlan, setAddToPlan] = useState([]);

  // console.log(planInfo)

  return (
    <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>
            Plan Info
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <form id="createPlanForm" autoComplete="off">
          <div className="form row">
            {/* Left */}
            <div className="col-12">
              <div className="form-row py-lg-3">
                <div className="col-12">
                  <label className="" htmlFor="plan-name">Plan MVP Name</label>
                  <input disabled value={!planInfo?"":planInfo.plan_MVP_name} id="plan-name" type="text" className="form-control"/>
                </div>
              </div>
              <div className="form-row py-lg-2">
                <div className="col-6">
                  <label className="" htmlFor="app-startDate">Start Date</label>
                  <input disabled value={showModal?(planInfo.plan_startDate).slice(0, 10):""} required id="app-startDate" type="date" className="form-control"/>
                </div>
                <div className="col-6">
                  <label className="" htmlFor="app-endDate">End Date</label>
                  <input disabled value={showModal?(planInfo.plan_endDate).slice(0, 10):""} required id="app-endDate" type="date" className="form-control"/>
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
        </Modal.Footer>
      </Modal>
  )
}

export default PlanInfoModal;