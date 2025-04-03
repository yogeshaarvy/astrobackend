'use client';
import { useEffect } from 'react';
import PageContainer from '@/components/layout/page-container';
import { Button, buttonVariants } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { useAppSelector, useAppDispatch } from '@/redux/hooks';
import { useSearchParams } from 'next/navigation';
import EmployeeNotAllwoed from '@/components/not-allowed';
import { TCurrentEmployee, TCurrentEmployeePermission } from '@/types/globals';
// import EmployeeNotAllowedToAdd from '@/components/not-allowed-add';
import { toast } from 'sonner';
import * as XLSX from 'xlsx';
import {
  fetchAstroPackagesList,
  IAstroPackage,
  setAstroPackageData
} from '@/redux/slices/astropooja/packageSlice';
import AstroPackageTable from './package-tables';

// type TEmployeeListingPage = {
//   currentEmp: TCurrentEmployee
//   empPermissions: TCurrentEmployeePermission
// };

export default function AstroPackageListPage() {
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();
  const keyword = searchParams.get('q') || '';
  const active = searchParams.get('active') || '';
  const field = searchParams.get('field') || '';

  const page = parseInt(searchParams.get('page') ?? '1', 10);
  const pageSize = parseInt(searchParams.get('limit') ?? '5', 10);
  // const moduleId = '673f04ecd8f4b9fe9a44598a';

  const {
    astroPackageListState: {
      loading: astroPackageLoading,
      data: cData = [],
      pagination: { totalCount }
    }
  } = useAppSelector((state) => state.astroPackage);

  // UseEffect To fetch the Employee Permission
  // useEffect(() => {
  //   dispatch(fetchCurrentModulePermission(moduleId));
  // }, [])

  useEffect(() => {
    dispatch(fetchAstroPackagesList({ page, pageSize }));
    dispatch(setAstroPackageData(null));
  }, [page, pageSize]);

  // You can safely assume `eData` is populated now
  const astroPackage: IAstroPackage[] = cData;

  const handleSearch = () => {
    if ((!field && keyword) || (!keyword && field)) {
      alert('Both keyword and field is required to search with keyword');
    }
    dispatch(
      fetchAstroPackagesList({ page, pageSize, keyword, field, active })
    );
  };

  const handleExport = async () => {
    dispatch(
      fetchAstroPackagesList({
        page,
        pageSize,
        keyword,
        field,
        active,
        exportData: true
      })
    ).then((response: any) => {
      if (response?.error) {
        toast.error("Can't Export The Data Something Went Wrong");
      }
      const allAstroPackage = response.payload?.astroPackageList;
      const fileType =
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
      const fileExtension = '.xlsx';
      const fileName = 'astro_package';

      const ws = XLSX.utils.json_to_sheet(
        allAstroPackage?.map((row: any) => {
          const id = row?._id || 'N/A';
          const active = row?.active || 'false';
          const createdAt = row?.createdAt
            ? new Date(row.createdAt).toLocaleDateString('en-GB', {
                hour12: false
              })
            : 'N/A';
          const updatedAt = row?.updatedAt
            ? new Date(row.updatedAt).toLocaleDateString('en-GB', {
                hour12: false
              })
            : 'N/A';
          const title = row?.title || 'N/A';
          const desccription = row?.desccription || 'N/A';
          const price = row?.price || `N/A`;

          return {
            ID: id,
            title: title,
            desccription: desccription,
            price: price,
            Created_At: createdAt,
            Updated_At: updatedAt
          };
        })
      );

      const wb = { Sheets: { data: ws }, SheetNames: ['data'] };
      const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });

      const data = new Blob([excelBuffer], { type: fileType });
      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName + fileExtension;
      a.click();
    });
  };
  // if (empPermissions?.permission?.view === false) {
  //   return (
  //     <EmployeeNotAllwoed cardTitle={"Access Denied"} cardDescription={"You do not have permission to view this page"} cardContent={"If you believe this is an error, please contact your administrator or support team."} />
  //   );
  // } else {
  return (
    <PageContainer scrollable>
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <Heading title={`Astro Package (${totalCount})`} description="" />
          <div className="flex gap-5">
            <Button variant="default" onClick={handleExport}>
              Export All
            </Button>
            <Link
              href={'/dashboard/astro-pooja/packages/add'}
              className={buttonVariants({ variant: 'default' })}
            >
              <Plus className="mr-2 h-4 w-4" /> Add New
            </Link>
          </div>
        </div>
        <Separator />
        <AstroPackageTable
          data={astroPackage}
          totalData={totalCount}
          handleSearch={handleSearch}
        />
      </div>
    </PageContainer>
  );
}
