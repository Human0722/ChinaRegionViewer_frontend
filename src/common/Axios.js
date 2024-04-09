import axios from 'axios'

const instance = axios.create({
    baseURL: 'http://192.168.31.40:8080',
    headers: {
        'Content-Type': 'application/json'
    }
});

// before request
instance.interceptors.request.use(
    config => {
        console.log("request interceptor run...");
        return config;
    },
    error => {
        alert("request interceptor: " + error);
    }
);


//after response
instance.interceptors.response.use(
    response => {
        return response.data;
    },
    error => {
        return Promise.reject(error);
    }
);

export default instance;
