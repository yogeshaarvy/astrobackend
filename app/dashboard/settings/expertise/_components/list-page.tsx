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
import { toast } from 'sonner';
import * as XLSX from 'xlsx';
import {
  ISkills,
  fetchSkillsList,
  setSkillsListData
} from '@/redux/slices/skillsSlice';
import ListSkillsTable from './list-tables';

export default function SkillsPage() {
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();
  const keyword = searchParams.get('q') || '';
  const active = searchParams.get('active') || '';
  const field = searchParams.get('field') || '';

  const page = parseInt(searchParams.get('page') ?? '1', 10);
  const pageSize = parseInt(searchParams.get('limit') ?? '5', 10);

  const {
    SkillsList: {
      loading: ListLoading,
      data: storeData = [],
      pagination: { totalCount }
    }
  } = useAppSelector((state) => state.skills);

  useEffect(() => {
    dispatch(fetchSkillsList({ page, pageSize }));
    dispatch(setSkillsListData(null));
  }, [page, pageSize]);

  const list = storeData;

  const handleSearch = () => {
    if (!field || !keyword) {
      toast.warning(
        'Both Keyword and Field is required to Search with Keyword'
      );
    }
    dispatch(fetchSkillsList({ page, pageSize, keyword, field, active }));
  };

  const handleExport = async () => {
    dispatch(
      fetchSkillsList({
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
      const allSkillsList = response.payload?.Skills;
      const fileType =
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
      const fileExtension = '.xlsx';
      const fileName = 'Skills_List';
      const ws = XLSX.utils.json_to_sheet(
        allSkillsList?.map((row: any) => {
          const id = row?._id || 'N/A';
          const active = row?.active || 'false';
          const ListSkillsName = row?.name || 'N/A';
          const sequence = row?.sequence || `N/A`;
          const Question_English = row?.question?.en;
          const Answer_English = row?.answer?.en;
          const Question_Hindi = row?.question?.hi;
          const Answer_Hindi = row?.answer?.hi;
          return {
            ID: id,
            Title: ListSkillsName,
            Sequence: sequence,
            Active: active
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
  return (
    <PageContainer scrollable>
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <Heading title={`Skills (${totalCount})`} description="" />
          <div className="flex gap-5">
            {/* <Button variant="default" onClick={handleExport}>
              Export All
            </Button> */}

            <Link
              href={'/dashboard/settings/expertise/add'}
              className={buttonVariants({ variant: 'default' })}
            >
              <Plus className="mr-2 h-4 w-4" /> Add New
            </Link>
          </div>
        </div>
        <Separator />
        <ListSkillsTable
          data={list}
          totalData={totalCount}
          handleSearch={handleSearch}
        />
      </div>
    </PageContainer>
  );
}
