import axios from "axios";
import type { Log } from "../types";
import { getToken } from "@/lib/api";

export const logsApi = {
  getLogs: async (): Promise<Log[]> => {

    const token = getToken()
    const { data } = await axios.get<Log[]>(
      "https://dev.api.qm.humam.sa/broadcasting/auth",
      {
        headers: {
          Authorization: `Bearer ${token}`,
          withCredentials: true,
        },
      }
    );
    return data;
  },
};