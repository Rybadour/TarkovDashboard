import axios from "axios";
import hideoutConfig from '../data/hideout.json';

const BASE_URL = 'https://tarkovtracker.io/api/v1/';
const API_KEY = 'MxcfK3k1G46SXBUo8KutiL';


export function getCompletedHideout() {
  return getData('progress')
  .then(data => {
    const hideout = data.hideout;
    return hideoutConfig.modules
      .filter(m => hideout[m.id] && hideout[m.id].complete)
      .map(m => m.module + ' level ' + m.level);
  });
}


function getData(operation: string) {
	const url = BASE_URL + operation;
	return axios.get(url, {
		headers: {
			"Content-Type": 'application/json',
      "Authorization": 'Bearer ' + API_KEY,
		}
	}).then((response) => {
		return response.data;
	});
}