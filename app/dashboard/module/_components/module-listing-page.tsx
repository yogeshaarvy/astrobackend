'use client';
import PageContainer from '@/components/layout/page-container';
import { buttonVariants } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { useEffect } from 'react';
import ModuleTable from './module-tables';
import {
  fetchModuleList,
  IModule,
  setModuleData,
  updateModuleData
} from '@/redux/slices/moduleSlice';

type TModuleListingPage = {};
export default function ModuleListingPage({}: TModuleListingPage) {
  const dispatch = useAppDispatch();

  const {
    moduleListState: {
      loading,
      data: mData = [],
      pagination: { totalCount }
    }
  } = useAppSelector((state) => state.module);

  useEffect(() => {
    dispatch(fetchModuleList());
    dispatch(setModuleData(null));
  }, []);

  const moduleData: IModule[] = mData;
  return (
    <PageContainer scrollable>
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <Heading title={`Module (${totalCount})`} description="" />
          <Link
            href={`/dashboard/module/add`}
            className={buttonVariants({ variant: 'default' })}
          >
            <Plus className="mr-2 h-4 w-4" /> Add New
          </Link>
        </div>
        <Separator />
        <ModuleTable data={moduleData} totalData={totalCount} />
      </div>
    </PageContainer>
  );
}
