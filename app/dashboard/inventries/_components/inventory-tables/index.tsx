'use client';

import { DataTable } from '@/components/ui/table/data-table';
import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';

import { useAppDispatch, useAppSelector } from '@/redux/hooks';

import { Button } from '@/components/ui/button';
import CustomReactSelect from '@/utils/CustomReactSelect';
import { fetchProductsList, IInventory } from '@/redux/slices/inventoriesSlice';
import { useCallback, useEffect, useState } from 'react';
import { debounce } from 'lodash';
import { IProducts } from '@/redux/slices/productSlice';

export default function InventoryTable({
  data,
  totalData,
  handleSearch
}: {
  data: IInventory[];
  totalData: number;
  handleSearch: any;
}) {
  const {
    productsListState: {
      loading: invetryListLoading,
      data: pData = [],
      pagination: { totalCount }
    }
  } = useAppSelector((state) => state.inventories);
  const [ProductsQuery, setProductsQuery] = useState<string>('');
  const [selectedProducts, setSelectedProducts] = useState<any[]>([]);
  const [filteredData, setFilteredData] = useState<IInventory[]>(data);

  const handleProductChange = (selectedOption: any) => {
    setSelectedProducts(selectedOption);
  };
  useEffect(() => {
    if (selectedProducts.length <= 0) {
      dispatch(fetchProductsList());
    }
  }, []);
  const dispatch = useAppDispatch();
  const debouncedSearchProducts = useCallback(
    debounce((query) => {
      if (query.trim()) {
        dispatch(fetchProductsList({ keyword: query }));
      }
    }, 800),
    [dispatch]
  );

  const handleSearchProducts = (query: string) => {
    setProductsQuery(query);
    debouncedSearchProducts(query);
  };

  const handleReset = () => {
    setProductsQuery('');
    setSelectedProducts([]);
    setFilteredData(data);
    debouncedSearchProducts.cancel(); // Cancel any pending API call
  };

  const handleSearchClick = () => {
    const selectedIds = selectedProducts
      .map((product: any) => product._id)
      .join(',');
    handleSearch({ selectedProductIds: selectedIds });
  };

  useEffect(() => {
    if (selectedProducts.length > 0) {
      const selectedIds = selectedProducts.map((product: any) => product._id);
      const filtered = data.filter((item) => selectedIds.includes(item._id));
      setFilteredData(filtered);
    } else {
      setFilteredData(data); // Default to 10 products
    }
  }, [selectedProducts, data]);

  const columns: ColumnDef<IProducts>[] = [
    {
      id: 'number',
      header: 'S.No.',
      cell: ({ row, table }) => {
        const currentPage = table.getState().pagination.pageIndex; // Current page index
        const pageSize = table.getState().pagination.pageSize; // Number of items per page
        return <span>{currentPage * pageSize + row.index + 1}</span>; // Calculate correct S.No
      },
      enableSorting: false,
      enableHiding: false
    },
    {
      id: 'select',
      header: ({ table }) => '',
      cell: ({ row }) => '',
      enableSorting: false,
      enableHiding: false
    },

    {
      accessorKey: 'name',
      header: 'NAME'
    },
    {
      accessorKey: 'variants',
      header: 'VARIANTS',
      cell: ({ row }) => {
        if (
          row.original.productype === 'variableproduct' &&
          row.original.stockManagement?.stock_management_level ===
            'product_level'
        ) {
          return <span>{''}</span>;
        } else {
          const variantsNames = row.original?.variants[0]?.values
            .map((e: any) => e?.short_name)
            .join(', ');
          return <span>{variantsNames || ''}</span>;
        }
      }
    },

    {
      accessorKey: 'total_stock',
      header: 'STOCK',
      cell: ({ row }) => {
        if (
          row.original.productype === 'variableproduct' &&
          row.original.stockManagement?.stock_management_level ===
            'product_level'
        ) {
          const stocks = row.original?.totalStock;

          return <span>{stocks || ''}</span>;
        } else {
          const stocks = row.original?.variants[0]?.totalStock;
          return <span>{stocks || ''}</span>;
        }
      }
    },
    {
      accessorKey: 'stock_status',
      header: 'STATUS',
      cell: ({ row }) => {
        if (
          row.original.productype === 'variableproduct' &&
          row.original.stockManagement?.stock_management_level ===
            'product_level'
        ) {
          const stockstaus =
            row.original?.stock_status === 'true' ? 'In Stock' : 'Out Of Stock';
          return <span>{stockstaus || ''}</span>;
        } else {
          const stockstaus =
            row.original?.variants[0]?.stock_status === 'true'
              ? 'In Stock'
              : 'Out Of Stock';
          return <span>{stockstaus || ''}</span>;
        }
      }
    },
    {
      header: 'ACTIONS',
      id: 'actions',
      cell: ({ row }) => <CellAction data={row.original} />
    }
  ];

  return (
    <div className="space-y-4 ">
      <div className="flex flex-wrap items-center gap-4">
        <CustomReactSelect
          options={pData} // Use the fetched products list
          getOptionLabel={(option) => option.name}
          getOptionValue={(option) => option._id}
          placeholder="Search and Select Products"
          onInputChange={handleSearchProducts}
          onChange={handleProductChange} // Store selected products
          value={selectedProducts} // Maintain selection state
          isMulti
        />
        <Button variant="outline" onClick={handleSearchClick}>
          Search
        </Button>
        <Button variant="destructive" onClick={handleReset}>
          Reset
        </Button>
      </div>
      <DataTable columns={columns} data={filteredData} totalItems={totalData} />
    </div>
  );
}
