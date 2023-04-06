import { request } from "@/utils/Request";

export const login = (loginForm) => {
  // console.log(request.post("/login", { loginForm }));
  const res = request.post("login", loginForm);
  return res;
}