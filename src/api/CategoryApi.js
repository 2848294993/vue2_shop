import { request } from "@/utils/Request";

export const getCategoryList = (queryInfo) => {
  return request.get("categories", { params: queryInfo });

}

export const addCatConfirm = (addCatForm) => {
  return request.post("categories", addCatForm);
}