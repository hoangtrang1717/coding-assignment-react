import { User } from "@acme/shared-models";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchUsers as fetchUsersApi } from "../api/userApi";

interface UserState {
	users: User[];
	loading: boolean;
	error: string | null;
}

const initialState: UserState = {
	users: [],
	loading: false,
	error: null,
};

export const fetchUsers = createAsyncThunk("users/fetchUsers", async () => {
	const response = await fetchUsersApi();
	return response as User[];
});

const usersSlice = createSlice({
	name: "users",
	initialState,
	reducers: {
		clearError: (state) => {
			state.error = null;
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(fetchUsers.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(fetchUsers.fulfilled, (state, action) => {
				state.loading = false;
				state.users = action.payload;
			})
			.addCase(fetchUsers.rejected, (state, action) => {
				state.loading = false;
				state.error = action.error.message || "Failed to fetch users";
			});
	},
});

export const { clearError } = usersSlice.actions;
export default usersSlice.reducer;

// Export selectors
export const selectUsers = (state: { users: UserState }) => state.users.users;
export const selectUsersLoading = (state: { users: UserState }) =>
	state.users.loading;
export const selectUsersError = (state: { users: UserState }) =>
	state.users.error;
