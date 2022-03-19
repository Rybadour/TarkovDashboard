import { getItemsByType } from './services/tarkov-tools.service';
import { useEffect, useState } from 'react';
import foodJson from './data/food.json';
import { processItem } from './services/tarkov-service';
import { ItemType, ProcessedItem } from './types';
import { getFieldDef } from 'graphql/execution/execute';

type Food = ProcessedItem & {
  hydration: number,
  energy: number,
  costPerUnit: number,
};
const foodConfig: Record<string, {
  name: string,
  hydration: number,
  energy: number,
}> = foodJson;

function Food() {
  const [food, setFood] = useState<Food[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const allProvisions = await getItemsByType(ItemType.provisions);

      const relevantFood: Food[] = allProvisions
        .filter(i => foodConfig[i.id])
        .map(i => ({
          ...processItem(i),
          ...foodConfig[i.id],
          costPerUnit: 0,
        }))
        .filter(f => f.energy + f.hydration > 0)
        .map(f => ({
          ...f,
          costPerUnit: (f.buyValue / (f.energy + f.hydration))
        }))
        .sort((a, b) => (a.costPerUnit - b.costPerUnit));
     
      setFood(relevantFood);
    };

    fetchData()
      .catch(console.error);
  }, []);

  return (
    <div className="App">
      <h2>Food</h2>

      <div className="item-comparison-table">
      {food.map(f =>
        <div className="item" key={f.id}>
          <div className="item-title">{f.name}</div>
          <div className="item-cost-compare">₽{Math.round(f.costPerUnit).toLocaleString()}</div>
          <div className="item-cost-compare">₽{Math.round(f.buyValue).toLocaleString()}</div>
        </div>
      )}
      </div>
    </div>
  );
}

export default Food;