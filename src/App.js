import logo from './logo.svg';
import './App.css';
import { getCrafts, getItemsByType } from './tarkov-service';
import gql from 'graphql-tag';
import { useEffect, useState } from 'react';
import { toArray } from 'iter-ops';
import { ItemType } from './types';

function App() {
  const [list, setList] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      const meds = await getItemsByType(ItemType.meds);
      
      setList(
        meds.filter(i => !i.types.includes(ItemType.injectors))   
      );
    };

    fetchData()
      .catch(console.error);
  }, []);

  return (
    <div className="App">
    {list.map(item => <div key={item.id}>{item.id}: {item.name} - {item.shortName}</div>)}
    </div>
  );
}

export default App;
