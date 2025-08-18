import { fetchApi } from "./fetchApi";

export async function getCurrentModulePermission(entityId: string) {
    try {
        const response = await fetchApi(`/employee/permission/${entityId}`, { method: 'GET' });
        const employeePermission = response.employeePermission
        return employeePermission;
    } catch (error: any) {
        console.error("Error!! While Fetching the Employee Permissions", error);
        return null;
    }
}