
import './App.css';
import React, { useEffect } from 'react';
import Map from './Maps';


const apikey = process.env.REACT_APP_Mode === 'production' ? process.env.REACT_APP_HereMapsAPIkeyProd : process.env.REACT_APP_HereMapsAPIkeyTest


function App() {

  useEffect(()=>{

    if (process.env.REACT_APP_Mode === 'production'){
      console.clear()

    }
  
  })
  
  return (
    <div>
      <Map apikey={apikey} />
    </div>
  );
}

export default App;
