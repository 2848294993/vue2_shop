import { request } from "@/utils/Request";

export const getGoodsList = (queryInfo) => {
  return request.get("goods", { params: queryInfo });
}

export const addGoods = (form) => {
  return request.post("goods", form);
}