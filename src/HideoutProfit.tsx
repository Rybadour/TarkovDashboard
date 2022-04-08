import './hideout-profit.css';

import { useEffect, useState } from 'react';
import { ProcessedRecipe } from './types';
import { getCraftsByHideoutModule } from './services/tarkov-service';

type CraftWithProfit = ProcessedRecipe & {
  fleaProfit: number;
};

function HideoutProfit() {
  const [craftsByHideout, setCraftsByHideout] = useState<Record<string, CraftWithProfit[]>>({});

  useEffect(() => {
    const fetchData = async () => {
      const craftsByHideout = await getCraftsByHideoutModule();
      const processed:Record<string, any> = {};
      Object.keys(craftsByHideout) .forEach(key => {
        processed[key] = craftsByHideout[key]
          .map(c => ({
            ...c,
            fleaProfit: (c.fleaSell - c.fleaCost - c.fleaSellFee) / (c.duration / 3600)
          }))
          .sort((a, b) => b.fleaProfit - a.fleaProfit)
          .filter(c => c.fleaProfit > 0)
      });
      setCraftsByHideout(processed);
    };

    fetchData()
      .catch(console.error);
  }, []);

  const headerClasses = "px-6 py-2";
  const cellClasses = "px-6 py-2";
  return (
    <div className="App">
      <h2>Hideout Profit</h2>

      <div>
      {Object.keys(craftsByHideout).map(hideout => 
        <div key={hideout}>
          <h3 className="text-lg mt-3">{hideout}</h3>
          <table className="table-auto bg-gray-100 border-gray-200 shadow rounded-sm">
            <thead className="bg-gray-300 text-gray-500">
              <tr>
                <th className={headerClasses}>Product</th>
                <th className={headerClasses}>Flea Cost</th>
                <th className={headerClasses}>Flea Sell</th>
                <th className={headerClasses}>Flea Fee</th>
                <th className={headerClasses}>Flea Profit/h</th>
              </tr>
            </thead>
            <tbody>
            {craftsByHideout[hideout].map(c => 
              <tr key={c.productId}>
                <td className={cellClasses}>{c.productName + ": " + c.productId}</td>
                <td className={cellClasses}>{c.fleaCost.toLocaleString()}</td>
                <td className={cellClasses}>{c.fleaSell.toLocaleString()}</td>
                <td className={cellClasses}>{c.fleaSellFee.toLocaleString()}</td>
                <td className={cellClasses}>{c.fleaProfit.toLocaleString()}</td>
              </tr>
            )}
            </tbody>
          </table>
        </div>
      )}
      </div>
    </div>
  );
}

export default HideoutProfit;