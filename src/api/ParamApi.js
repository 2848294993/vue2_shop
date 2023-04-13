import { request } from "@/utils/Request";

export const getParamList = (id, sel) => {
  return request.get(`categories/${id}/attributes`, { params: { sel } });
}

export const addParam = (addParamForm) => {
  return request.post(`categories/${addParamForm.cat_id}/attributes`, addParamForm);
}

export const editParam = (editParamForm) => {
  return request.put(`categories/${editParamForm.cat_id}/attributes/${editParamForm.attr_id}`, editParamForm);
}

export const deleteParam = (deleteParamForm) => {
  return request.delete(`categories/${deleteParamForm.cat_id}/attributes/${deleteParamForm.attr_id}`);
}

export const addTag = (addTagForm) => {
  return request.put(`categories/${addTagForm.cat_id}/attributes/${addTagForm.attr_id}`, addTagForm);
}