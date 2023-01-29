import { defineStore } from "pinia";
import { api } from "boot/axios";
//const Url = `${import.meta.env.API_URL}`;
export const useAuthStore = defineStore("auth", {
  state: () => ({
    token: localStorage.getItem("token"),
    user: sessionStorage.getItem("user"),
    loading: false,
    isAuthenticated: false,
  }),
  getters: {
    getUser() {
      return (state) => state.user;
    },
    isLoggedIn: (state) => !!state.user,
  },
  actions: {
    async Login(params) {
      this.loading = true;
      try {
        const response = await api.post("/auth/login", params);
        sessionStorage.setItem("user", response.data);
        localStorage.setItem("token", response.data);
        this.token = response.data;
        this.user = response.data;
        this.isAuthenticated = true;
        this.loading = false;
      } catch (error) {
        this.token = null;
        this.user = {};
        this.loading = false;
        return new Error(error);
      }
    },

    logout() {
      //console.log("estamos aqui");
      sessionStorage.removeItem("token");
      localStorage.removeItem("user");
      window.localStorage.clear();
      sessionStorage.clear();
      this.token = null;
      this.user = false;
      this.isAuthenticated = false;
      //console.log(this.token, this.isAuthenticated);
      // Route to home page
      //router.push({ name: "/" });
    },
  },
});
