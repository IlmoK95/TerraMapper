
import './App.css';
import React, { useEffect } from 'react';
import Map from './Maps';


const apikey = process.env.REACT_APP_HereMapsAPIkey



function App() {

  useEffect(()=>{

    if (process.env.REACT_APP_Mode === 'production'){
      console.clear()
      /* window.console.log = () => {}
      window.console.error = () => {}
      window.console.warn = () => {} 
      window.console.debug = () => {}  */
    }
  
  })
  
  return (
    <div>
      <Map apikey={apikey} />
    </div>
  );
}

export default App;
