import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { selectTickets } from "../store/ticketSlice";
import { selectUsers } from "../store/userSlice";
import {
	getUserNameById,
	handleAssignUser,
	handleToggleComplete,
} from "../utils/ticket.utils";

export function TicketDetails() {
	const { id } = useParams();
	const dispatch = useAppDispatch();

	const tickets = useAppSelector(selectTickets);
	const users = useAppSelector(selectUsers);

	const ticket = tickets.find((ticket) => ticket.id === Number(id));

	if (!ticket) {
		return <div className="p-4">Ticket not found</div>;
	}

	return (
		<div className="max-w-6xl mx-auto py-6">
			<div className="bg-white rounded-lg shadow-md border border-gray-200 mb-6">
				<div className="p-6 border-b border-gray-200">
					<div className="flex items-start justify-between">
						<div>
							<h3 className="text-xl font-semibold text-gray-900 mb-2">
								Ticket #{ticket.id}: {ticket.description}
							</h3>
						</div>
						<span
							className={`px-3 py-1 rounded-full text-sm font-medium ${ticket.completed
								? "bg-green-100 text-green-800"
								: "bg-yellow-100 text-yellow-800"
								}`}
						>
							{ticket.completed ? "Completed" : "Open"}
						</span>
					</div>
				</div>

				<div className="p-6 space-y-4">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div>
							<div className="block text-sm font-medium text-gray-700 mb-1">
								Status
							</div>
							<p className="text-gray-900">
								{ticket.completed ? "Completed" : "Incomplete"}
							</p>
						</div>
						<div>
							<div className="block text-sm font-medium text-gray-700 mb-1">
								Assigned to
							</div>
							<p className="text-gray-900">
								{getUserNameById({
									id: ticket.assigneeId,
									users: users,
								}) || "Unassigned"}
							</p>
						</div>
					</div>
					<div className="pt-4 border-t border-gray-200">
						<div className="flex flex-col sm:flex-row gap-4">
							<div className="flex-1">
								<div className="block text-sm font-medium text-gray-700 mb-2">
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
									className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
								>
									<option value="">Unassign</option>
									{users?.map((u) => (
										<option key={u.id} value={u.id}>
											{u.name}
										</option>
									))}
								</select>
							</div>
							<div className="flex items-end">
								<button
									onClick={() => handleToggleComplete({ dispatch, ticket })}
									type="button"
									className="bg-blue-500 text-white px-3 py-2 rounded hover:bg-blue-600 w-full sm:w-auto"
								>
									{ticket.completed ? "Mark Incomplete" : "Mark Complete"}
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default TicketDetails;
