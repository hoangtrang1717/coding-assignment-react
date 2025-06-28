const BASE_URL = "http://localhost:4200/api";

export const API_ENDPOINTS = {
	TICKETS: `${BASE_URL}/tickets`,
	USERS: `${BASE_URL}/users`,
	ASSIGN_TICKET: (ticketId: number, userId: number | null) =>
		userId
			? `${BASE_URL}/tickets/${ticketId}/assign/${userId}`
			: `${BASE_URL}/tickets/${ticketId}/unassign`,
	TOGGLE_COMPLETE: (ticketId: number) =>
		`${BASE_URL}/tickets/${ticketId}/complete`,
};
