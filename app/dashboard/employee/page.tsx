import { searchParamsCache } from "@/lib/searchparams";
import { SearchParams } from "nuqs/parsers";
import React from "react";
import EmployeeListingPage from "./_components/employee-listing-page";
import { getCurrentEmployee } from "@/services/utlis/getCurrentEmployee";
import { getCurrentModulePermission } from "@/services/utlis/getCurrentModulePermission";
import EmployeeNotAllwoed from "@/components/not-allowed";

type PageProps = {
  searchParams: SearchParams;
};

export const metadata = {
  title: "Dashboard : Employees",
};

export default async function Page({ searchParams }: PageProps) {
  // Allow nested RSCs to access the search params (in a type-safe way)
  searchParamsCache.parse(searchParams);
  const moduleId = `673f04ecd8f4b9fe9a44598a`;
  const currentEmp = await getCurrentEmployee();
  if (!currentEmp) {
    return <div>No employee found. Please log in.</div>; // Handle missing employee case
  }

  const currentModulePermission = await getCurrentModulePermission(moduleId);

  if (!currentModulePermission) {
    return <EmployeeNotAllwoed />
  }

  return <EmployeeListingPage currentEmp={currentEmp} empPermissions={currentModulePermission} />;
}
