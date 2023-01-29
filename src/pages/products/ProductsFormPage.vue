<template>
  <q-page padding class="row justify-center">
    <q-card class="my-card q-pa-sm q-pa-md q-pa-lg q-pa-xl q-pa-xs">
      <!-- <img src="https://cdn.quasar.dev/img/mountains.jpg"> -->
      <q-card-section>
        <div class="text-h6 text-center text-deep-purple-10 text-weight-bolder">
          Formulario de <span v-if="form.id">Actualizaci&oacute;n</span
          ><span v-else>Registro</span> de Productos
        </div>
      </q-card-section>
      <q-card-section padding>
        <q-form @submit="onSubmit" class="q-gutter-md padding">
          <q-input
            bottom-slots
            v-model="form.barcode"
            label="Código de Barras"
            lazy-rules
            :rules="[(val) => (val && val.length > 0) || 'Campo obligatorio']"
            class="col-lg-6 col-sm-12"
          >
            <template v-slot:prepend>
              <q-icon name="qr_code_scanner" />
            </template>
          </q-input>
          <q-input
            bottom-slots
            v-model="form.name"
            label="Nombre"
            lazy-rules
            :rules="[(val) => (!!val && val.length > 0) || 'Campo requerido']"
          >
            <template v-slot:prepend>
              <q-icon name="square" />
            </template>
          </q-input>
          <q-input
            bottom-slots
            v-model="form.description"
            label="Descripción"
            lazy-rules
            :rules="[(val) => (!!val && val.length > 0) || 'Campo requerido']"
          >
            <template v-slot:prepend>
              <q-icon name="description" />
            </template>
          </q-input>
          <!-- <q-input
            bottom-slots
            v-model="form.image"
            label="Imagen"
            lazy-rules
            :rules="[(val) => (!!val && val.length > 0) || 'Campo requerido']"
          > -->
          <!-- <q-uploader
            style="max-width: 300px"
            url="http://127.0.0.1:4000/uploads"
            label="Restricted to images"
            accept=".jpg, image/*"
            field-name="photo"
            auto-upload
          /> -->
          <q-file
            bottom-slots
            v-model="form.image"
            label="Imagen"
            accept=".jpg, image/*"
            ><template v-slot:prepend> <q-icon name="image" /> </template
          ></q-file>
          <q-select
            bottom-slots
            label="Categoría"
            v-model="form.categoryId"
            icon="badge"
            :options="categoria"
            option-value="id"
            option-label="category"
            map-options
            emit-value
            lazy-rules
            :rules="[(val) => !!val || 'Campo requerido', ruleOptions]"
            ><template v-slot:prepend> <q-icon name="category" /> </template
          ></q-select>
          <q-select
            bottom-slots
            label="Unidad"
            v-model="form.unitId"
            icon="badge"
            :options="unidad"
            option-value="id"
            option-label="unit"
            map-options
            emit-value
            lazy-rules
            :rules="[(val) => !!val || 'Campo requerido', ruleOptions]"
            ><template v-slot:prepend> <q-icon name="ad_units" /> </template
          ></q-select>
          <div class="float-right">
            <q-btn
              label="Cancelar"
              color="primary"
              flat
              class="q-ml-sm"
              icon="undo"
              :to="{ name: 'products' }"
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
import productService from "src/services/ProductService";
import { useQuasar } from "quasar";
import { useRoute, useRouter } from "vue-router";
import categoryService from "src/services/CategoryService";
import unitService from "src/services/UnitService";
import { api } from "src/boot/axios";
export default defineComponent({
  name: "ProductsFormPage",
  setup() {
    const $q = useQuasar();
    $q.iconSet.field.error = "las la-exclamation-circle";
    const { register, getById, update } = productService();
    const categories = categoryService();
    const units = unitService();
    const router = useRouter();
    const route = useRoute();
    const form = ref({
      //id: null,
      barcode: "",
      name: "",
      description: "",
      image: null,
      categoryId: "",
      unitId: "",
    });

    const categoria = ref([]);
    const unidad = ref([]);

    onMounted(() => {
      options_categories();
      options_units();
      //console.log("respuesta: ", route.params.id);
      if (route.params.id) {
        //console.log(route.params.id);
        getProduct(route.params.id);
      }
    });
    const getProduct = async () => {
      try {
        const response = await getById(route.params.id);
        console.log(response);
        form.value = response;
      } catch (error) {
        console.log(error);
      }
    };

    const options_categories = async () => {
      try {
        const response = await categories.listar();
        //console.log(response.categories);
        categoria.value = response.categories;
      } catch (error) {
        console.log(error);
      }
    };

    const options_units = async () => {
      try {
        const response = await units.listar();
        console.log(response.units);
        unidad.value = response.units;
      } catch (error) {
        console.log(error);
      }
      // valores.value = [
      //   { id: 1, name: "water" },
      //   { id: 2, name: "earth" },
      //   { id: 3, name: "fire" },
      //   { id: 4, name: "air" },
      // ];
    };

    const ruleOptions = (val) => {
      if (val === null) {
        return "Campo Obligatorio";
      }
    };

    const onSubmit = async () => {
      //console.log(form.value);
      if (form.value.id) {
        const form_data = new FormData();
        //form_data.append("id", form.value.id);
        form_data.append("barcode", form.value.barcode);
        form_data.append("name", form.value.name);
        form_data.append("description", form.value.description);
        form_data.append("image", form.value.image);
        form_data.append("categoryId", form.value.categoryId);
        form_data.append("unitId", form.value.unitId);
        //form_data.append("_method", "put");
        //console.log(form.value);
        console.log(...form_data);
        const url = `http://localhost:4000/items/${form.value.id}`;
        api
          .put(url, form_data, {
            headers: {
              "Content-Type": "multipart/form-data",
              // "Access-Control-Allow-Credentials": true,
              // "Access-Control-Allow-Origin": "*",
              // "X-Requested-With": "XMLHttpRequest",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          })
          .then((res) => {
            console.log(res.data);
            $q.notify({
              type: "positive",
              icon: "check",
              message: "Se actualizó exitosamente el registro.",
            });
            router.push({ name: "products" });
          })
          .catch((err) => {
            console.log(err);
            console.log("ERROR", err.response.data);
            $q.notify({
              type: "negative",
              icon: "times",
              message: "Hubo problemas al actualizar.",
            });
            router.push({ name: "products" });
          });
      } else {
        const form_data = new FormData();
        form_data.append("image", form.value.image);
        form_data.append("barcode", form.value.barcode);
        form_data.append("name", form.value.name);
        form_data.append("description", form.value.description);
        form_data.append("categoryId", form.value.categoryId);
        form_data.append("unitId", form.value.unitId);
        console.log(...form_data);
        let url = "http://localhost:4000/items/";
        api
          .post(url, form_data, {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          })
          .then((res) => {
            console.log(res.data);
            $q.notify({
              type: "positive",
              icon: "check",
              message: "Se registró exitosamente.",
            });
            router.push({ name: "products" });
          })
          .catch((err) => {
            console.log(err);
            $q.notify({
              type: "negative",
              icon: "times",
              message: "Hubo problemas al registrar.",
            });
            router.push({ name: "products" });
          });
      }
    };

    // const datos = [
    //   {
    //     name: "ilmer",
    //     lastname: "Sacama",
    //     age: 35,
    //     course: "Marketing",
    //     id: 1,
    //   },
    //   {
    //     name: "jorge",
    //     lastname: "Mend",
    //     age: 35,
    //     course: "Mat",
    //     id: 2,
    //   },
    //   {
    //     name: "juan",
    //     lastname: "Choque",
    //     age: 35,
    //     course: "Infor",
    //     id: 3,
    //   },
    //   {
    //     name: "Flor",
    //     lastname: "Sanz",
    //     age: 35,
    //     course: "Merc",
    //     id: 4,
    //   },
    //   {
    //     name: "Rosa",
    //     lastname: "Mane",
    //     age: 35,
    //     course: "Des",
    //     id: 5,
    //   },
    // ];

    // for (let i = 0; i < datos.length; i++) {
    //   console.log(datos[i]);
    // }
    // datos.forEach(function (data, index) {
    //   console.log(data, index);
    // });
    // const result = datos.map((data) => {
    //   return { ...data, course: "Prueba" };
    // });
    // const result = datos.filter((student) => {
    //   if (student.course === "Infor") {
    //     return true;
    //   }
    // });
    // console.log(result);

    // const a = [
    //   { id: 4, name: "Greg" },
    //   { id: 1, name: "David" },
    //   { id: 2, name: "John" },
    //   { id: 3, name: "Matt" },
    // ];

    // const b = [
    //   { id: 5, name: "Mathew", position: "1" },
    //   { id: 6, name: "Gracia", position: "2" },
    //   { id: 2, name: "John", position: "2" },
    //   { id: 3, name: "Matt", position: "2" },
    // ];

    // const r = a.filter(({ id: ida }) =>
    //   //console.log(ida);
    //   b.every(({ id: idb }) => {
    //     return ida !== idb;
    //   })
    // );

    // let npor = a.filter((x) => !b.includes(x));
    // console.log(npor);

    // console.log(r);
    // const newArr = b
    //   .concat(r)
    //   .map((v) => (v.position ? v : { ...v, position: null }));

    // //console.log(JSON.stringify(newArr));

    // const listarcities = [
    //   "la paz",
    //   "bermejo",
    //   "cochabamba",
    //   "cochabamba",
    //   "oruro",
    //   "tarija",
    //   "potosi",
    //   "potosi",
    //   "potosi",
    //   "sucre",
    //   "sucre",
    // ];
    // const logCitiesCount = (numcities) => {
    //   const cities = {};
    //   listarcities.forEach((city) => {
    //     cities[city] = !cities[city] ? 1 : (cities[city] += 1);
    //   });
    //   return Object.keys(cities)
    //     .map((city) => ({ name: city, times: cities[city] }))
    //     .sort((a, b) => b.times - a.times)
    //     .slice(0, 3)
    //     .map((city) => city.name);
    // };

    // const otro = [...new Set(listarcities)]
    //   .map((city) => {
    //     return {
    //       depart: city,
    //       veces: listarcities.filter((n) => n === city).length,
    //     };
    //   })
    //   .sort((a, b) => b.veces - a.veces)
    //   .slice(0, 3)
    //   .map((city) => city.depart);
    // console.log(logCitiesCount(20));
    // console.log(otro);
    return {
      categoria,
      unidad,
      ruleOptions,
      form,
      onSubmit,
      //filesImages: ref(null),
    };
  },
});
</script>
