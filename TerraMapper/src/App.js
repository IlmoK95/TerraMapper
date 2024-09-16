
import './App.css';
import Map from './Maps';

const apikey = process.env.REACT_APP_HereMapsAPIkey


function App() {
  return (
    <div>
      <Map apikey={apikey} />
    </div>
  );
}

export default App;
