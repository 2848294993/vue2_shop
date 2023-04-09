import { request } from "@/utils/Request";
export const getRoleList = () => {
  return request.get("roles");
}

export const closeTag = (rId, rightId) => {
  return request.delete(`roles/${rId}/rights/${rightId}`);
}

export const getRightList = () => {
  return request.get("rights/tree");
}

export const confirmRights = (roleId, rightStr) => {
  return request.post(`roles/${roleId}/rights`, { rids: rightStr });
}