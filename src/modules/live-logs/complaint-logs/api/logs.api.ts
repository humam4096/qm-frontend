
import axios from "axios";
import type { Log } from "../types";
import { getToken } from "@/lib/api";
 
export const QUERY_KEYS = {
  logs: ["logs"] as const,
} as const;
 
const BASE_URL = import.meta.env.VITE_SERVER_API_LIVE;
 
const getAuthHeaders = () => ({
  Authorization: `Bearer ${getToken()}`,
  Accept: "application/json",
});
 
export const logsApi = {
  /**
   * Fetches the initial batch of logs from the REST API.
   * Real-time updates are handled separately via WebSocket (useLiveLogs).
   */
  getLogs: async (): Promise<Log[]> => {
    const { data } = await axios.post<Log[]>(`${BASE_URL}/broadcasting/auth`, {}, {
      headers: getAuthHeaders(),
    });
    return data;
  },
};
 


// import axios from "axios";
// import type { Log } from "../types";
// import { getToken } from "@/lib/api";

// const LOGS_URL = "https://dev.api.qm.humam.sa/broadcasting/auth"


// export const logsApi = {
//   getLogs: async (): Promise<Log[]> => {

//     const token = getToken()
//     const { data } = await axios.post<Log[]>(
//       LOGS_URL,
//       {},
//       {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           withCredentials: true,
//         },
//       }
//     );
//     return data;
//   },
// };