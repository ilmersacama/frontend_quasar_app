import { api } from "boot/axios";

export default function categoryApi(url) {
  //get users list
  const listar = async () => {
    try {
      const { data } = await api.get(url);
      return data;
    } catch (error) {
      throw new Error(error);
    }
  };

  const register = async (payload) => {
    try {
      const { confirm } = await api.post(url, payload);
      return confirm;
    } catch (error) {
      throw new Error(error);
    }
  };

  const getById = async (id) => {
    try {
      const { data } = await api.get(`${url}/${id}`);
      return data;
    } catch (error) {
      throw new Error(error);
    }
  };

  const update = async (payload) => {
    try {
      const { confirm } = await api.put(`${url}/${payload.id}`, payload);
      return confirm;
    } catch (error) {
      throw new Error(error);
    }
  };

  const remove = async (id) => {
    try {
      const { data } = await api.delete(`${url}/${id}`);
      return data;
    } catch (error) {
      throw new Error(error);
    }
  };
  return {
    listar,
    register,
    getById,
    update,
    remove,
  };
}
