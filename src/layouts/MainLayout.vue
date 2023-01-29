<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title> ERP by Ilmer Sacama </q-toolbar-title>

        <q-btn-dropdown flat color="white" icon="person">
          <q-list>
            <q-item clickable v-close-popup @click="handleLogout">
              <q-item-section>
                <q-item-label>Cerrar Sesión</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      :width="200"
      :breakpoint="400"
    >
      <q-scroll-area
        style="
          height: calc(100% - 150px);
          margin-top: 150px;
          border-right: 1px solid #ddd;
        "
      >
        <q-list>
          <q-item-label header> Men&uacute; </q-item-label>

          <EssentialLink
            v-for="link in essentialLinks"
            :key="link.title"
            v-bind="link"
          /> </q-list
      ></q-scroll-area>
      <q-img
        class="absolute-top"
        src="https://cdn.quasar.dev/img/material.png"
        style="height: 150px"
      >
        <div class="absolute-bottom bg-transparent">
          <q-avatar size="56px" class="q-mb-sm">
            <img src="https://cdn.quasar.dev/img/boy-avatar.png" />
          </q-avatar>
          <div class="text-weight-bold">Ilmer Sacama</div>
          <div>Esta en linea</div>
        </div>
      </q-img>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent, ref } from "vue";
import EssentialLink from "components/EssentialLink.vue";

import { storeToRefs } from "pinia";
import { useRouter } from "vue-router";
import { useAuthStore } from "stores/auth";
import { useQuasar } from "quasar";

const linksList = [
  {
    title: "Home",
    caption: "home",
    icon: "home",
    to: { name: "home" },
  },
  {
    title: "Usuarios",
    caption: "usuarios",
    icon: "person",
    to: { name: "users" },
  },
  {
    title: "Categorias",
    caption: "categorias",
    icon: "category",
    to: { name: "categories" },
  },
  {
    title: "Unidades",
    caption: "unidades",
    icon: "spoke",
    to: { name: "units" },
  },
  {
    title: "Productos",
    caption: "productos",
    icon: "qr_code",
    to: { name: "products" },
  },
  {
    title: "Ubicación",
    caption: "ubicación",
    icon: "location_on",
    to: { name: "maps" },
  },
];

export default defineComponent({
  name: "MainLayout",

  components: {
    EssentialLink,
  },

  setup() {
    const leftDrawerOpen = ref(false);
    const $q = useQuasar();
    const router = useRouter();
    const { logout } = useAuthStore();
    const auth = localStorage.getItem("token");
    //console.log("token: ", isAuthenticated);
    // onMounted(() => {
    //   if (!isAuthenticated) {
    //     router.push({ name: "login" });
    //   }
    // });

    const handleLogout = async () => {
      $q.dialog({
        title: "Cerrar Sesión",
        message: "Realmente quiere cerrar la sesión?",
        persistent: true,
        cancel: true,
      }).onOk(async () => {
        try {
          await logout();
          router.replace({ name: "login" });
          //router.push({ name: "login" });
          //location.reload();
        } catch (e) {
          console.log(e);
        }
      });
    };

    return {
      essentialLinks: linksList,
      leftDrawerOpen,
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value;
      },
      handleLogout,
    };
  },
});
</script>
