const routes = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "",
        name: "home",
        component: () => import("pages/Dashboard.vue"),
      },
      {
        path: "/users",
        name: "users",
        component: () => import("pages/users/UserPage.vue"),
      },
      {
        path: "/userform/:id?",
        name: "userform",
        component: () => import("pages/users/UserFormPage.vue"),
      },
      {
        path: "/categories",
        name: "categories",
        component: () => import("pages/categories/CategoryPage.vue"),
      },
      {
        path: "/categoryform/:id?",
        name: "categoryform",
        component: () => import("pages/categories/CategoryFormPage.vue"),
      },
      {
        path: "/units",
        name: "units",
        component: () => import("pages/units/UnitsPage.vue"),
      },
      {
        path: "/unitform/:id?",
        name: "unitform",
        component: () => import("pages/units/UnitsFormPage.vue"),
      },
      {
        path: "/products",
        name: "products",
        component: () => import("pages/products/ProductsPage.vue"),
      },
      {
        path: "/productform/:id?",
        name: "productform",
        component: () => import("pages/products/ProductsFormPage.vue"),
      },
      {
        path: "/maps",
        name: "maps",
        component: () =>
          import("pages/geolocalization/GeolocalizationPage.vue"),
      },
    ],
  },

  {
    path: "/login",
    name: "login",
    component: () => import("pages/LoginIn.vue"),
  },
  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;
