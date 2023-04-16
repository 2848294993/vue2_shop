import { request } from "@/utils/Request";
export const getReportList = () => {
  return request.get("reports/type/1");
}