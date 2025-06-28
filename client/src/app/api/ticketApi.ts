import { API_ENDPOINTS } from "./config";
import { del, get, post, put } from "./method";

const fetchTickets = () => {
  return get(API_ENDPOINTS.TICKETS);
};

const createTicket = (description: string) => {
  return post(API_ENDPOINTS.TICKETS, { description });
};

const assignTicket = (ticketId: number, userId: number | null) => {
  const url = API_ENDPOINTS.ASSIGN_TICKET(ticketId, userId);
  return put(url);
};

const toggleComplete = (ticketId: number, completed: boolean) => {
  const url = API_ENDPOINTS.TOGGLE_COMPLETE(ticketId);
  if (completed) {
    return put(url);
  }
  return del(url);
};

export const ticketApi = {
  fetchTickets,
  createTicket,
  assignTicket,
  toggleComplete,
};