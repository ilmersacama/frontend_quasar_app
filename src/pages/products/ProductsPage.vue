<template>
  <q-page padding>
    <q-card class="my-card">
      <q-card-section>
        <div class="text-h6">Lista de Productos</div>
      </q-card-section>
    </q-card>
    <q-table
      title="Productos Registrados"
      :rows="products"
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
          label="A&ntilde;adir Producto"
          :to="{ name: 'productform' }"
        />
        <q-btn
          outline
          color="purple"
          label="Generar PDF"
          @click="pdfGenerate"
        />
      </template>
      <template v-slot:body-cell-item_image="props">
        <q-td :props="props">
          <q-avatar v-if="props.row.item_image">
            <img :src="props.row.item_image" />
          </q-avatar>
          <q-avatar
            v-else
            color="grey"
            text-color="white"
            icon="mdi-image-off"
          />
        </q-td>
      </template>
      <template v-slot:body-cell-actions="props">
        <q-td :props="props" class="q-gutter-sm">
          <q-btn
            icon="edit"
            color="info"
            dense
            size="sm"
            @click="handleEditProduct(props.row.item_id)"
          ></q-btn>
          <q-btn
            icon="delete"
            color="negative"
            dense
            size="sm"
            @click="handleDeletProduct(props.row.item_id)"
          ></q-btn>
        </q-td>
      </template>
    </q-table>
  </q-page>
</template>

<script>
import { defineComponent, ref, onMounted } from "vue";
import { useQuasar } from "quasar";
import productService from "src/services/productService";
import { useRouter } from "vue-router";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default defineComponent({
  name: "ProductsPage",
  setup() {
    const $q = useQuasar();
    const router = useRouter();
    const { listar, remove } = productService();
    const products = ref([]);
    const filter = ref("");
    const columns = [
      {
        name: "id",
        align: "center",
        label: "#",
        field: "index",
        sortable: true,
      },
      {
        name: "nombre",
        align: "center",
        label: "Nombre",
        field: "item_name",
        sortable: true,
      },
      {
        name: "item_image",
        align: "center",
        label: "Imagen",
        field: "item_image",
        sortable: true,
      },
      {
        name: "descripcion",
        align: "center",
        label: "Descripción",
        field: "item_description",
        sortable: true,
      },
      {
        name: "categoria",
        align: "center",
        label: "Categoría",
        field: "category_category",
        sortable: true,
      },
      {
        name: "unit_unit",
        align: "center",
        label: "Unidad de Medida",
        field: "unit_unit",
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
      getProducts();
    });
    const getProducts = async () => {
      try {
        //const { data } = await api.get("posts");
        const data = await listar();
        console.log(data);
        products.value = data;
      } catch (error) {
        console.log(error);
      }
    };
    const handleDeletProduct = async (id) => {
      try {
        $q.dialog({
          title: "Eliminar",
          message: "Realmente quiere eliminar el registro?",
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
          //console.log(id);
          await remove(id);
          //alert("eliminacion exitosa");
          await getProducts();
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
    const handleEditProduct = async (id) => {
      //console.log("esto es", id);
      router.push({ name: "productform", params: { id } });
    };
    const pdfGenerate = async () => {
      const doc = new jsPDF({
        orientation: "portrait",
        unit: "pt",
        format: "letter",
      });
      const width = doc.internal.pageSize.width;
      const height = doc.internal.pageSize.height;

      doc.setFont("helvetica", "italic");

      //doc.addImage(imgData, "JPEG", 5, 5, 50, 50);
      doc.setFontSize(20);
      doc.setTextColor(0, 0, 255);
      doc.setFont("courier"); //helvetica, normal, times, bold, bolditalic
      doc.text(40, 100, "Listas aqui de Productos");
      const datos = products.value;
      //doc.autoTable({ html: "#my-table" });
      doc.autoTable({
        startY: 130,
        margin: {
          horizontal: 10,
        },
        styles: {
          overflow: "linebreak",
        },
        bodyStyles: {
          valign: "top",
        },
        head: [["Id", "Nombre", "Descripción", "Categoría", "Unidad"]],
        margin: {
          //left: 0.5,
          top: 100,
        },
        body: datos.map((item, index) => [
          [index + 1],
          [item.item_name],
          [item.item_description],
          [item.category_category],
          [item.unit_unit],
        ]),
      });

      const pageCount = doc.internal.getNumberOfPages();
      for (var i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        var img = new Image();
        img.src = "http://localhost:4000/items/pictures/images-1539.jpg";
        doc.addImage(img, "JPEG|PNG|JPG", 5, 10, 20, 20);

        const pageSize = doc.internal.pageSize;
        const pageWidth = pageSize.width ? pageSize.width : pageSize.getWidth();
        const pageHeight = pageSize.height
          ? pageSize.height
          : pageSize.getHeight();
        const header = "Reporte de Productos";
        const footer = `Página ${i} de ${pageCount}`;

        // Header
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(15);
        doc.text(header, 40, 15, { baseline: "top" });

        // Footer
        doc.setFontSize(10);
        doc.text(
          footer,
          pageWidth / 2 - doc.getTextWidth(footer) / 2,
          pageHeight - 15,
          { baseline: "bottom" }
        );
      }

      doc.save(Date.now() + "-report.pdf");
    };
    return {
      products,
      columns,
      filter,
      handleDeletProduct,
      handleEditProduct,
      pdfGenerate,
    };
  },
});
</script>
