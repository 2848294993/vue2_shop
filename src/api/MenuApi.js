import { request } from "@/utils/Request";

export const getMenuList = () => {
  return request.get("menus");
}