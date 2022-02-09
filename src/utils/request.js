import axios from 'axios';
import { ElMessageBox as MessageBox, ElMessage as Message } from 'element-plus';
import store from '@/store';

// create an axios instance
const service = axios.create({
  // baseURL: process.env.VUE_APP_BASE_API, // process.env.VUE_APP_BASE_API url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  responseType: 'json',
  timeout: 5000 // request timeout
});

// request interceptor
service.interceptors.request.use(
  (config) => {
    // do something before request is sent
    if (store.getters.token) {
      // please modify it according to the actual situation
    }
    return config;
  },
  (error) => {
    // do something with request error
    console.log(error); // for debug
    return Promise.reject(error);
  }
);

// response interceptor
service.interceptors.response.use((response) => {
  const res = response.data;
  if (res.code !== 200) {
    Message({
      message: res.message || 'Error',
      type: 'error',
      duration: 5 * 1000
    });

    if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
      // to re-login
      MessageBox.confirm('You have been logged out, you can cancel to stay on this page, or log in again', 'Confirm logout', {
        confirmButtonText: 'Re-Login',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }).then(() => {
        // store.dispatch('user/resetToken').then(() => {
        //   location.reload();
        // });
      });
    }
    return Promise.reject(new Error(res.message || '错误'));
  } else {
    return res;
  }
},
(error) => {
  console.log('err' + error); // for debug
  Message({
    message: error.message,
    type: 'error',
    duration: 5 * 1000
  });
  return Promise.reject(error);
}
);

export default service;
