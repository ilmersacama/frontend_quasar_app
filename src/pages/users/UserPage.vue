<template>
  <q-page padding>
    <q-card class="my-card">
      <q-card-section>
        <div class="text-h6">Usuarios Registrados</div>
      </q-card-section>
    </q-card>
    <q-table
      title="Usuarios Registrados"
      :rows="users"
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
          label="A&ntilde;adir Usuario"
          :to="{ name: 'userform' }"
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
            @click="handleEditUser(props.row.id)"
          ></q-btn>
          <q-btn
            icon="delete"
            color="negative"
            dense
            size="sm"
            @click="handleDeletUser(props.row.id)"
          ></q-btn>
        </q-td>
      </template>
    </q-table>
  </q-page>
</template>

<script>
import { defineComponent, ref, onMounted } from "vue";
import { useQuasar } from "quasar";
import userService from "src/services/userService";
import { useRouter } from "vue-router";
export default defineComponent({
  name: "UserPage",
  setup() {
    const $q = useQuasar();
    const router = useRouter();
    const { listar, remove } = userService();
    const users = ref([]);
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
        field: "name",
        sortable: true,
      },
      {
        name: "email",
        align: "center",
        label: "Email",
        field: "email",
        sortable: true,
      },
      ,
      {
        name: "role",
        align: "center",
        label: "Rol",
        field: "role",
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
      getUsers();
    });
    const getUsers = async () => {
      try {
        //const { data } = await api.get("posts");
        const data = await listar();
        console.log(data.users);
        users.value = data.users;
      } catch (error) {
        console.log(error);
      }
    };
    const handleDeletUser = async (id) => {
      try {
        $q.dialog({
          title: "Eliminar",
          message: "Realmente quiere eliminar el usuario?",
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
          await getUsers();
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
    const handleEditUser = async (id) => {
      //console.log("esto es", id);
      router.push({ name: "userform", params: { id } });
    };
    return {
      users,
      columns,
      filter,
      handleDeletUser,
      handleEditUser,
    };
  },
});
</script>
