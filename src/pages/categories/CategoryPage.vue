<template>
  <q-page padding>
    <q-card class="my-card">
      <q-card-section>
        <div class="text-h6">Categor&iacute;as Registradas</div>
      </q-card-section>
    </q-card>
    <q-table
      title="Categor&iacute;as Registradas"
      :rows="categories"
      :columns="columns"
      row-key="name"
      :filter="filter"
    >
      <template v-slot:top>
        <q-input
          borderless
          dense
          debounce="300"
          color="primary"
          v-model="filter"
          placeholder="Buscar"
        >
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
        <q-space />
        <q-btn
          color="primary"
          label="A&ntilde;adir Categoría"
          :to="{ name: 'categoryform' }"
        />
        <!--<q-btn
            color="primary"
            :disable="loading"
            label="Add row"
            @click="addRow"
          />-->
      </template>
      <template v-slot:body-cell-actions="props">
        <q-td :props="props" class="q-gutter-sm">
          <q-btn
            icon="edit"
            color="info"
            dense
            size="sm"
            @click="handleEditCategory(props.row.id)"
          ></q-btn>
          <q-btn
            icon="delete"
            color="negative"
            dense
            size="sm"
            @click="handleDeleteCategory(props.row.id)"
          ></q-btn>
        </q-td>
      </template>
    </q-table>
  </q-page>
</template>

<script>
import { defineComponent, ref, onMounted } from "vue";
import { useQuasar } from "quasar";
import categoryService from "src/services/CategoryService";
import { useRouter } from "vue-router";
export default defineComponent({
  name: "CategoryPage",
  setup() {
    const $q = useQuasar();
    const router = useRouter();
    const { listar, remove } = categoryService();
    const categories = ref([]);
    const filter = ref("");
    const columns = [
      {
        name: "id",
        align: "center",
        label: "Id",
        field: "id",
        sortable: true,
      },
      {
        name: "nombre",
        align: "center",
        label: "Nombre",
        field: "category",
        sortable: true,
      },
      {
        name: "category",
        align: "center",
        label: "Descripción",
        field: "description",
        sortable: true,
      },
      {
        name: "actions",
        align: "center",
        label: "Actions",
        field: "actions",
      },
    ];
    onMounted(() => {
      getCategories();
    });
    const getCategories = async () => {
      try {
        //const { data } = await api.get("posts");
        const data = await listar();
        console.log(data.categories);
        categories.value = data.categories;
      } catch (error) {
        console.log(error);
      }
    };
    const handleDeleteCategory = async (id) => {
      try {
        $q.dialog({
          title: "Eliminar",
          message: "Realmente quiere eliminar la Categoría?",
          ok: {
            push: true,
            color: "positive",
          },
          cancel: {
            push: true,
            color: "negative",
          },
          persistent: true,
        }).onOk(async () => {
          await remove(id);
          //alert("eliminacion exitosa");
          await getCategories();
          $q.notify({
            type: "positive",
            icon: "check",
            message: "Se eliminó correctamente el registro.",
          });
        });
      } catch (error) {
        //alert(error);
        $q.notify({
          type: "negative",
          icon: "times",
          message: "Hubo problemas al eliminar el registro.",
        });
      }
    };
    const handleEditCategory = async (id) => {
      //console.log("esto es", id);
      router.push({ name: "categoryform", params: { id } });
    };
    return {
      categories,
      columns,
      filter,
      handleDeleteCategory,
      handleEditCategory,
    };
  },
});
</script>
