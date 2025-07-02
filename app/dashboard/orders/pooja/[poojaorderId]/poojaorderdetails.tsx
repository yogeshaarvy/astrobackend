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
              <img src="${logoPath}" alt="Dubblin">
              <div class="logo-text">
                <h1>INVOICE</h1>
                <div class="invoice-date">${moment(orderData?.createdAt).format(
                  'MMMM Do YYYY'
                )}</div>
              </div>
            </div>
            <div class="invoice-number">
              <div>Invoice #ORD-${orderData?.orderId || ''}</div>
              <div style="margin: 8px 0 0;">Order Status: <span class="status-badge">${
                orderData?.orderStatus || 'Pending'
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
              <p>dubblinofficial@gmail.com</p>
            </div>
          </div>
  
          <!-- Customer Info Section -->
          <div class="info-section">
            <!-- Ship To Information -->
            <div class="info-box">
              <div class="info-title">SHIP TO</div>
              <div class="address-card">
                <p class="name">${orderData?.user?.name || ''}</p>
               
                <p>📞 ${orderData?.user?.phone || ''}</p>
                <p>✉️ ${orderData?.user?.email || ''}</p>
              </div>
            </div>
  
            <!-- Payment Information -->
            <div class="info-box">
              <div class="info-title">PAYMENT INFO</div>
              <div class="address-card">
                <div class="payment-info">
                  <span class="label">Transaction ID:</span>
                  <span class="value">${orderData?.transactionId || ''}</span>
                </div>
                <div class="payment-info">
                  <span class="label">Payment Date:</span>
                  <span class="value">${moment(orderData?.createdAt).format(
                    'MMM DD, YYYY'
                  )}</span>
                </div>
               
                <div class="amount-paid">
                  <span class="label">Amount Paid:</span>
                  <span class="value">₹ ${orderData?.paidAmount?.toFixed(
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
                  <th>PRICE</th>
                </tr>
              </thead>
              <tbody>
                      <td>
                        ${orderData?.product?.title?.en}                      
                      </td>
              </tbody>
            </table>
  
            <!-- Totals Section -->
            <div class="totals-section">
              <div class="totals-table">
                <div class="total-row">
                  <span>Total Amount:</span>
                  <span>₹ ${orderData?.paidAmount?.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
  
          <!-- Footer -->
          <div class="footer">
            <p class="thank-you">Thank you for your business!</p>
            <p class="contact-info">
              If you have any questions about this invoice, please contact us at
              <span class="contact-email">dubblinofficial@gmail.com</span>
            </p>
            <div class="copyright">
              <p>Dubblin © ${new Date().getFullYear()} • All Rights Reserved</p>
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
                  <img src={logoPath} alt="logo" />
                </div>
              </div>
              <div>
                <h2 className="text-xl font-bold">Dubblin</h2>
                <p className="text-sm text-muted-foreground">
                  PLOT NO. -27 AND 27-B,KHASRA NO. 46/23,Near M.S.
                  VATIKA,NILOTHI EXTENSION, NEW DELHI-110041
                </p>
                <p className="text-sm text-muted-foreground">
                  Phone: +91 7838388836 | Email: dubblinofficial@gmail.com
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
