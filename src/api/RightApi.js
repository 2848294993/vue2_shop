import { request } from "@/utils/Request";
export const getRightList = () => {
  return request.get("rights/list");
}