import { useEffect, useState } from 'react';
import './App.css';
import Food from './Food';
import HideoutProfit from './HideoutProfit';
import Meds from './Meds';
import { buildCache } from './services/tarkov-service';

function App() {
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  useEffect(() => {
    buildCache()
    .then(() => {
      setIsLoaded(true);
    });
  })

  if (!isLoaded) {
    return <div>LOADING</div>;
  }

  return (
    <div className="sections">
      <Meds />
      <Food />
      <HideoutProfit />
    </div>
  );
}


export default App;
