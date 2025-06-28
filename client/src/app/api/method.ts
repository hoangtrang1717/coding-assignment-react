export const get = async (url: string, params?: Record<string, string>) => {
	const query = new URLSearchParams(params).toString();
	const response = await fetch(`${url}?${query}`);
	if (!response.ok) {
		throw new Error(`GET request failed: ${response.statusText}`);
	}
	return response.json();
}

export const post = async (url: string, body: Record<string, string>) => {
	const response = await fetch(url, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(body),
	});
	if (!response.ok) {
		throw new Error(`POST request failed: ${response.statusText}`);
	}
	return response.json();
}

export const put = async (url: string, body?: Record<string, string>) => {
	const response = await fetch(url, {
		method: 'PUT',
		headers: { 'Content-Type': 'application/json' },
		body: body ? JSON.stringify(body) : undefined,
	});
	if (!response.ok) {
		throw new Error(`PUT request failed: ${response.statusText}`);
	}
	if (response.status === 204) {
		return null;
	}
	return response.json();
}

export const del = async (url: string) => {
	const response = await fetch(url, { method: 'DELETE' });
	if (!response.ok) {
		throw new Error(`DELETE request failed: ${response.statusText}`);
	}
	if (response.status === 204) {
		return null;
	}
	return response.json();
}
