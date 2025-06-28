import { Ticket } from "@acme/shared-models";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ticketApi } from "../api/ticketApi";

interface TicketState {
	tickets: Ticket[];
	loading: boolean;
	error: string | null;
	filter: "all" | "completed" | "incomplete";
	createTicketInProgress?: boolean;
}

const initialState: TicketState = {
	tickets: [],
	loading: false,
	error: null,
	filter: "all",
	createTicketInProgress: false,
};

export const fetchTickets = createAsyncThunk(
	"tickets/fetchTickets",
	async () => {
		const response = await ticketApi.fetchTickets();
		return response as Ticket[];
	}
);

export const createTicket = createAsyncThunk(
	"tickets/createTicket",
	async (description: string) => {
		const response = await ticketApi.createTicket(description);
		return response as Ticket;
	}
);

export const assignTicket = createAsyncThunk(
	"tickets/assignTicket",
	async ({ ticketId, userId }: { ticketId: number; userId: number | null }) => {
		await ticketApi.assignTicket(ticketId, userId);
		return { ticketId, userId };
	}
);

export const toggleComplete = createAsyncThunk(
	"tickets/toggleComplete",
	async ({ ticketId, completed }: { ticketId: number; completed: boolean }) => {
		await ticketApi.toggleComplete(ticketId, completed);
		return { ticketId, completed };
	}
);

const ticketSlice = createSlice({
	name: "tickets",
	initialState,
	reducers: {
		setFilter: (
			state,
			action: PayloadAction<"all" | "completed" | "incomplete">
		) => {
			state.filter = action.payload;
		},
		clearError: (state) => {
			state.error = null;
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(fetchTickets.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(
				fetchTickets.fulfilled,
				(state, action: PayloadAction<Ticket[]>) => {
					state.tickets = action.payload;
					state.loading = false;
				}
			)
			.addCase(fetchTickets.rejected, (state, action) => {
				state.loading = false;
				state.error = action.error.message || "Failed to fetch tickets";
			})
			.addCase(createTicket.pending, (state) => {
				state.createTicketInProgress = true;
				state.error = null;
			})
			.addCase(
				createTicket.fulfilled,
				(state, action: PayloadAction<Ticket>) => {
					state.tickets.push(action.payload);
					state.createTicketInProgress = false;
				}
			)
			.addCase(createTicket.rejected, (state, action) => {
				state.createTicketInProgress = false;
				state.error = action.error.message || "Failed to create ticket";
			})
			.addCase(
				assignTicket.fulfilled,
				(
					state,
					action: PayloadAction<{ ticketId: number; userId: number | null }>
				) => {
					const { ticketId, userId } = action.payload;
					const ticket = state.tickets.find((t) => t.id === ticketId);
					if (ticket) {
						ticket.assigneeId = userId;
					}
				}
			)
			.addCase(assignTicket.rejected, (state, action) => {
				console.log("Assign ticket rejected:", action.error);
			})
			.addCase(
				toggleComplete.fulfilled,
				(
					state,
					action: PayloadAction<{ ticketId: number; completed: boolean }>
				) => {
					const { ticketId, completed } = action.payload;
					const ticket = state.tickets.find((t) => t.id === ticketId);
					if (ticket) {
						ticket.completed = completed;
					}
				}
			)
			.addCase(toggleComplete.rejected, (state, action) => {
				console.log("Toggle complete rejected:", action.error);
			});
	},
});

export const { setFilter, clearError } = ticketSlice.actions;
export default ticketSlice.reducer;

// Export selectors
export const selectTickets = (state: { tickets: TicketState }) =>
	state.tickets.tickets;
export const selectTicketLoading = (state: { tickets: TicketState }) =>
	state.tickets.loading;
export const selectTicketError = (state: { tickets: TicketState }) =>
	state.tickets.error;
export const selectTicketFilter = (state: { tickets: TicketState }) =>
	state.tickets.filter;
export const selectFilteredTickets = (state: { tickets: TicketState }) => {
	const { tickets, filter } = state.tickets;
	if (filter === "completed") {
		return tickets.filter((ticket) => ticket.completed);
	} else if (filter === "incomplete") {
		return tickets.filter((ticket) => !ticket.completed);
	}
	return tickets;
};
export const selectCreateTicketInProgress = (state: { tickets: TicketState }) =>
	state.tickets.createTicketInProgress;