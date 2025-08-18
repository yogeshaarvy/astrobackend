'use client';
import { useEffect } from 'react';
import PageContainer from '@/components/layout/page-container';
import { Button, buttonVariants } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import EmployeeTable from './employee-tables';
import { fetchCurrentModulePermission, fetchEmployeeList, IEmployee, setEmployeeData } from '@/redux/slices/employeeSlice';
import { useAppSelector, useAppDispatch } from '@/redux/hooks';
import { useSearchParams } from 'next/navigation';
import { ModulePermission } from '@/redux/slices/departmentSlice';
import { IModule } from '@/redux/slices/moduleSlice';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import EmployeeNotAllwoed from '@/components/not-allowed';
import { TCurrentEmployee, TCurrentEmployeePermission } from '@/types/globals';


type TEmployeeListingPage = {
  currentEmp: TCurrentEmployee
  empPermissions: TCurrentEmployeePermission
};

export default function EmployeeListingPage({ currentEmp, empPermissions }: TEmployeeListingPage) {
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();
  const page = parseInt(searchParams.get("page") ?? '1', 10);
  const pageSize = parseInt(searchParams.get("limit") ?? '5', 10);
  const moduleId = '673f04ecd8f4b9fe9a44598a';

  const {
    employeeListState: {
      loading: employeeListLoading,
      data: eData = [],
      pagination: { totalCount }
    }
  } = useAppSelector((state) => state.employee);


  // UseEffect To fetch the Employee Permission
  // useEffect(() => {
  //   dispatch(fetchCurrentModulePermission(moduleId));
  // }, [])

  useEffect(() => {
    dispatch(fetchEmployeeList({ page, pageSize }));
    dispatch(setEmployeeData(null));
  }, [page, pageSize]); // Ensure this is run only once when the component mounts

  // You can safely assume `eData` is populated now
  const employee: IEmployee[] = eData;


  if (empPermissions?.permission?.view === false) {
    return (
      <EmployeeNotAllwoed cardTitle={"Access Denied"} cardDescription={"You do not have permission to view this page"} cardContent={"If you believe this is an error, please contact your administrator or support team."}/>
    );
  } else {
    return (
      <PageContainer scrollable>
        <div className="space-y-4">
          <div className="flex items-start justify-between">
            <Heading title={`Employee (${totalCount})`} description="" />
            {empPermissions.permission.add ? <Link
              href={'/dashboard/employee/add'}
              className={buttonVariants({ variant: 'default' })}
            >
              <Plus className="mr-2 h-4 w-4" /> Add New
            </Link> :
              <>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button>
                      <Plus className='mr-2 h-4 w-4' /> Add New
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Permission Denied</AlertDialogTitle>

                    </AlertDialogHeader>
                    <AlertDialogDescription>
                      You do not have permission to add new employee. Please contact the administrator for access.
                    </AlertDialogDescription>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Close</AlertDialogCancel>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </>}
          </div>
          <Separator />
          <EmployeeTable data={employee} totalData={totalCount} />
        </div>
      </PageContainer>
    );
  }


}
