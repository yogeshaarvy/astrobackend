import { jsPDF } from 'jspdf';
import moment from 'moment';
import html2canvas from 'html2canvas';
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import PageContainer from '@/components/layout/page-container';
import { useAppDispatch } from '@/redux/hooks';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  createShiprocketOrder,
  updateOrder
} from '@/redux/slices/store/allordersSlice';

const OrderDetailsPage = ({ orderData }: { orderData: any }) => {
  console.log('this is the orderData', orderData);
  // const [orderStatus, setOrderStatus] = React.useState('placed');
  const [transactionId, setTransactionId] = React.useState('');
  const [newStatus, setNewStatus] = React.useState(orderData?.orderStatus);
  const [check, setCheck] = React.useState(false);
  const dispatch = useAppDispatch();
  const logoPath = '/logo.png';

  const [loading, setLoading] = useState(false);

  const handleStatusUpdate = async () => {
    try {
      setLoading(true); // must be first
      const res = await dispatch<any>(
        updateOrder({
          orderId: orderData?._id,
          transactionId,
          orderStatus: newStatus
        })
      );
    } catch (error) {
      console.error('Error updating order:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setNewStatus(orderData?.orderStatus);
  }, [orderData?.orderStatus, dispatch]);

  //page2
  const handleDownloadInvoice = async () => {
    try {
      // Create a temporary div to render the invoice
      const invoiceContainer = document.createElement('div');
      invoiceContainer.style.padding = '0';
      invoiceContainer.style.position = 'absolute';
      invoiceContainer.style.top = '-9999px';
      invoiceContainer.style.left = '-9999px';
      invoiceContainer.style.width = '800px';

      // Calculate subtotal function
      const calculateSubtotal = () => {
        return (
          orderData?.products?.reduce((total: number, product: any) => {
            return total + (product?.totalAmount || 0);
          }, 0) || 0
        );
      };

      // Generate invoice HTML content with clean design matching the image
      invoiceContainer.innerHTML = `
<!DOCTYPE html>
<html>
<head>
  <title>Invoice - ${orderData?.orderId || 'N/A'}</title>
  <style>
    body { 
      font-family: Arial, sans-serif; 
      margin: 40px; 
      color: #333; 
      line-height: 1.6;
    }
    .invoice-container {
      max-width: 700px;
      margin: 0 auto;
    }
    .header { 
      display: flex; 
      justify-content: space-between; 
      align-items: center;
      margin: 0 auto;
      margin-bottom: 40px; 
      border-bottom: 2px solid #c1d42f; 
      padding-bottom: 20px; 
    }
    .company-name { 
      font-size: 24px; 
      font-weight: bold; 
      color: #c1d42f; 
    }
    .invoice-title { 
      font-size: 32px; 
      font-weight: bold; 
    }
    .invoice-details { 
      margin-bottom: 30px; 
    }
    .addresses { 
      display: flex; 
      justify-content: space-between; 
      margin-bottom: 30px; 
    }
    .address-block { 
      width: 45%; 
    }
    .address-title { 
      font-weight: bold; 
      margin-bottom: 10px; 
      color: #c1d42f; 
    }
    table { 
      width: 100%; 
      border-collapse: collapse; 
      margin-bottom: 30px; 
    }
    th, td { 
      padding: 12px; 
      text-align: left; 
      border-bottom: 1px solid #ddd; 
    }
    th { 
      background-color: #f8f9fa; 
      font-weight: bold; 
    }
    .summary { 
      float: right; 
      width: 300px; 
      clear: both;
    }
    .summary-row { 
      display: flex; 
      justify-content: space-between; 
      padding: 8px 0; 
    }
    .summary-total { 
      font-weight: bold; 
      font-size: 18px; 
      border-top: 2px solid #c1d42f; 
      padding-top: 10px; 
    }
    .clearfix::after {
      content: "";
      display: table;
      clear: both;
    }
  </style>
</head>
<body>
<div class="invoice-container">
  <div class="header">
    <div>
      <div class="company-name">Astroindosoot</div>
      <div>PLOT NO. -27 AND 27-B, KHASRA NO. 46/23</div>
      <div>Near M.S. VATIKA, NILOTHI EXTENSION, NEW DELHI-110041</div>
      <div>astroindosoot@gmail.com | +91 7838388836</div>
    </div>
    <div class="invoice-title">INVOICE</div>
  </div>
  
  <div class="invoice-details">
    <strong>Invoice #:</strong> ORD-${orderData?.orderId || ''}<br>
    <strong>Date:</strong> ${moment(orderData?.createdAt).format(
      'MMMM Do YYYY'
    )}<br>
    <strong>Status:</strong> ${
      orderData?.orderStatus ? orderData.orderStatus.toUpperCase() : 'PENDING'
    }
  </div>
  
  <div class="addresses">
    <div class="address-block">
      <div class="address-title">Ship To:</div>
      <div>
        <strong>${orderData?.user?.name || ''}</strong><br>
        📞 ${orderData?.user?.phone || ''}<br>
        ✉️ ${orderData?.user?.email || ''}<br>
        <br>
        <strong>Transaction ID:</strong> ${orderData?.transactionId || ''}<br>
        <strong>Payment Date:</strong> ${moment(orderData?.createdAt).format(
          'MMM DD, YYYY'
        )}<br>
        <strong>Amount Paid:</strong> ₹ ${orderData?.paidAmount?.toFixed(2)}
      </div>
    </div>
    
    <div class="address-block">
      <div class="address-title">From:</div>
      <div>
        <strong>Astroindosoot</strong><br>
        PLOT NO. -27 AND 27-B, KHASRA NO. 46/23<br>
        Near M.S. VATIKA, NILOTHI EXTENSION,<br>
        NEW DELHI-110041<br>
        astroindosoot@gmail.com<br>
        +91 7838388836
      </div>
    </div>
  </div>
  
  <table>
    <thead>
      <tr>
        <th>Item</th>
        <th>Price</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>${orderData?.product?.title?.en}</td>
        <td>₹${orderData?.paidAmount?.toFixed(2)}</td>
      </tr>
    </tbody>
  </table>
  
  <div class="clearfix">
    <div class="summary">
      <div class="summary-row summary-total">
        <span>Total Amount:</span>
        <span>₹${orderData?.paidAmount?.toFixed(2)}</span>
      </div>
    </div>
  </div>

  <div style="margin-top: 40px; text-align: center; border-top: 1px solid #ddd; padding-top: 20px;">
    <p style="font-size: 18px; font-weight: bold; margin-bottom: 5px;">Thank you for your business!</p>
    <p style="font-size: 13px; color: #666; margin: 5px 0;">
      If you have any questions about this invoice, please contact us at
      <span style="color: #000; font-weight: 500;">astroindosoot@gmail.com</span>
    </p>
    <div style="margin-top: 15px; padding-top: 15px; border-top: 1px dashed #c0c0c0; font-size: 12px; color: #888;">
      <p>Astroindosoot © ${new Date().getFullYear()} • All Rights Reserved</p>
    </div>
  </div>
</div>
</body>
</html>`;

      // Add the invoice container to the document
      document.body.appendChild(invoiceContainer);

      // Wait a moment for styles to apply
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Capture the invoice as an image
      const canvas = await html2canvas(invoiceContainer, {
        scale: 2, // Higher quality rendering
        useCORS: true, // Allow loading cross-origin images
        logging: false,
        allowTaint: true
      });

      // Remove the temporary container
      document.body.removeChild(invoiceContainer);

      // Create PDF with better positioning
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = 5; // Reduced top margin to 5mm

      pdf.addImage(
        imgData,
        'PNG',
        imgX,
        imgY,
        imgWidth * ratio,
        imgHeight * ratio
      );
      pdf.save(`Invoice-${orderData?.orderId}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate invoice. Please try again.');
    }
  };

  return (
    <PageContainer scrollable>
      <div className="container mx-auto max-w-6xl p-6">
        {/* Company Information Card */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border">
                {/* Company Logo Placeholder */}
                <div className="flex h-full w-full items-center justify-center bg-gray-100 text-lg font-bold">
                  <img
                    src={
                      'https://apinew.astroindusoot.com/public/images/imagefile-1752571365681-8364178.png'
                    }
                    alt="logo"
                  />
                </div>
              </div>
              <div>
                <h2 className="text-xl font-bold">Astroindosoot</h2>
                <p className="text-sm text-muted-foreground">
                  PLOT NO. -27 AND 27-B,KHASRA NO. 46/23,Near M.S.
                  VATIKA,NILOTHI EXTENSION, NEW DELHI-110041
                </p>
                <p className="text-sm text-muted-foreground">
                  Phone: +91 7838388836 | Email: astroindosoot@gmail.com
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Order Details</CardTitle>
              <div className="flex flex-col items-center space-y-2">
                <div className="flex items-center gap-2">
                  <span className=" text-sm">Order Id:</span>
                  <Badge variant="outline"># {orderData?.orderId}</Badge>
                </div>
              </div>
            </div>
            {orderData?.transactionId && (
              <p className="text-sm">
                Transaction Id:{' '}
                <span className="font-bold">{orderData?.transactionId}</span>{' '}
              </p>
            )}
            {orderData?.paymentStatus && (
              <p className="text-sm">
                Payment Status:
                <span className="font-bold">{orderData?.paymentStatus}</span>
              </p>
            )}
            {/* Order Status Update Section */}
            {/* <div className="mt-4 flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">
                  Update Order Status:
                </span>
                <Select
                  value={newStatus}
                  onValueChange={(e) => setNewStatus(e)}
                >
                  <SelectTrigger className="w-36">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="confirm">Confirm</SelectItem>
                    <SelectItem value="processing">Processing</SelectItem>
                    <SelectItem value="placed">Placed</SelectItem>
                    <SelectItem value="shipped">Shipped</SelectItem>
                    <SelectItem value="delivered">Delivered</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
                <button
                  className=" rounded-md bg-amber-700 p-1 px-3 text-white"
                  onClick={() => handleStatusUpdate()}
                >
                  {loading ? 'Updating... ' : 'Update'}
                </button>
                <p
                  className={`text-xs font-semibold ${
                    orderData?.orderStatus == 'placed'
                      ? ' text-blue-600'
                      : orderData?.orderStatus == 'shipped'
                      ? 'text-yellow-500'
                      : orderData?.orderStatus == 'out_for_delivery'
                      ? 'text-orange-500'
                      : orderData?.orderStatus == 'delivered'
                      ? 'text-green-500'
                      : 'text-red-500'
                  }`}
                >
                  {orderData?.orderStatus}
                </p>
              </div>
              {!orderData?.transactionId && (
                <div className="relative">
                 
                  {check && (
                    <div className=" absolute flex items-center gap-2 rounded-sm border bg-gray-100 p-3 shadow-md">
                      <Input
                        type="text"
                        placeholder="Enter Transaction ID"
                        value={transactionId}
                        onChange={(e) => setTransactionId(e.target.value)}
                        className="w-64 border bg-gray-200"
                      />
                      <Button
                        className="bg-amber-800 hover:bg-amber-900"
                        onClick={handleStatusUpdate}
                      >
                        Update Status
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div> */}
          </CardHeader>

          <CardContent>
            {/* Customer Information */}
            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <h3 className="mb-2 text-lg font-semibold">
                  Customer Information
                </h3>
                <div className="space-y-1">
                  <p>
                    <strong>Name:</strong>{' '}
                    {orderData?.user?.name || orderData?.addressData?.firstname}
                    {orderData?.user?.last_name ||
                      orderData?.addressData?.last_name}
                  </p>
                  <p>
                    <strong>Email:</strong>{' '}
                    {orderData?.user?.email || orderData?.addressData?.email}
                  </p>
                  <p>
                    <strong>Phone:</strong>{' '}
                    {orderData?.user?.phone || orderData?.addressData?.phone}
                  </p>
                </div>
              </div>
            </div>

            <Separator className="my-6" />

            {/* Product Details */}
            <div className="max-h-96 rounded-lg border border-gray-200">
              <h3 className="mb-4 p-4 pb-0 text-lg font-semibold">
                Order Items
              </h3>
              <Table className="w-11/12">
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-1/4">Product</TableHead>

                    <TableHead className="w-1/4 text-right">Price</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow className="border-b border-gray-200 hover:bg-gray-50">
                    <TableCell>
                      <div>
                        <div className="font-medium">
                          {orderData?.product?.title?.en}
                        </div>
                        {/* <div className="text-sm text-muted-foreground">
                            SKU: {product?.sku}
                          </div> */}
                      </div>
                    </TableCell>

                    <TableCell className="text-right">
                      ₹{orderData?.paidAmount}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>

            <Separator className="my-6" />

            {/* Order Totals */}
            <div className="flex justify-between">
              <div>
                <button
                  className="rounded-md bg-amber-800 p-1 px-3 text-sm font-semibold text-white"
                  onClick={handleDownloadInvoice}
                >
                  Download Invoice
                </button>
              </div>
              <div className="w-64 space-y-2">
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span>₹{orderData?.paidAmount}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
};

export default OrderDetailsPage;
