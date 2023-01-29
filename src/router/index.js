import { route } from "quasar/wrappers";
import {
  createRouter,
  createMemoryHistory,
  createWebHistory,
  createWebHashHistory,
} from "vue-router";
import routes from "./routes";

import { useAuthStore } from "stores/auth";

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

export default route(function ({ store, ssrContext }) {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : process.env.VUE_ROUTER_MODE === "history"
    ? createWebHistory
    : createWebHashHistory;

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,

    // Leave this as is and make changes in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    history: createHistory(process.env.VUE_ROUTER_BASE),
  });

  //Router.beforeEach((to, from, next) => {

  Router.beforeEach(async (to) => {
    // redirect to login page if not logged in and trying to access a restricted page
    const publicPages = ["/login"];
    const authRequired = !publicPages.includes(to.path);
    const auth = useAuthStore();

    if (authRequired && !auth.isLoggedIn) {
      //auth.returnUrl = to.fullPath;
      return "/login";
    }
    //});

    // const auth = store.state.token;
    // //const isAuthenticated = store.state.isAuthenticated
    // if (to.matched.some((record) => record.meta.requireLogin) && !auth) {
    //   next({
    //     name: "login",
    //   });
    // } else next();

    // const loggedIn = localStorage.getItem("auth");
    // console.log(loggedIn);
    // const isAuth = to.matched.some((record) => record.meta.requiresAuth);
    // const isHide = to.matched.some((record) => record.meta.hideForAuth);
    // console.log(isAuth, isHide);
    // if (isAuth && !loggedIn) {
    //   return next({ path: "/login" });
    // } else if (isHide && loggedIn) {
    //   return next({ path: "/" });
    // }
    // next();

    // const publicPages = [
    //   "/login",
    //   "/pages/register",
    //   "/pages/forgot-password",
    //   "/pages/comingsoon",
    //   "/pages/error-404",
    //   "/pages/error-500",
    //   "/pages/not-authorized",
    //   "/pages/maintenance",
    //   "/callback",
    // ];
    // const authRequired = !publicPages.includes(to.path);
    // const loggedIn = localStorage.getItem("token");
    // //console.log(loggedIn, authRequired);

    // if (authRequired && !loggedIn) {
    //   return next("/login");
    // }
    // return next();

    //   const loggedIn = localStorage.getItem("token");
    //   const isAuth = to.matched.some((record) => record.meta.requiresAuth);
    //   const isHide = to.matched.some((record) => record.meta.hideForAuth);
    //   console.log(loggedIn);
    //   console.log(isAuth);

    //   if (isAuth && !loggedIn) {
    //     return next({ path: "/login" });
    //   } else if (isHide && loggedIn) {
    //     return next({ path: "/" });
    //   }
    //   next();
  });

  return Router;
});
