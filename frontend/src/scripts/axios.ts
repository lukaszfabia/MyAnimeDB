import axios from "axios";

let isRefeshed = false

axios.interceptors.response.use(resp => resp, async error => {
    if (error.response.status === 401 && !isRefeshed) {
        isRefeshed = !isRefeshed
        const response = await axios.post('http://localhost:8000/api/token/refresh/', {
            refresh: localStorage.getItem('refresh_token')
        }, { headers: { 'Content-Type': 'application/json' } });

        if (response.status === 200) {
            axios.defaults.headers.common['Authorization'] = 'Bearer ' + response.data.access
            localStorage.setItem('access_token', response.data.access)
            localStorage.setItem('refresh_token', response.data.refresh)
            return axios(error.config)
        }
    }
    return error
});