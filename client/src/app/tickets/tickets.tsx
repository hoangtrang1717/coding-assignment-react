import { Ticket } from "@acme/shared-models";
import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
	createTicket,
	selectCreateTicketInProgress,
	selectFilteredTickets,
	selectTicketError,
	selectTicketLoading,
} from "../store/ticketSlice";
import {
	selectUsers,
	selectUsersError,
	selectUsersLoading,
} from "../store/userSlice";
import { FilterSection } from "./components/FilterSection";
import { TicketItem } from "./components/TicketItem";

export function Tickets() {
	const dispatch = useAppDispatch();
	const tickets = useAppSelector(selectFilteredTickets);
	const ticketsLoading = useAppSelector(selectTicketLoading);
	const ticketsError = useAppSelector(selectTicketError);

	const users = useAppSelector(selectUsers);
	const usersLoading = useAppSelector(selectUsersLoading);
	const usersError = useAppSelector(selectUsersError);

	const createTicketInProgress = useAppSelector(selectCreateTicketInProgress);

	const [newDescription, setNewDescription] = useState("");

	if (ticketsLoading || usersLoading) {
		return <span>Loading...</span>;
	}

	if (ticketsError) {
		return <span>Error loading tickets</span>;
	}

	if (usersError) {
		return <span>Error loading users</span>;
	}

	const handleCreateTicket = async (
		event: React.FormEvent<HTMLFormElement>
	) => {
		event.preventDefault();
		if (!newDescription.trim()) {
			return;
		}
		await dispatch(createTicket(newDescription.trim()));
		setNewDescription("");
	};

	return (
		<div className="max-w-6xl mx-auto py-6">
			<div>
				<form
					className="flex gap-2 mb-4 items-center"
					onSubmit={handleCreateTicket}
				>
					<input
						className="border p-2 flex-1 bg-white rounded border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
						type="text"
						placeholder="Ticket description"
						onChange={(value) => {
							setNewDescription(value.target.value);
						}}
						value={newDescription}
					/>
					<button
						disabled={!newDescription.trim() || createTicketInProgress}
						className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors duration-200"
						type="submit"
					>
						{createTicketInProgress ? (
							<span>Creating...</span>
						) : (
							<span>Create Ticket</span>
						)}
					</button>
				</form>
			</div>
			<FilterSection />
			<div className="mb-4">
				<p className="font-semibold text-gray-700">
					Total Tickets: {tickets.length}
				</p>
			</div>
			<div className="space-y-4">
				{tickets.map((ticket: Ticket) => (
					<TicketItem key={ticket.id} ticket={ticket} users={users} />
				))}
			</div>
		</div>
	);
}

export default Tickets;
