import axios from "axios";

export const request = axios.create({
  baseURL: "http://127.0.0.1:8888/api/private/v1/",

})
