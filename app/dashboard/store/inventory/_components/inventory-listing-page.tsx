'use client';
import PageContainer from '@/components/layout/page-container';
import { Separator } from '@/components/ui/separator';
import InventoryTable from './inventory-tables';
import { fetchProductsList } from '@/redux/slices/inventoriesSlice';
import { useAppSelector, useAppDispatch } from '@/redux/hooks';
import { useSearchParams } from 'next/navigation';
import { IProducts } from '@/redux/slices/store/productSlice';
import { useEffect } from 'react';

export default function InventoryListingPage() {
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();
  const keyword = searchParams?.get('q') || '';
  const page = parseInt(searchParams?.get('page') ?? '1', 10);
  const pageSize = parseInt(searchParams?.get('limit') ?? '10', 10);
  let exportData = 'false';

  const {
    productsListState: {
      loading: invetryListLoading,
      data: productData = [],
      pagination: { totalCount }
    }
  } = useAppSelector((state) => state.inventories);

  const productsdata: IProducts[] = productData;
  const handleSearch = ({
    selectedProductIds,
    selectedVariantIds,
    selectedProductsWithVariants
  }: {
    selectedProductIds: string;
    selectedVariantIds: any;
    selectedProductsWithVariants: any;
  }) => {
    dispatch(
      fetchProductsList({
        page,
        pageSize,
        keyword,
        exportData,
        selectedProductIds,
        selectedVariantIds
      })
    );
  };
  useEffect(() => {
    dispatch(
      fetchProductsList({
        page,
        pageSize,
        keyword,
        exportData
      })
    );
  }, [page, pageSize, dispatch]);
  return (
    <PageContainer scrollable>
      <div className="mr-5 space-y-4">
        <Separator />
        <InventoryTable
          data={productsdata}
          totalData={totalCount}
          handleSearch={handleSearch}
        />
      </div>
    </PageContainer>
  );
}
