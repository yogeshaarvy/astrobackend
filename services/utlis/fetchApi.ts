import { getCurrentEmployee } from "./getCurrentEmployee";

interface Headers {
    [key: string]: string;
}

interface FetchOptions {
    method?: string;
    headers?: Headers;
    body?: any;
}

interface ApiInstanceOptions {
    baseURL: string;
    headers?: Headers;
}

export function createApiInstance(options: ApiInstanceOptions) {
    return async <T = any>(endpoint: string, fetchOptions: FetchOptions = {}): Promise<T> => {
        const { baseURL, headers: defaultHeaders } = options;
        const { method = "GET", headers = {}, body } = fetchOptions;

        // If body is an instance of FormData, don't stringify it
        let finalBody = body;
        if (!(body instanceof FormData)) {
            finalBody = JSON.stringify(body);
        }

        // Fetch the authorization token
        const employee = await getCurrentEmployee();
        const authHeader: Headers = employee?.accessToken
            ? { Authorization: `Bearer ${employee.accessToken}` }
            : {};

        // Merge headers
        const finalHeaders = body instanceof FormData
            ? { ...defaultHeaders, ...headers, ...authHeader }
            : { ...defaultHeaders, ...headers, ...authHeader, 'Content-Type': 'application/json' };

        // Make the API request
        const response = await fetch(`${baseURL}${endpoint}`, {
            method,
            headers: finalHeaders,
            body: finalBody,
        });

        if (!response.ok) {
            let errorMsg = `HTTP error! status: ${response.status}`;
            try {
                const errorData = await response.json();
                if (errorData.message) {
                    errorMsg = errorData.message;
                }
            } catch (err) {
                // Ignore JSON parsing errors
            }
            throw new Error(errorMsg);
        }

        return response.json() as Promise<T>;
    };
}

export const fetchApi = createApiInstance({
    baseURL: `${process.env.NEXT_PUBLIC_APP_API_URL}/api/V1`,
});
