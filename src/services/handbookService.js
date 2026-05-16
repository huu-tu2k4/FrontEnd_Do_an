import axios from '../axios';

const handbookService = {
    getAllCategories() {
        return axios.get('/api/handbook/categories');
    },
    getCategoryById(id) {
        return axios.get(`/api/handbook/categories/${id}`);
    },
    createCategory(data) {
        return axios.post('/api/handbook/categories', data);
    },
    updateCategory(id, data) {
        return axios.put(`/api/handbook/categories/${id}`, data);
    },
    deleteCategory(id) {
        return axios.delete(`/api/handbook/categories/${id}`);
    }
}

export default handbookService;
