import config from '@/app/configs'
import axios from 'axios'

export const authHttp = axios.create({
    baseURL: config.api.baseURL,
})

authHttp.interceptors.request.use((config) => {
    const token = localStorage.getItem('token')
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

const http = axios.create({
    baseURL: config.api.baseURL,
})

http.interceptors.request.use((config) => {
    const tokenData = JSON.parse(sessionStorage.getItem('token'));
    if (tokenData) {
        const { token, expiryTime } = tokenData;
        if(new Date().getTime() > expiryTime) {
            sessionStorage.removeItem('token');
            window.location.href = '/';
        } else {
            config.headers.Authorization = `Bearer ${token}`
        }
    }
    return config
})

export default http
