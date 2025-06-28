import { Ticket, User } from "@acme/shared-models";
import { configureStore } from "@reduxjs/toolkit";
import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import ticketSlice from "../store/ticketSlice";
import userSlice from "../store/userSlice";
import TicketDetails from "./ticket-details";

jest.mock("../utils/ticket.utils", () => ({
	getUserNameById: jest.fn(({ id, users }) => {
		const user = users?.find((u: User) => u.id === id);
		return user?.name || "Unassigned";
	}),
	handleAssignUser: jest.fn(),
	handleToggleComplete: jest.fn(),
}));

const mockTickets: Ticket[] = [
	{ id: 1, description: "Fix login bug", assigneeId: 1, completed: false },
	{
		id: 2,
		description: "Update documentation",
		assigneeId: 2,
		completed: true,
	},
	{ id: 3, description: "Add new feature", assigneeId: null, completed: false },
];

const mockUsers: User[] = [
	{ id: 1, name: "John Doe" },
	{ id: 2, name: "Jane Smith" },
	{ id: 3, name: "Bob Johnson" },
];

const createMockStore = (initialState = {}) => {
	const defaultState = {
		tickets: {
			tickets: mockTickets,
			loading: false,
			error: null,
			filter: "all" as "all" | "completed" | "incomplete",
		},
		users: {
			users: mockUsers,
			loading: false,
			error: null,
		},
		...initialState,
	};

	return configureStore({
		reducer: {
			tickets: ticketSlice,
			users: userSlice,
		},
		preloadedState: defaultState,
	});
};

const renderWithProviders = (ticketId: string, { initialState = {} } = {}) => {
	const store = createMockStore(initialState);
	return render(
		<Provider store={store}>
			<MemoryRouter initialEntries={[`/tickets/${ticketId}`]}>
				<Routes>
					<Route path="/tickets/:id" element={<TicketDetails />} />
				</Routes>
			</MemoryRouter>
		</Provider>
	);
};

describe("TicketDetails", () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it("should render ticket details correctly", () => {
		renderWithProviders("1");

		expect(screen.getByText("Ticket #1: Fix login bug")).toBeInTheDocument();
		expect(
			screen.getByRole("button", { name: "Mark Complete" })
		).toBeInTheDocument();
		expect(screen.getByText("Reassign Ticket")).toBeInTheDocument();
	});

	it("should show different button text for completed tickets", () => {
		renderWithProviders("2");

		expect(
			screen.getByText("Ticket #2: Update documentation")
		).toBeInTheDocument();
		expect(
			screen.getByRole("button", { name: "Mark Incomplete" })
		).toBeInTheDocument();
	});

	it("should handle non-existent tickets", () => {
		renderWithProviders("999");

		expect(screen.getByText("Ticket not found")).toBeInTheDocument();
	});
});
