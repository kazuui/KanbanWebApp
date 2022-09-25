import React, {useEffect, useState} from "react";
import {Link} from 'react-router-dom';
import Page from "../Page";

function About () {
  
  // useEffect( () => {
  //   fetchItems();
  // }, []);

  const [items, setItems] = useState([]);

  const fetchItems = async() => {
    const data = await fetch('/about-us'); //fetching data from port 5000 on proxy
    const items = await data.json();
    setItems(items);
  };

  return (
    <Page title="Profile">

      <h2>Profile</h2>
      
    </Page>
  )
}

export default About;