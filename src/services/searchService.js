import axios from '../axios';

const search = async (q, type = 'both') => {
    const params = { q, type };
    return axios.get('/api/search', { params });
};

export default { search };
