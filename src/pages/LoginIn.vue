<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container>
      <!-- <img src="~assets/wave.png" class="wave" alt="login-wave" /> -->
      <q-page padding>
        <div class="row" style="height: 90vh">
          <div class="col-0 col-md-6 flex justify-center content-center">
            <img src="~assets/login.svg" class="responsive" alt="login-image" />
          </div>
          <div
            v-bind:class="{
              'justify-center': $q.screen.md || $q.screen.sm || $q.screen.xs,
            }"
            class="col-12 col-md-6 flex content-center"
          >
            <q-card
              v-bind:style="
                $q.screen.lt.sm ? { width: '80%' } : { width: '50%' }
              "
            >
              <q-card-section>
                <q-avatar size="103px" class="absolute-center shadow-10">
                  <img src="~assets/avatar.svg" alt="avatar" />
                </q-avatar>
              </q-card-section>
              <q-card-section>
                <div class="q-pt-lg">
                  <div class="col text-h6 ellipsis flex justify-center">
                    <h2
                      class="text-h2 text-uppercase q-my-none text-weight-regular"
                    >
                      Login
                    </h2>
                  </div>
                </div>
              </q-card-section>
              <q-card-section>
                <q-form class="q-gutter-md" @submit.prevent="submitForm">
                  <q-input
                    label="email"
                    type="email"
                    v-model="credenciales.email"
                    lazy-rules
                    :rules="[
                      (val) => !!val || 'Email es requerido',
                      isValidEmail,
                    ]"
                  >
                    <template v-slot:prepend>
                      <q-icon name="email" />
                    </template>
                  </q-input>
                  <q-input
                    label="Password"
                    type="password"
                    v-model="credenciales.password"
                    lazy-rules
                    :rules="[
                      (val) => (val && val.length > 0) || 'Campo obligatorio',
                    ]"
                  >
                    <template v-slot:prepend>
                      <q-icon name="token" />
                    </template>
                  </q-input>
                  <div>
                    <q-card-actions>
                      <q-btn
                        rounded
                        unelevated
                        color="primary"
                        size="lg"
                        class="full-width"
                        label="Login"
                        :disable="!credenciales.email || !credenciales.password"
                        type="submit"
                      />
                    </q-card-actions>
                    <q-btn
                      color="primary"
                      icon="check"
                      label="Ver Usuario"
                      @click="userProfile()"
                    />

                    <!-- <div class="text-center q-mt-sm q-gutter-lg">
                  <router-link class="text-white" to="/login"
                    >Esqueceu a senha?</router-link
                  >
                  <router-link class="text-white" to="/login"
                    >Criar conta</router-link
                  >
                </div> -->
                  </div>
                </q-form>
              </q-card-section>
            </q-card>
          </div>
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent, ref, onMounted } from "vue";
import { useQuasar } from "quasar";
import { api } from "boot/axios";
import { useRouter } from "vue-router";
import { useAuthStore } from "stores/auth";
// import { axios } from "axios";
export default defineComponent({
  name: "LoginIn",
  setup() {
    const $q = useQuasar();
    const router = useRouter();
    const { Login, isLoggedIn, error } = useAuthStore();
    const credenciales = ref({
      email: "",
      password: "",
    });
    //const auth = sessionStorage.getItem("user");
    //console.log(auth);
    onMounted(() => {
      if (isLoggedIn) {
        router.push({ name: "home" });
      }
    });

    const isValidEmail = (val) => {
      const emailPattern =
        /^(?=[a-zA-Z0-9@._%+-]{6,254}$)[a-zA-Z0-9._%+-]{1,64}@(?:[a-zA-Z0-9-]{1,63}\.){1,8}[a-zA-Z]{2,63}$/;
      return emailPattern.test(val) || "Email inválido";
    };
    // const generarToken = async () => {
    //   // await api
    //   //   .post("http://127.0.0.1:8000/api/login", credenciales.value)
    //   //   .then((response) => {
    //   //     console.log(response.data);
    //   //   });
    //   const response = await api.post(
    //     "http://127.0.0.1:8000/api/login",
    //     credenciales.value
    //   );
    //   const respuesta = JSON.stringify(response.data); //token de la api
    //   console.log(respuesta);
    //   //api.defaults.headers.common["Authorization"] = "Bearer " + respuesta;
    //   api.defaults.headers.Authorization = `Bearer ${respuesta}`;
    //   localStorage.setItem("accessToken", respuesta);
    //   //return this.$router.push({ name: "home" });
    //   router.push({
    //     name: "home",
    //   });
    // };
    const userProfile = async () => {
      const resultado = await api.get("http://127.0.0.1:8000/api/user-profile");
      // const token = resultado.data;
      console.log(resultado);
    };

    const submitForm = async () => {
      const response = await Login(credenciales.value);
      if (response) {
        $q.notify({
          type: "negative",
          icon: "check",
          message: "Ingrese las credenciales correctas.",
        });
        //router.go(0);
        //credenciales.value.email = "";
        //credenciales.value.password = "";
      } else {
        $q.notify({
          type: "positive",
          icon: "check",
          message: "Exitoso.",
        });
        location.reload();
        router.push({ name: "home" });
      }
      //router.push({ name: "user" });
    };
    return {
      credenciales,
      isValidEmail,
      userProfile,
      submitForm,
    };
  },
});
</script>
