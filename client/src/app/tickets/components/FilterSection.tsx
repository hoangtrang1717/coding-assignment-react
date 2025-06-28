import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { setFilter } from "../../store/ticketSlice";

const filterOptions = {
	all: "All",
	completed: "Completed",
	incomplete: "Incomplete",
};
export const FilterSection = () => {
	const dispatch = useAppDispatch();
	const filter = useAppSelector((state) => state.tickets.filter);

	const handleFilterChange = (value: "all" | "completed" | "incomplete") => {
		dispatch(setFilter(value));
	};

	return (
		<div className="mb-4">
			<span className="font-semibold text-gray-700 mr-2">Filter: </span>
			{Object.entries(filterOptions).map(([key, label]) => (
				<button
					key={key}
					className={`px-3 py-1 rounded mr-2 ${filter === key
							? "bg-blue-500 text-white"
							: "bg-gray-200 text-gray-700 hover:bg-gray-300"
						}`}
					type="button"
					onClick={() =>
						handleFilterChange(key as "all" | "completed" | "incomplete")
					}
				>
					{label}
				</button>
			))}
		</div>
	);
};
