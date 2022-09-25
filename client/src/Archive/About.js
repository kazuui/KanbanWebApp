import React, {useEffect, useState} from "react";
import {Link} from 'react-router-dom';
import Page from "./Page";

function About () {

  const [items, setItems] = useState([]);
  
  useEffect( () => {
    fetchItems();
  }, []);

  const fetchItems = async() => {
    const data = await fetch('/about-us'); //fetching data from port 5000 on proxy
    const items = await data.json();
    setItems(items);
  };

  return (
    <Page title="About Us">
      <section>
        {
        items.map(item => (
          <div>
            <p>{item.name}</p>
            <p>{item.msg}</p>
            <p>{item.username}</p>
          </div>
        ))
        }
      </section>

      <h2>About Us</h2>
      <p className="lead text-muted">Lorem ipsum dolor sit amet consectetur adipisicing elit. Corporis dolorum labore quisquam vel id dicta fuga! Ducimus, quo. Dolore commodi aliquid error veritatis consequuntur, excepturi cumque fuga eum incidunt doloremque?</p>
      <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. At qui enim rem totam voluptatum. Aut saepe temporibus, facilis ex a iste expedita minima dolorum dicta doloribus libero aliquid, quae maxime? Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugiat suscipit beatae eum, est soluta ducimus ratione et impedit sapiente, nihil, atque dignissimos adipisci? Totam atque officia quis voluptates sed veniam?</p>
      <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Expedita voluptates quisquam possimus tenetur, dicta enim rerum quis, quaerat id nobis provident quo dolorum sapiente temporibus facere non repellendus consequatur cupiditate!</p>
    </Page>
  )
}

export default About;