'use client';
import React from 'react';
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
import { handleDownloadInvoice } from '@/services/utlis/orderCommenFunctions';

const OrderDetailsPage = ({ orderData, loading }: any) => {
  return (
    <PageContainer scrollable>
      <div className="container mx-auto max-w-4xl space-y-6 p-6">
        {/* Company Information */}
        <Card>
          <CardContent className="flex flex-col items-start gap-4 pt-6 md:flex-row md:items-center">
            <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border">
              <img
                src="https://apinew.astroindusoot.com/public/images/imagefile-1752571365681-8364178.png"
                alt="logo"
                className="h-full w-full object-contain"
              />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">AstroIndusoot</h2>
              <p className="text-sm leading-snug text-muted-foreground">
                BASEMENT, BHARAT PLAZA COMPLEX, OPP. NAI SARAK, GARH RD, MEERUT,
                UTTAR PRADESH
              </p>
              <p className="text-sm text-muted-foreground">
                Phone: +91 9068311666 | Email: astroindusoot@gmail.com
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Order Details */}
        <Card>
          <CardHeader>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <CardTitle>Order Details</CardTitle>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Order ID:</span>
                <Badge variant="secondary">#{orderData?.orderId}</Badge>
              </div>
            </div>

            <div className="mt-3 space-y-1 text-sm">
              {orderData?.transactionId && (
                <p>
                  <span className="text-muted-foreground">
                    Transaction ID:{' '}
                  </span>
                  <span className="font-semibold">
                    {orderData?.transactionId}
                  </span>
                </p>
              )}
              {orderData?.paymentStatus && (
                <p>
                  <span className="text-muted-foreground">
                    Payment Status:{' '}
                  </span>
                  <span
                    className={`font-semibold ${
                      orderData?.paymentStatus === 'success'
                        ? 'text-green-600'
                        : orderData?.paymentStatus === 'failed'
                        ? 'text-red-600'
                        : 'text-yellow-600'
                    }`}
                  >
                    {orderData?.paymentStatus}
                  </span>
                </p>
              )}
            </div>
          </CardHeader>

          <CardContent>
            {/* Customer Information */}
            <div>
              <h3 className="mb-2 text-lg font-semibold">
                Customer Information
              </h3>
              <div className="grid gap-1 text-sm">
                <p>
                  <strong>Name:</strong>{' '}
                  {orderData?.user?.name ||
                    `${orderData?.addressData?.firstname || ''} ${
                      orderData?.addressData?.last_name || ''
                    }`}
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

            <Separator className="my-6" />

            {/* Product Details */}
            <div>
              <h3 className="mb-3 text-lg font-semibold">Order Items</h3>
              <div className="overflow-hidden rounded-md border border-gray-200">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-3/4">Product</TableHead>
                      <TableHead className="text-right">Price</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>
                        <div className="font-medium text-gray-800">
                          {orderData?.product?.title?.en}
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-semibold">
                        ₹{orderData?.paidAmount}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </div>

            <Separator className="my-6" />

            {/* Totals + Invoice Download */}
            <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
              <button
                className="rounded-md bg-amber-800 px-4 py-2 text-sm font-semibold text-white transition hover:bg-amber-900"
                onClick={() => handleDownloadInvoice(orderData)}
              >
                Download Invoice
              </button>

              <div className="w-full rounded-md border bg-gray-50 p-3 sm:w-auto">
                <div className="flex justify-between text-sm font-medium">
                  <span>Total:</span>
                  <span className="font-bold text-gray-800">
                    ₹{orderData?.paidAmount}
                  </span>
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
