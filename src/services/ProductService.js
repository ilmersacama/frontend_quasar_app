import productApi from "src/composables/ProductApi";

export default function productService() {
  const { listar, register, getById, update, remove } = productApi("items");

  return {
    listar,
    register,
    getById,
    update,
    remove,
  };
}
