import Navbar from "./components/Navbar";
import ItemTable from "./components/ItemTable";
import './App.css';

const App = () => {
  return (
    <div className="app-container">
      <Navbar/>
      <ItemTable/>
    </div>
  );
}

export default App;