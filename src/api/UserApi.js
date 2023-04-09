import { request } from "@/utils/Request";

export const getUserList = (queryInfo) => {
  return request.get("users", { params: queryInfo })
}

export const addUser = (userForm) => {
  return request.post("users", userForm);
}

export const stateChange = (user) => {
  return request.put(`users/${user.id}/state/${user.mg_state}`);
}

export const editUser = (user) => {
  return request.put("users/" + user.id, { email: user.email, mobile: user.mobile });
}

export const deleteUser = (id) => {
  return request.delete("users/" + id);

}
export const setRole = (id, rid) => {
  return request.put(`users/${id}/role`, { rid });
}