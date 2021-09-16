import Navbar from "./components/Navbar";
import ItemTable from "./components/ItemTable";
import './App.css';
import 'bootswatch/dist/cyborg/bootstrap.min.css';

const App = () => {
  return (
    <div className="app-style">
      <Navbar/>
      <ItemTable/>
    </div>
  );
}

export default App;