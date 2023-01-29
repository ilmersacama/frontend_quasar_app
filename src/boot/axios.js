import { boot } from "quasar/wrappers";
import axios from "axios";

//mi codigo
axios.defaults.withCredentials = false;

// Be careful when using SSR for cross-request state pollution
// due to creating a Singleton instance here;
// If any client changes this (global) instance, it might be a
// good idea to move this instance creation inside of the
// "export default () => {}" function below (which runs individually
// for each client)
const api = axios.create({
  baseURL: process.env.API_URL,
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("token")}`,
    //"Access-Control-Allow-Credentials": true,
    //"Access-Control-Allow-Origin": "http://localhost:5000",
    //"X-Requested-With": "XMLHttpRequest",
  },
});

// axios.defaults.headers.post["Content-Type"] = "application/json;charset=utf-8";
// axios.defaults.headers.post["Access-Control-Allow-Origin"] = "*";
// const api = axios.create({
//   baseURL: "https://api.example.com",
//   withCredentials: true,
//   headers: {
//     "Access-Control-Allow-Credentials": true,
//     "Access-Control-Allow-Origin": "*",
//     "X-Requested-With": "XMLHttpRequest",
//   },
// });

// api.interceptors.request.use(
//   (config) => {
//     config.headers.Authorization = `Bearer ${localStorage.getItem(
//       "accessToken"
//     )}`;

//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

export default boot(({ app }) => {
  // for use inside Vue files (Options API) through this.$axios and this.$api

  app.config.globalProperties.$axios = axios;
  // ^ ^ ^ this will allow you to use this.$axios (for Vue Options API form)
  //       so you won't necessarily have to import axios in each vue file

  app.config.globalProperties.$api = api;
  // ^ ^ ^ this will allow you to use this.$api (for Vue Options API form)
  //       so you can easily perform requests against your app's API
});

export { api };
