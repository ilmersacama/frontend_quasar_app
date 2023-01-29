import categoryApi from "src/composables/CategoryApi";

export default function categoryService() {
  const { listar, register, getById, update, remove } =
    categoryApi("categories");

  return {
    listar,
    register,
    getById,
    update,
    remove,
  };
}
