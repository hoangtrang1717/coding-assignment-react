import { useEffect } from "react";
import { Route, Routes } from "react-router-dom";

import { useAppDispatch } from "./store/hooks";
import { fetchTickets } from "./store/ticketSlice";
import { fetchUsers } from "./store/userSlice";
import TicketDetails from "./ticket-details/ticket-details";
import Tickets from "./tickets/tickets";

const App = () => {
	const dispatch = useAppDispatch();

	useEffect(() => {
		dispatch(fetchTickets());
		dispatch(fetchUsers());
	}, [dispatch]);

	return (
		<div className="max-w-6xl mx-auto p-4">
			<h1 className="text-4xl font-bold">Ticketing App</h1>
			<Routes>
				<Route path="/" element={<Tickets />} />
				<Route path="/tickets/:id" element={<TicketDetails />} />
			</Routes>
		</div>
	);
};

export default App;
