import unitApi from "src/composables/UnitApi";

export default function unitService() {
  const { listar, register, getById, update, remove } = unitApi("units");

  return {
    listar,
    register,
    getById,
    update,
    remove,
  };
}
