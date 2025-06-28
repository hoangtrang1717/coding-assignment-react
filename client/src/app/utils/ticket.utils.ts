import { Ticket, User } from "@acme/shared-models";
import { useAppDispatch } from "../store/hooks";
import { assignTicket, toggleComplete } from "../store/ticketSlice";

export const getUserNameById = ({
	id,
	users,
}: {
	id: number | null;
	users: User[] | null;
}): string => {
	if (!users) return "Unassigned";
	const user = users.find((user) => user.id === id);
	return user ? user.name : "Unassigned";
};

export const handleToggleComplete = ({
	dispatch,
	ticket,
}: {
	dispatch: ReturnType<typeof useAppDispatch>;
	ticket: Ticket;
}) => {
	dispatch(
		toggleComplete({
			ticketId: ticket.id,
			completed: !ticket.completed,
		})
	);
};

export const handleAssignUser = ({
	dispatch,
	ticket,
	userId,
}: {
	dispatch: ReturnType<typeof useAppDispatch>;
	ticket: Ticket;
	userId: number | null;
}) => {
	dispatch(
		assignTicket({
			ticketId: ticket.id,
			userId: userId ? userId : null,
		})
	);
};
