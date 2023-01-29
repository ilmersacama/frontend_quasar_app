import userApi from "src/composables/UserApi";

export default function userService() {
  const { listar, register, getById, update, remove } = userApi("users");

  return {
    listar,
    register,
    getById,
    update,
    remove,
  };
}
