import { API_ENDPOINTS } from "./config";
import { get } from "./method";

export const fetchUsers = () => {
    return get(API_ENDPOINTS.USERS);
}