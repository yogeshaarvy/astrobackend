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
import { IProducts } from '@/redux/slices/store/productSlice';
import { useSearchParams } from 'next/navigation';

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
  const [isExporting, setIsExporting] = useState(false);
  const searchParams = useSearchParams();
  const pageSize = parseInt(searchParams?.get('limit') ?? '10', 10);
  const page = parseInt(searchParams?.get('page') ?? '1', 10);

  const handleProductChange = (selectedOption: any) => {
    setSelectedProducts(selectedOption);
  };
  useEffect(() => {
    if (selectedProducts.length <= 0) {
      dispatch(
        fetchProductsList({
          pageSize,
          page,
          exportData: 'false'
        })
      );
    }
  }, []);
  const dispatch = useAppDispatch();
  const debouncedSearchProducts = useCallback(
    debounce((query) => {
      if (query.trim()) {
        dispatch(
          fetchProductsList({
            keyword: query,
            page,
            pageSize,
            exportData: 'false'
          })
        );
      }
    }, 800),
    [dispatch]
  );

  const handleSearchProducts = (query: string) => {
    setProductsQuery(query);
    debouncedSearchProducts(query);
  };

  // CSV Export function - fetches all data from DB
  const handleExportCSV = async () => {
    setIsExporting(true);
    try {
      // Dispatch action to fetch all data for export
      const result = await dispatch(
        fetchProductsList({
          exportData: 'true', // Send export flag to API
          // Remove pagination limits for full data export
          pageSize: 999999, // Large number to get all records
          page: 1
        })
      ).unwrap();
      // Use the fetched export data
      const exportData = result?.productsdata || [];
      const csvHeaders = [
        'S.No.',
        'Name',
        'Variants',
        'Stock',
        'Stock Management Level',
        'Inventory Id'
      ];

      const csvData = exportData.map((item: any, index: number) => {
        // Get variants
        let variants = '';
        if (
          item.productype === 'variableproduct' &&
          item.stockManagement?.stock_management_level === 'product_level'
        ) {
          variants = '';
        } else {
          variants =
            item?.variants?.[0]?.values
              ?.map((e: any) => e?.short_name)
              .join(', ') || '';
        }

        // Get stock
        let stock = '';
        if (
          item.productype === 'variableproduct' &&
          item.stockManagement?.stock_management_level === 'variable_level'
        ) {
          stock = item?.variants?.[0]?.totalStock || '';
        } else {
          stock = item?.stock_value || '';
        }

        // Get status
        let status = '';
        if (
          item.productype === 'variableproduct' &&
          item.stockManagement?.stock_management_level === 'product_level'
        ) {
          status = item?.stock_status === 'true' ? 'In Stock' : 'Out Of Stock';
        } else {
          status =
            item?.variants?.[0]?.stock_status === 'true'
              ? 'In Stock'
              : 'Out Of Stock';
        }

        let stock_management_level = '';
        if (
          item.productype === 'variableproduct' &&
          item.stockManagement?.stock_management_level === 'variable_level'
        ) {
          stock_management_level = 'Variable Level';
        } else {
          stock_management_level = 'Product Level';
        }
        let InventoryId = item.lastInventoryId ? item.lastInventoryId : '';

        return [
          index + 1,
          item.name || '',
          variants,
          stock,
          stock_management_level,
          InventoryId
        ];
      });

      // Convert to CSV format
      const csvContent = [
        csvHeaders.join(','),
        ...csvData.map((row: any) =>
          row
            .map((cell: any) => `"${String(cell).replace(/"/g, '""')}"`)
            .join(',')
        )
      ].join('\n');

      // Create and download file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute(
        'download',
        `inventory_export_${new Date().toISOString().split('T')[0]}.csv`
      );
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error exporting CSV:', error);
      // You can add a toast notification here for better UX
      alert('Failed to export data. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleReset = () => {
    setProductsQuery('');
    setSelectedProducts([]);
    setFilteredData(data);
    debouncedSearchProducts.cancel(); // Cancel any pending API call
  };

  const handleSearchClick = () => {
    // Format the selected products for search including both product IDs and variant IDs
    const selectedProductsWithVariants = selectedProducts.map(
      (product: any) => {
        // Get the variant ID if available
        const variantId =
          product.variants && product.variants.length > 0
            ? product.variants[0]._id // Use the first variant's ID
            : null;

        return {
          productId: product._id,
          variantId: variantId
        };
      }
    );

    // Create a query string of product IDs
    const selectedProductIds = selectedProducts
      .map((product: any) => product._id)
      .join(',');

    // Create a query string of variant IDs (if available)
    const selectedVariantIds = selectedProducts
      .map((product: any) =>
        product.variants && product.variants.length > 0
          ? product.variants[0]._id
          : null
      )
      .filter((id) => id !== null)
      .join(',');

    // Pass both product IDs and variant IDs to the search handler
    handleSearch({
      selectedProductIds: selectedProductIds,
      selectedVariantIds: selectedVariantIds,
      // Also pass the complete objects in case you need more detailed processing
      selectedProductsWithVariants: selectedProductsWithVariants
    });
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
        <Button
          variant="default"
          onClick={handleExportCSV}
          disabled={isExporting}
        >
          {isExporting ? 'Exporting...' : 'Export CSV'}
        </Button>
      </div>
      <DataTable columns={columns} data={filteredData} totalItems={totalData} />
    </div>
  );
}
