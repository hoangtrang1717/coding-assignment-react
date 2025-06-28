import { Ticket, User } from "@acme/shared-models";
import { Link } from "react-router-dom";
import { useAppDispatch } from "../../store/hooks";
import {
	getUserNameById,
	handleAssignUser,
	handleToggleComplete,
} from "../../utils/ticket.utils";

export const TicketItem = ({
	ticket,
	users,
}: {
	ticket: Ticket;
	users: User[] | null;
}) => {
	const dispatch = useAppDispatch();
	return (
		<div className="border p-4 mb-2">
			<div className="flex items-center justify-between mb-2">
				<Link
					to={`/tickets/${ticket.id}`}
					className="text-blue-600 hover:underline"
				>
					<h2 className="text-xl font-semibold">
						Ticket #{ticket.id}: {ticket.description}
					</h2>{" "}
				</Link>
				<span
					className={`px-3 py-1 rounded-full text-sm font-medium ${ticket.completed
							? "bg-green-100 text-green-800"
							: "bg-yellow-100 text-yellow-800"
						}`}
				>
					{ticket.completed ? "Completed" : "Open"}
				</span>
			</div>
			<div className="block text-sm font-medium text-gray-700 mb-2">
				Assigned to:{" "}
				{getUserNameById({
					id: ticket.assigneeId,
					users: users,
				})}
			</div>

			<div className="mb-2">
				<div className="block text-sm font-medium text-gray-700 mb-1">
					Reassign Ticket
				</div>
				<select
					value={ticket.assigneeId || ""}
					onChange={(e) =>
						handleAssignUser({
							dispatch,
							ticket,
							userId: e.target.value ? parseInt(e.target.value) : null,
						})
					}
					className="px-3 py-1 border rounded mr-2 bg-white border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-auto"
				>
					<option value="">Unassign</option>
					{users?.map((u) => (
						<option key={u.id} value={u.id}>
							{u.name}
						</option>
					))}
				</select>
				<button
					onClick={() => handleToggleComplete({ dispatch, ticket })}
					type="button"
					className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 w-full sm:w-auto mt-2 sm:mt-0"
				>
					{ticket.completed ? "Mark Incomplete" : "Mark Complete"}
				</button>
			</div>
		</div>
	);
};
