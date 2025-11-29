import { apiClient } from "./apiClient";

export interface LoginResponse {
  token: string;
  user: {
    id: string;       
    username: string;
  };
}

export const authApi = {
  async login(username: string, password: string): Promise<LoginResponse> {
    const response = await apiClient.post("/auth/login", { username, password });
    return response.data;
  },

  async register(
    username: string,
    password: string
  ): Promise<{ message: string }> {
    const response = await apiClient.post("/auth/register", {
      username,
      password,
    });

    return response.data;
  },
};
