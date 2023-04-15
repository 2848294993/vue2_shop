import { request } from "@/utils/Request";
export const getOrderList = (queryInfo) => {
  return request.get("orders", { params: queryInfo })
}