<template>
  <q-page padding class="row justify-center">
    <q-card class="my-card q-pa-sm q-pa-md q-pa-lg q-pa-xl q-pa-xs">
      <!-- <img src="https://cdn.quasar.dev/img/mountains.jpg"> -->
      <q-card-section>
        <div class="text-h6 text-center text-deep-purple-10 text-weight-bolder">
          Formulario de <span v-if="form.id">Actualizaci&oacute;n</span
          ><span v-else>Registro</span> de Unidad
        </div>
      </q-card-section>
      <q-card-section padding>
        <q-form @submit="onSubmit" class="q-gutter-md padding">
          <q-input
            bottom-slots
            v-model="form.unit"
            label="Nombre"
            lazy-rules
            :rules="[(val) => (val && val.length > 4) || 'Campo obligatorio']"
            class="col-lg-6 col-sm-12"
          >
            <template v-slot:prepend>
              <q-icon name="spoke" />
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
              :to="{ name: 'units' }"
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
import unitService from "src/services/UnitService";
import { useQuasar } from "quasar";
import { useRoute, useRouter } from "vue-router";
export default defineComponent({
  name: "UnitsFormPage",
  setup() {
    const $q = useQuasar();
    $q.iconSet.field.error = "las la-exclamation-circle";
    const { register, getById, update } = unitService();
    const router = useRouter();
    const route = useRoute();
    const form = ref({
      //id: "",
      unit: "",
      description: "",
    });

    onMounted(async () => {
      //console.log("respuesta: ", route.params.id);
      if (route.params.id) {
        getUnit(route.params.id);
      }
    });
    const getUnit = async () => {
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
            message: "Se actualizó exitosamente el registro.",
          });
        } else {
          const response = await register(form.value);
          console.log(response);
          $q.notify({
            type: "positive",
            icon: "check",
            message: "Registro exitoso.",
          });
        }
        router.push({ name: "units" });
      } catch (error) {
        console.error(error);
        $q.notify({
          type: "negative",
          icon: "times",
          message: "Hubo problemas al registrar.",
        });
        router.push({ name: "units" });
      }
    };
    return {
      form,
      onSubmit,
    };
  },
});
</script>
