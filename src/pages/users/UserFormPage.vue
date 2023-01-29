<template>
  <q-page padding class="row justify-center">
    <q-card class="my-card q-pa-sm q-pa-md q-pa-lg q-pa-xl q-pa-xs">
      <!-- <img src="https://cdn.quasar.dev/img/mountains.jpg"> -->
      <q-card-section>
        <div class="text-h6 text-center text-deep-purple-10 text-weight-bolder">
          Formulario de <span v-if="form.id">Actualizaci&oacute;n</span
          ><span v-else>Registro</span> de Usuarios
        </div>
      </q-card-section>
      <q-card-section padding>
        <q-form @submit="onSubmit" class="q-gutter-md padding">
          <q-input
            bottom-slots
            v-model="form.name"
            label="Nombres y Apellidos"
            lazy-rules
            :rules="[(val) => (val && val.length > 0) || 'Campo obligatorio']"
            class="col-lg-6 col-sm-12"
          >
            <template v-slot:prepend>
              <q-icon name="person" />
            </template>
          </q-input>
          <q-input
            bottom-slots
            v-model="form.email"
            isValidEmail
            label="Email"
            lazy-rules
            :rules="[(val) => !!val || 'Email es requerido', isValidEmail]"
          >
            <template v-slot:prepend>
              <q-icon name="email" />
            </template>
          </q-input>
          <div v-if="!form.id">
            <q-input
              bottom-slots
              label="Contrase&ntilde;a"
              v-model="form.password"
              icon="password"
              type="password"
              lazy-rules
              :rules="[
                (val) => (val && val.length >= 8) || 'Campo obligatorio',
              ]"
              ><template v-slot:prepend> <q-icon name="check" /> </template
            ></q-input>
          </div>
          <q-select
            bottom-slots
            label="Rol"
            v-model="form.role"
            icon="badge"
            :options="options"
            lazy-rules
            :rules="[(val) => (val && val.length >= 0) || 'Campo obligatorio']"
            ><template v-slot:prepend> <q-icon name="person" /> </template
          ></q-select>
          <div class="float-right">
            <q-btn
              label="Cancelar"
              color="primary"
              flat
              class="q-ml-sm"
              icon="undo"
              :to="{ name: 'users' }"
            />
            <q-btn label="Guardar" type="submit" color="primary" icon="save" />
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
import { defineComponent, ref, onMounted } from "vue";
import userService from "src/services/UserService";
import { useQuasar } from "quasar";
import { useRoute, useRouter } from "vue-router";
export default defineComponent({
  name: "UserFormPage",
  setup() {
    const $q = useQuasar();
    $q.iconSet.field.error = "las la-exclamation-circle";
    const { register, getById, update } = userService();
    const router = useRouter();
    const route = useRoute();
    const form = ref({
      //id: "",
      name: "",
      email: "",
      password: "",
      role: "",
    });

    onMounted(async () => {
      //console.log("respuesta: ", route.params.id);
      if (route.params.id) {
        getUser(route.params.id);
      }
    });
    const getUser = async () => {
      try {
        const response = await getById(route.params.id);
        //console.log(response);
        form.value = response;
      } catch (error) {
        console.log(error);
      }
    };

    const isValidEmail = (val) => {
      const emailPattern =
        /^(?=[a-zA-Z0-9@._%+-]{6,254}$)[a-zA-Z0-9._%+-]{1,64}@(?:[a-zA-Z0-9-]{1,63}\.){1,8}[a-zA-Z]{2,63}$/;
      return emailPattern.test(val) || "Email inválido";
    };
    const onSubmit = async () => {
      //console.log(form.value);
      try {
        if (form.value.id) {
          await update(form.value);
          $q.notify({
            type: "positive",
            icon: "check",
            message: "Se actualizó exitosamente el usuario.",
          });
        } else {
          const response = await register(form.value);
          console.log(response);
          $q.notify({
            type: "positive",
            icon: "check",
            message: "Se registró exitosamente el usuario.",
          });
        }
        router.push({ name: "users" });
      } catch (error) {
        console.error(error);
        $q.notify({
          type: "negative",
          icon: "times",
          message: "Hubo problemas al registrar al usuario.",
        });
        router.push({ name: "users" });
      }
    };
    return {
      form,
      onSubmit,
      isValidEmail,
      options: ["superadmin", "admin", "manager", "user", "seller"],
    };
  },
});
</script>
