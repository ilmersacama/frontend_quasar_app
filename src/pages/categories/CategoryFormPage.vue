<template>
  <q-page padding class="row justify-center">
    <q-card class="my-card q-pa-sm q-pa-md q-pa-lg q-pa-xl q-pa-xs">
      <!-- <img src="https://cdn.quasar.dev/img/mountains.jpg"> -->
      <q-card-section>
        <div class="text-h6 text-center text-deep-purple-10 text-weight-bolder">
          Formulario de <span v-if="form.id">Actualizaci&oacute;n</span
          ><span v-else>Registro</span> de Categor&iacute;a
        </div>
      </q-card-section>
      <q-card-section padding>
        <q-form @submit="onSubmit" class="q-gutter-md padding">
          <q-input
            bottom-slots
            v-model="form.category"
            label="Nombre"
            lazy-rules
            :rules="[(val) => (val && val.length > 4) || 'Campo obligatorio']"
            class="col-lg-6 col-sm-12"
          >
            <template v-slot:prepend>
              <q-icon name="category" />
            </template>
          </q-input>
          <q-input
            bottom-slots
            v-model="form.description"
            label="Descripci&oacute;n"
            lazy-rules
            :rules="[(val) => (val && val.length > 0) || 'Campo obligatorio']"
            class="col-lg-6 col-sm-12"
          >
            <template v-slot:prepend>
              <q-icon name="description" />
            </template>
          </q-input>

          <div class="float-right">
            <q-btn
              label="Cancelar"
              color="primary"
              flat
              class="q-ml-sm"
              icon="undo"
              :to="{ name: 'categories' }"
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
import categoryService from "src/services/CategoryService";
import { useQuasar } from "quasar";
import { useRoute, useRouter } from "vue-router";
export default defineComponent({
  name: "CategoryFormPage",
  setup() {
    const $q = useQuasar();
    $q.iconSet.field.error = "las la-exclamation-circle";
    const { register, getById, update } = categoryService();
    const router = useRouter();
    const route = useRoute();
    const form = ref({
      //id: "",
      category: "",
      description: "",
    });

    onMounted(async () => {
      //console.log("respuesta: ", route.params.id);
      if (route.params.id) {
        getCategory(route.params.id);
      }
    });
    const getCategory = async () => {
      try {
        const response = await getById(route.params.id);
        //console.log(response);
        form.value = response;
      } catch (error) {
        console.log(error);
      }
    };

    const onSubmit = async () => {
      //console.log(form.value);
      try {
        if (form.value.id) {
          await update(form.value);
          $q.notify({
            type: "positive",
            icon: "check",
            message: "Se actualizó exitosamente la categor&iacute;a.",
          });
        } else {
          const response = await register(form.value);
          console.log(response);
          $q.notify({
            type: "positive",
            icon: "check",
            message: "Se registró exitosamente la categor&iacute;a.",
          });
        }
        router.push({ name: "categories" });
      } catch (error) {
        console.error(error);
        $q.notify({
          type: "negative",
          icon: "times",
          message: "Hubo problemas al registrar la categor&iacute;a.",
        });
        router.push({ name: "categories" });
      }
    };
    return {
      form,
      onSubmit,
    };
  },
});
</script>
