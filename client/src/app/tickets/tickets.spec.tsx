import { Ticket, User } from "@acme/shared-models";
import { configureStore } from "@reduxjs/toolkit";
import {
	act,
	fireEvent,
	render,
	screen,
	waitFor,
} from "@testing-library/react";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import ticketSlice from "../store/ticketSlice";
import userSlice from "../store/userSlice";
import Tickets from "./tickets";

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

const renderWithProviders = (
	component: React.ReactElement,
	initialState = {}
) => {
	const store = createMockStore(initialState);
	return render(
		<Provider store={store}>
			<BrowserRouter>{component}</BrowserRouter>
		</Provider>
	);
};

describe("Tickets", () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it("should render successfully", () => {
		const { baseElement } = renderWithProviders(<Tickets />);
		expect(baseElement).toBeTruthy();
	});

	it("should display loading state for tickets", () => {
		renderWithProviders(<Tickets />, {
			tickets: {
				tickets: [],
				loading: true,
				error: null,
				filter: "all" as const,
			},
			users: { users: mockUsers, loading: false, error: null },
		});
		expect(screen.getByText("Loading...")).toBeInTheDocument();
	});

	it("should display tickets error state", () => {
		renderWithProviders(<Tickets />, {
			tickets: {
				tickets: [],
				loading: false,
				error: "Failed to load",
				filter: "all" as const,
			},
			users: { users: mockUsers, loading: false, error: null },
		});
		expect(screen.getByText("Error loading tickets")).toBeInTheDocument();
	});

	it("should handle form submission with valid input", async () => {
		const store = createMockStore();
		const dispatchSpy = jest.spyOn(store, "dispatch");

		render(
			<Provider store={store}>
				<BrowserRouter>
					<Tickets />
				</BrowserRouter>
			</Provider>
		);

		const input = screen.getByPlaceholderText("Ticket description");
		const submitButton = screen.getByRole("button", { name: "Create Ticket" });

		fireEvent.change(input, { target: { value: "New ticket description" } });

		await act(async () => {
			fireEvent.click(submitButton);
		});

		await waitFor(() => {
			expect(dispatchSpy).toHaveBeenCalled();
		});
	});
});
