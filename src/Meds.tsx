import { getItemsByType } from './services/tarkov-tools.service';
import { useEffect, useState } from 'react';
import { ItemType, MedConfig, ProcessedItem } from './types';
import medsJson from './data/meds.json';
import { processItem } from './services/tarkov-service';

const medsConfig: Record<string, MedConfig> = medsJson;
type MedItem = MedConfig & ProcessedItem;
type MedItemAndCost = MedItem & {
  costPerHeal: number;
};

function Meds() {
  const [medsForHealth, setMedsForHealth] = useState<MedItemAndCost[]>([]);
  const [medsForLightBleed, setMedsForLightBleed] = useState<MedItemAndCost[]>([]);
  const [medsForHeavyBleed, setMedsForHeavyBleed] = useState<MedItemAndCost[]>([]);
  const [medsForFractures, setMedsForFractures] = useState<MedItemAndCost[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const allMeds = await getItemsByType(ItemType.meds);

      const relevantMeds: MedItem[] = allMeds
        .filter(i => medsConfig[i.id])
        .map(i => ({
          ...processItem(i),
          ...medsConfig[i.id],
        }));
     
      setMedsForHealth(
        relevantMeds
        .filter(i => i.healsHealth)
        .map(i => ({
          ...i,
          costPerHeal: (i.buyValue / i.maxPoints)
        }))
        .sort((a, b) => a.costPerHeal - b.costPerHeal)
      );

      setMedsForLightBleed(
        relevantMeds
        .filter(i => i.healsLightBleed)
        .map(i => ({
          ...i,
          costPerHeal: (i.buyValue / (i.maxPoints/i.lightBleedPoints))
        }))
        .sort((a, b) => a.costPerHeal - b.costPerHeal)
      );

      setMedsForHeavyBleed(
        relevantMeds
        .filter(i => i.healsHeavyBleed)
        .map(i => ({
          ...i,
          costPerHeal: (i.buyValue / (i.maxPoints/i.heavyBleedPoints))
        }))
        .sort((a, b) => a.costPerHeal - b.costPerHeal)
      );

      setMedsForFractures(
        relevantMeds
        .filter(i => i.healsFracture)
        .map(i => ({
          ...i,
          costPerHeal: (i.buyValue / (i.maxPoints/i.fracturePoints))
        }))
        .sort((a, b) => a.costPerHeal - b.costPerHeal)
      );
    };

    fetchData()
      .catch(console.error);
  }, []);

  return (
    <div className="App">
      <h2>Meds</h2>

      <h3>Best for Healing (After Raid heal is ₽30/health)</h3>
      <div className="item-comparison-table">
      {medsForHealth.map(item =>
        <div className={"item " + (item.costPerHeal > 33 ? "item--bad" : "item--good")} key={item.id}>
          <div className="item-title">{item.name}</div>
          <div className="item-cost-compare">₽{item.costPerHeal.toFixed(1).toLocaleString()}</div>
        </div>
      )}
      </div>

      <h3>Best for Healing Light Bleeds</h3>
      <div className="item-comparison-table">
      {medsForLightBleed.map(item =>
        <div className={"item " + (item.costPerHeal > 440 ? "item--bad" : "item--good")} key={item.id}>
          <div className="item-title">{item.name}</div>
          <div className="item-cost-compare">₽{item.costPerHeal.toFixed(1).toLocaleString()}</div>
        </div>
      )}
      </div>

      <h3>Best for Healing Heavy Bleeds</h3>
      <div className="item-comparison-table">
      {medsForHeavyBleed.map(item =>
        <div className={"item " + (item.costPerHeal > 1320 ? "item--bad" : "item--good")} key={item.id}>
          <div className="item-title">{item.name}</div>
          <div className="item-cost-compare">₽{item.costPerHeal.toFixed(1).toLocaleString()}</div>
        </div>
      )}
      </div>

      <h3>Best for Healing Fractures</h3>
      <div className="item-comparison-table">
      {medsForFractures.map(item =>
        <div className={"item " + (item.costPerHeal > 1100 ? "item--bad" : "item--good")} key={item.id}>
          <div className="item-title">{item.name}</div>
          <div className="item-cost-compare">₽{item.costPerHeal.toFixed(1).toLocaleString()}</div>
        </div>
      )}
      </div>
    </div>
  );
}

export default Meds;