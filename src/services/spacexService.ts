import axios from 'axios';

const API_URL = 'https://api.spacexdata.com/v5';

// recupere prochain lancement
export const getNextLaunch = async () => {
    const response = await axios.get(`${API_URL}/launches/next`);
    return response.data;
};

// recupere all lancement
export const getLaunches = async () => {
    const response = await axios.get(`${API_URL}/launches`);
    return response.data;
};

// recupere 10 lastt lancements
export const getLastLaunches = async () => {
    const response = await axios.get(`${API_URL}/launches/past`);
    // trie / date decroissante
    return response.data.sort((a: any, b: any) => new Date(b.date_utc).getTime() - new Date(a.date_utc).getTime()).slice(0, 10);
};