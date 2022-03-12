import './App.css';
import HideoutProfit from './HideoutProfit';
import Meds from './Meds';
import { cacheAllItemCosts, ensureStaticDataLoaded } from './services/tarkov-service';

ensureStaticDataLoaded();
cacheAllItemCosts();


function App() {

  return (
    <div className="sections">
      <Meds />
      <HideoutProfit />
    </div>
  );
}


export default App;
