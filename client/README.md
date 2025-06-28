# Client

This is the React implementation of the Tickets webapp.

### Features
- **View Tickets**: List all tickets with their details.
- **Add Ticket**: Create new tickets with a description; default status is "Open".
- **Filter Tickets**: Filter tickets by status (All, Complete, Incomplete).
- **Assign Ticket**: Assign a ticket to a user.
- **Complete Ticket**: Mark a ticket as complete or incomplete.
- **Ticket Details**: View detailed information about a ticket, including its status and assignee.

### State Management
- Uses Redux Toolkit for state management.

### Styling
- Uses Tailwind CSS for styling.

### Folder Structure
- `src/app`: Main application components.
- `src/app/ticket-list`: Ticket list component.
- `src/app/ticket-details`: Ticket details component.
- `src/app/store`: Redux store and slices for tickets and users.
- `src/app/api`: API service for fetching tickets and users.

### Time Spent
- Approximately 3 hours to implement features and styling.
- 1 hour for writing tests and documentation.