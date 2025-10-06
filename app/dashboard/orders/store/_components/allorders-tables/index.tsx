'use client';

import { DataTable } from '@/components/ui/table/data-table';
import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
// Import icons for download functionality
import { Download, FileText } from 'lucide-react';
// Import Radix UI Select components
import * as Select from '@radix-ui/react-select';
import { ChevronDownIcon, ChevronUpIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useEffect, useState } from 'react';
import jsPDF from 'jspdf';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import html2canvas from 'html2canvas';
import moment from 'moment';
import { CellAction } from './cell-action';
import { IAllOrdersList } from '@/redux/slices/store/allordersSlice';

export default function AllOrdersTable({
  data,
  totalData,
  handleSearch,
  startDate,
  email,
  endDate,
  handlestartdateChange,
  handleenddateChange,
  handleEmailInputChange,
  paymentStatus,
  orderStatus,
  handlePaymentStatusChange,
  handleOrderStatusChange,
  orderNo,
  handleOrderNoInputChange
}: {
  data: IAllOrdersList[];
  totalData: number;
  handleSearch: any;
  startDate: string;
  endDate: string;
  email: string;
  handlestartdateChange: any;
  handleenddateChange: any;
  handleEmailInputChange: any;
  paymentStatus?: string;
  orderStatus?: string;
  handlePaymentStatusChange?: (value: string) => void;
  handleOrderStatusChange?: (value: string) => void;
  orderNo: string;
  handleOrderNoInputChange: any;
}) {
  const logoPath = '/logo.png';

  // State to manage selected items
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  // Function to handle individual checkbox selection
  const handleSelectItem = (itemId: string, checked: boolean) => {
    setSelectedItems((prev) => {
      if (checked) {
        return [...prev, itemId];
      } else {
        return prev.filter((id) => id !== itemId);
      }
    });
  };
  // Function to handle select all checkbox
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const allIds = data
        .map((item) => item._id)
        .filter((id): id is string => typeof id === 'string');
      setSelectedItems(allIds);
    } else {
      setSelectedItems([]);
    }
  };

  // Check if all items are selected
  const isAllSelected = data.length > 0 && selectedItems.length === data.length;
  const isIndeterminate =
    selectedItems.length > 0 && selectedItems.length < data.length;

  // 🧾 Generate individual invoice PDF

  const generatePDFInvoice = async (order: IAllOrdersList): Promise<Blob> => {
    console.log('this is for transition', order);
    // Create invoice container (hidden off-screen)
    const invoiceContainer = document.createElement('div');
    invoiceContainer.style.padding = '0';
    invoiceContainer.style.position = 'absolute';
    invoiceContainer.style.top = '-9999px';
    invoiceContainer.style.left = '-9999px';
    invoiceContainer.style.width = '800px';
    // Calculate subtotal function
    const calculateSubtotal = () => {
      return (
        order?.products?.reduce((total: number, product: any) => {
          return total + (product?.totalAmount || 0);
        }, 0) || 0
      );
    };
    // Build your invoice HTML - adapt your actual format here
    // Generate invoice HTML content with clean design matching the image
    invoiceContainer.innerHTML = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <title>Invoice</title>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
            body { 
              margin: 0; 
              padding: 0; 
              font-family: 'Poppins', sans-serif;
              color: #333333;
              background-color: #fff;
            }
            .invoice-container { 
              max-width: 800px;
              margin: 0 auto;
              border: 1px solid #e0e0e0;
              box-shadow: 0 0 10px rgba(0,0,0,0.1);
            }
            .header {
              display: flex;
              justify-content: space-between;
              align-items: center;
              padding: 20px 30px;
              border-bottom: 1px solid #e0e0e0;
            }
            .logo-section {
              display: flex;
              align-items: center;
            }
            .logo-section img {
              height: 50px;
              margin-right: 15px;
            }
            .logo-text h1 {
              margin: 0;
              font-size: 24px;
              font-weight: 700;
            }
            .invoice-date {
              font-size: 14px;
              margin-top: 5px;
            }
            .invoice-number {
              text-align: right;
            }
            .status-badge {
              display: inline-flex;
              align-items: center;
              justify-content: center;
              height: 32px;
              padding: 0 12px;
              border-radius: 16px;
              background-color: black;
              color: white;
              text-transform: capitalize;
              font-size: 14px;
              line-height: 32px;
            }
            .company-info {
              background-color: #f8f8f8;
              padding: 15px 30px;
              border-bottom: 1px solid #e0e0e0;
              display: flex;
              justify-content: space-between;
            }
            .company-info p {
              margin: 3px 0;
              font-size: 14px;
            }
            .info-section {
              padding: 20px 30px;
              display: flex;
              justify-content: space-between;
            }
            .info-box {
              width: 48%;
            }
            .info-title {
              font-size: 16px;
              font-weight: 600;
              margin-bottom: 10px;
              border-bottom: 2px solid #000;
              padding-bottom: 5px;
              display: inline-block;
            }
            .address-card {
              background: #f8f8f8;
              border-radius: 4px;
              padding: 15px;
              border-left: 3px solid #000;
            }
            .address-card p {
              margin: 4px 0;
              font-size: 14px;
            }
            .address-card .name {
              font-weight: 600;
              font-size: 16px;
              margin-bottom: 8px;
            }
            .payment-info {
              display: flex;
              justify-content: space-between;
              margin-bottom: 8px;
              font-size: 14px;
            }
            .payment-info .label {
              font-weight: normal;
            }
            .payment-info .value {
              font-weight: 500;
            }
            .amount-paid {
              margin-top: 12px;
              padding-top: 12px;
              border-top: 1px dashed #c0c0c0;
              display: flex;
              justify-content: space-between;
            }
            .amount-paid .label {
              font-weight: 600;
              font-size: 14px;
            }
            .amount-paid .value {
              font-weight: 700;
              font-size: 16px;
            }
            .order-details {
              padding: 0 30px 30px;
            }
            table {
              width: 100%;
              border-collapse: collapse;
            }
            thead {
              background-color: #000;
              color: white;
            }
            th {
              text-align: left;
              padding: 10px 15px;
              font-weight: 500;
              font-size: 14px;
            }
            th:nth-child(2) {
              text-align: center;
            }
            th:nth-child(3), th:nth-child(4) {
              text-align: right;
            }
            td {
              padding: 15px;
              border-bottom: 1px solid #e0e0e0;
              font-size: 14px;
            }
            td:nth-child(2) {
              text-align: center;
              font-weight: 500;
            }
            td:nth-child(3), td:nth-child(4) {
              text-align: right;
            }
            td:nth-child(4) {
              font-weight: 600;
            }
            .totals-section {
              display: flex;
              justify-content: flex-end;
              margin-top: 30px;
            }
            .totals-table {
              width: 300px;
              background: #f8f8f8;
              border-radius: 4px;
              padding: 15px;
            }
            .total-row {
              display: flex;
              justify-content: space-between;
              padding: 8px 0;
              border-bottom: 1px solid #e0e0e0;
            }
            .total-row:last-child {
              border-bottom: none;
              margin-top: 10px;
              padding-top: 10px;
              border-top: 2px solid #000;
              font-weight: 600;
            }
            .footer {
              background: #f8f8f8;
              padding: 20px;
              text-align: center;
              border-top: 1px solid #e0e0e0;
            }
            .thank-you {
              font-size: 18px;
              font-weight: 600;
              margin-bottom: 5px;
            }
            .contact-info {
              font-size: 13px;
              color: #666;
              margin: 5px 0;
            }
            .contact-email {
              color: #000;
              font-weight: 500;
            }
            .copyright {
              margin-top: 15px;
              padding-top: 15px;
              border-top: 1px dashed #c0c0c0;
              font-size: 12px;
              color: #888;
            }
          </style>
        </head>
        <body>
          <div class="invoice-container">
            <!-- Header -->
            <div class="header">
              <div class="logo-section">
                <img src="${logoPath}" alt="astroindusoot">
                <div class="logo-text">
                  <h1>INVOICE</h1>
                  <div class="invoice-date">${moment(order?.createdAt).format(
                    'MMMM Do YYYY'
                  )}</div>
                </div>
              </div>
              <div class="invoice-number">
                <div>Invoice #ORD-${order?.orderId || ''}</div>
                <div style="margin: 8px 0 0;">Order Status: <span class="status-badge">${
                  order?.orderStatus || 'Pending'
                }</span></div>
              </div>
            </div>
    
            <!-- Company Info -->
            <div class="company-info">
              <div>
                <p>PLOT NO. -27 AND 27-B, KHASRA NO. 46/23</p>
                <p>Near M.S. VATIKA, NILOTHI EXTENSION, NEW DELHI-110041</p>
              </div>
              <div style="text-align: right;">
                <p>+91 7838388836</p>
                <p>astrologyastroindusoot.in@gmail.com</p>
              </div>
            </div>
    
            <!-- Customer Info Section -->
            <div class="info-section">
              <!-- Ship To Information -->
              <div class="info-box">
                <div class="info-title">SHIP TO</div>
                <div class="address-card">
                  <p class="name">${
                    order?.user?.name || order?.addressData?.firstname || ''
                  }</p>
                  <p>${
                    order?.shippingAddress?.address1 ||
                    order?.addressData?.address1 ||
                    ''
                  }</p>
                  <p>${
                    order?.shippingAddress?.address2 ||
                    order?.addressData?.address2 ||
                    ''
                  }</p>
                  <p>${
                    order?.shippingAddress?.state?.name ||
                    order?.addressData?.state?.name ||
                    ''
                  }</p>
                  <p>${
                    order?.shippingAddress?.pinCode ||
                    order?.addressData?.pinCode ||
                    ''
                  }</p>
                  <p>📞 ${
                    order?.shippingAddress?.phone ||
                    order?.addressData?.phone ||
                    ''
                  }</p>
                  <p>✉️ ${
                    order?.user?.email || order?.addressData?.email || ''
                  }</p>
                </div>
              </div>
    
              <!-- Payment Information -->
              <div class="info-box">
                <div class="info-title">PAYMENT INFO</div>
                <div class="address-card">
                  <div class="payment-info">
                    <span class="label">Transaction ID:</span>
                    <span class="value">${order?.transactionId || ''}</span>
                  </div>
                  <div class="payment-info">
                    <span class="label">Payment Date:</span>
                    <span class="value">${moment(order?.createdAt).format(
                      'MMM DD, YYYY'
                    )}</span>
                  </div>
                  <div class="payment-info">
                    <span class="label">Payment Method:</span>
                    <span class="value">${
                      order?.paymentMethod?.toLowerCase() === 'cod'
                        ? 'COD'
                        : 'ONLINE'
                    }</span>
                  </div>
                  <div class="amount-paid">
                    <span class="label">Amount Paid:</span>
                    <span class="value">₹ ${order?.paidAmount?.toFixed(
                      2
                    )}</span>
                  </div>
                </div>
              </div>
            </div>
    
            <!-- Order Details -->
            <div class="order-details">
              <div class="info-title">ORDER DETAILS</div>
              <table>
                <thead>
                  <tr>
                    <th>ITEM</th>
                    <th>QTY</th>
                    <th>PRICE</th>
                    <th>TOTAL</th>
                  </tr>
                </thead>
                <tbody>
                  ${order?.products
                    ?.map((product: any) => {
                      return `<tr>
                        <td>
                          ${product?.productId?.name}
                          ${
                            product?.variantId &&
                            product?.variantId?.values &&
                            product?.variantId?.values?.length > 0
                              ? `<div style="font-size: 12px; color: #666; margin-top: 4px; font-weight: normal;">
                                  ${product?.variantId?.values
                                    ?.map((val: any) => val.full_name)
                                    .join(', ')}
                                </div>`
                              : ''
                          }
                        </td>
                        <td>${product?.quantity}</td>
                        <td>₹ ${
                          product?.totalAmount?.toFixed(2) / product?.quantity
                        }</td>
                        <td>₹ ${product?.totalAmount?.toFixed(2)}</td>
                      </tr>`;
                    })
                    .join('')}
                </tbody>
              </table>
    
              <!-- Totals Section -->
              <div class="totals-section">
                <div class="totals-table">
                  <div class="total-row">
                    <span>Subtotal:</span>
                    <span>₹ ${calculateSubtotal().toFixed(2)}</span>
                  </div>
                  <div class="total-row">
                    <span>Shipping:</span>
                    <span>₹ ${(order?.shippingCharges || 0).toFixed(2)}</span>
                  </div>
                  <div class="total-row">
                    <span>Discount:</span>
                    <span>₹ ${(order?.discount || 0).toFixed(2)}</span>
                  </div>
                  <div class="total-row">
                    <span>Additional Discount:</span>
                    <span>₹ ${(order?.additionalDiscount || 0).toFixed(
                      2
                    )}</span>
                  </div>
                  <div class="total-row">
                    <span>Total Amount:</span>
                    <span>₹ ${order?.paidAmount?.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
    
            <!-- Footer -->
            <div class="footer">
              <p class="thank-you">Thank you for your business!</p>
              <p class="contact-info">
                If you have any questions about this invoice, please contact us at
                <span class="contact-email">astrologyastroindusoot.in@gmail.com</span>
              </p>
              <div class="copyright">
                <p>Astro Indusoot © ${new Date().getFullYear()} • All Rights Reserved</p>
              </div>
            </div>
          </div>
        </body>
        </html>`;

    // Append hidden container to DOM for rendering
    document.body.appendChild(invoiceContainer);

    // Wait a moment to ensure styles/layout are applied
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Render to canvas
    const canvas = await html2canvas(invoiceContainer, {
      scale: 1,
      useCORS: true,
      logging: false,
      allowTaint: true
    });

    // Remove container after rendering
    document.body.removeChild(invoiceContainer);

    // Prepare jsPDF
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const imgProps = pdf.getImageProperties(imgData);
    const imgWidth = pdfWidth - 20; // 10mm margin each side
    const imgHeight = (imgProps.height * imgWidth) / imgProps.width;
    const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
    const imgX = (pdfWidth - imgWidth * ratio) / 2;
    const imgY = 5; // Reduced top margin to 5mm

    // Add image to PDF
    pdf.addImage(
      imgData,
      'PNG',
      imgX,
      imgY,
      imgWidth * ratio,
      imgHeight * ratio
    );

    // Return PDF Blob instead of saving immediately
    return pdf.output('blob');
  };

  // 📦 Generate multiple invoices and download as ZIP
  const generateIndividualInvoices = async () => {
    setIsLoading(true);
    const zip = new JSZip();

    for (const itemId of selectedItems) {
      const order = data.find((order) => order._id === itemId);
      if (order) {
        const pdfBlob = await generatePDFInvoice(order);
        const fileName = `Invoice_${order.orderId}.pdf`;
        zip.file(fileName, pdfBlob);
      }
    }

    zip.generateAsync({ type: 'blob' }).then((content) => {
      saveAs(content, `Invoices_${selectedItems.length}_Orders.zip`);
      setIsLoading(false);
    });
  };

  const columns: ColumnDef<IAllOrdersList>[] = [
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
      header: ({ table }) => (
        <Checkbox
          checked={isAllSelected}
          onCheckedChange={(checked) => handleSelectAll(!!checked)}
          aria-label="Select all"
          className="mx-2 translate-y-[2px]"
          // Handle indeterminate state
          ref={(el) => {
            if (el && 'indeterminate' in el) {
              (el as HTMLInputElement).indeterminate = isIndeterminate;
            }
          }}
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={selectedItems.includes(row.original._id ?? '')}
          onCheckedChange={(checked) =>
            handleSelectItem(row.original._id ?? '', !!checked)
          }
          aria-label="Select row"
          className="mx-2 translate-y-[2px]"
        />
      ),
      enableSorting: false,
      enableHiding: false
    },
    {
      accessorKey: 'orderId',
      header: 'ORDER ID'
    },
    {
      id: 'userEmail',
      header: 'USER EMAIL',
      cell: ({ row }) => {
        const userEmail =
          row.original?.user?.email || row.original?.addressData?.email || '-';
        return <span>{userEmail}</span>;
      }
    },
    {
      accessorKey: 'createdAt',
      header: 'ORDER DATE & TIME',
      cell: ({ row }) => {
        const date = new Date(row.original.createdAt);
        const options: Intl.DateTimeFormatOptions = {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
          timeZone: 'Asia/Kolkata'
        };
        return date.toLocaleString('en-IN', options);
      }
    },
    // {
    //   accessorKey: 'products',
    //   header: 'PRODUCTS',
    //   cell: ({ row }) => {
    //     const productsData =
    //       row.original?.products;
    //     console.log('productsData',productsData)
    //     return <span>{}</span>;
    //   }
    // },
    {
      accessorKey: 'status',
      header: 'PAYMENT STATUS'
    },
    {
      accessorKey: 'paymentMethod',
      header: 'Payment Method'
    },
    {
      accessorKey: 'orderStatus',
      header: 'ORDER STATUS'
    },
    {
      accessorKey: 'paidAmount',
      header: 'TOTAL PAYMENT',
      cell: ({ row }) => {
        const amount = `₹ ${row.original?.paidAmount?.toFixed(2)}`;
        return amount;
      }
    },

    {
      accessorKey: 'action',
      header: 'VIEW DETAILS',
      cell: ({ row }) => {
        return <CellAction data={row.original} />;
      }
    }
  ];
  // Status options for the dropdowns
  const paymentStatusOptions = ['all', 'pending', 'success'];
  const orderStatusOptions = [
    'all',
    'pending',
    'confirm',
    'processing',
    'placed',
    'shipped',
    'delivered',
    'cancelled'
  ];

  return (
    <div className="space-y-4">
      <div className="space-y-4">
        {/* Row 1: Email, From, To */}
        <div className="grid grid-cols-1 items-end gap-4 md:grid-cols-4">
          <div>
            <p className="mb-1 text-sm">Enter User Email to Search Order:</p>
            <Input
              type="text"
              className="w-full"
              placeholder="Enter user email"
              name="email"
              value={email ?? ''}
              onChange={handleEmailInputChange}
            />
          </div>
          <div>
            <p className="mb-1 text-sm">Enter Order No. Search Order:</p>
            <Input
              type="text"
              className="w-full"
              placeholder="Enter order no."
              name="text"
              value={orderNo ?? ''}
              onChange={handleOrderNoInputChange}
            />
          </div>
          <div>
            <p className="mb-1 text-sm">From:</p>
            <Input
              type="date"
              className="w-full"
              id="startDate"
              name="startDate"
              value={startDate ?? ''}
              onChange={handlestartdateChange}
            />
          </div>

          <div>
            <p className="mb-1 text-sm">To:</p>
            <Input
              type="date"
              className="w-full"
              id="endDate"
              name="endDate"
              value={endDate ?? ''}
              onChange={handleenddateChange}
            />
          </div>
        </div>
        {/* Row 2: Payment Status, Order Status, Search Button */}
        <div className="grid grid-cols-1 items-end gap-4 md:grid-cols-4">
          <div>
            <p className="mb-1 text-sm">Payment Status</p>
            <Select.Root
              onValueChange={handlePaymentStatusChange}
              defaultValue="all"
            >
              <Select.Trigger className="inline-flex w-full items-center justify-between rounded-md border border-gray-300 bg-white px-4 py-2 text-sm hover:bg-gray-50">
                <Select.Value placeholder="Payment Status" />
                <Select.Icon className="ml-2">
                  <ChevronDownIcon size={16} />
                </Select.Icon>
              </Select.Trigger>
              <Select.Portal>
                <Select.Content className="z-50 overflow-hidden rounded-md border border-gray-200 bg-white shadow-md">
                  <Select.ScrollUpButton className="flex h-6 items-center justify-center bg-white text-gray-700">
                    <ChevronUpIcon size={16} />
                  </Select.ScrollUpButton>
                  <Select.Viewport className="p-1">
                    {paymentStatusOptions.map((status) => (
                      <Select.Item
                        key={status}
                        value={status}
                        className="relative flex items-center rounded px-6 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <Select.ItemText>{status}</Select.ItemText>
                      </Select.Item>
                    ))}
                  </Select.Viewport>
                  <Select.ScrollDownButton className="flex h-6 items-center justify-center bg-white text-gray-700">
                    <ChevronDownIcon size={16} />
                  </Select.ScrollDownButton>
                </Select.Content>
              </Select.Portal>
            </Select.Root>
          </div>

          <div>
            <p className="mb-1 text-sm">Order Status</p>
            <Select.Root
              onValueChange={handleOrderStatusChange}
              defaultValue="all"
            >
              <Select.Trigger className="inline-flex w-full items-center justify-between rounded-md border border-gray-300 bg-white px-4 py-2 text-sm hover:bg-gray-50">
                <Select.Value placeholder="Order Status" />
                <Select.Icon className="ml-2">
                  <ChevronDownIcon size={16} />
                </Select.Icon>
              </Select.Trigger>
              <Select.Portal>
                <Select.Content className="z-50 overflow-hidden rounded-md border border-gray-200 bg-white shadow-md">
                  <Select.ScrollUpButton className="flex h-6 items-center justify-center bg-white text-gray-700">
                    <ChevronUpIcon size={16} />
                  </Select.ScrollUpButton>
                  <Select.Viewport className="p-1">
                    {orderStatusOptions.map((status) => (
                      <Select.Item
                        key={status}
                        value={status}
                        className="relative flex items-center rounded px-6 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <Select.ItemText>{status}</Select.ItemText>
                      </Select.Item>
                    ))}
                  </Select.Viewport>
                  <Select.ScrollDownButton className="flex h-6 items-center justify-center bg-white text-gray-700">
                    <ChevronDownIcon size={16} />
                  </Select.ScrollDownButton>
                </Select.Content>
              </Select.Portal>
            </Select.Root>
          </div>

          <div className="flex h-full items-end">
            <Button variant="default" onClick={handleSearch} className="w-full">
              Search
            </Button>
          </div>
        </div>
        {/* Display selected items count with download options */}
        {/* {selectedItems.length > 0 && (
          <div className="flex items-center justify-between rounded-md bg-blue-50 p-3">
            <span className="text-sm text-blue-700">
              {selectedItems.length} item{selectedItems.length > 1 ? 's' : ''} selected
            </span>
            <div className="flex gap-2">
              <Button
                variant="default"
                size="sm"
                onClick={generateIndividualInvoices}
                className="flex items-center gap-2"
              >
                <Download size={16} />
                Download Individual Invoices
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={downloadAsPDF}
                className="flex items-center gap-2"
              >
                <FileText size={16} />
                Print Summary
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedItems([])}
              >
                Clear Selection
              </Button>
            </div>
          </div>
        )} */}
        .{/* Selected Items Action Bar */}
        {selectedItems.length > 0 && (
          <div className="flex items-center justify-between rounded-md bg-blue-50 p-3">
            <span className="text-sm text-blue-700">
              {selectedItems.length} item{selectedItems.length > 1 ? 's' : ''}{' '}
              selected
            </span>
            <div className="flex gap-2">
              <Button
                variant="default"
                size="sm"
                onClick={generateIndividualInvoices}
                className="flex items-center gap-2"
              >
                <Download size={16} />
                {isLoading ? 'Downloading...' : ' Download Invoices'}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedItems([])}
              >
                Clear Selection
              </Button>
            </div>
          </div>
        )}
      </div>
      <DataTable columns={columns} data={data} totalItems={totalData} />
    </div>
  );
}
