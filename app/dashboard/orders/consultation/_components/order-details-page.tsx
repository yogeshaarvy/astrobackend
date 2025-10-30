'use client';
import React, { useEffect } from 'react';
import {
  Download,
  Package,
  User,
  MapPin,
  Phone,
  Mail,
  Calendar,
  Hash,
  Eye,
  Loader2Icon,
  Clock,
  DollarSign,
  CreditCard,
  CheckCircle2,
  XCircle,
  AlertCircle
} from 'lucide-react';
import PageContainer from '@/components/layout/page-container';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { useSearchParams } from 'next/navigation';

import Image from 'next/image';

import { toast } from 'sonner';
import { fetchSingleConsultationOrderDetails } from '@/redux/slices/consultations/consultationsOrdersSlice';

const getStatusBadge = (status: string) => {
  const statusConfig = {
    success: {
      variant: 'default' as const,
      icon: CheckCircle2,
      className: 'bg-green-500 hover:bg-green-600'
    },
    pending: {
      variant: 'secondary' as const,
      icon: Clock,
      className: 'bg-yellow-500 hover:bg-yellow-600'
    },
    failed: { variant: 'destructive' as const, icon: XCircle, className: '' },
    'no started': {
      variant: 'outline' as const,
      icon: AlertCircle,
      className: ''
    }
  };

  const config =
    statusConfig[status?.toLowerCase() as keyof typeof statusConfig] ||
    statusConfig['pending'];
  const Icon = config.icon;

  return (
    <Badge
      variant={config.variant}
      className={`${config.className} flex w-fit items-center gap-1`}
    >
      <Icon className="h-3 w-3" />
      {status}
    </Badge>
  );
};

export default function OrderDetailsPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('id');
  const dispatch = useAppDispatch();

  const {
    singleConsultationOrderState: {
      loading: consultationOrderLoading,
      data: cData,
      error: consultationOrderError
    }
  } = useAppSelector((state) => state.consultationOrder);

  useEffect(() => {
    if (orderId) {
      dispatch(fetchSingleConsultationOrderDetails(orderId));
    }
  }, [dispatch, orderId]);

  useEffect(() => {
    if (consultationOrderError) {
      toast.error('Failed to load order details');
    }
  }, [consultationOrderError]);

  if (consultationOrderLoading) {
    return (
      <PageContainer scrollable>
        <div className="flex h-96 items-center justify-center">
          <Loader2Icon className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </PageContainer>
    );
  }

  if (!cData) {
    return (
      <PageContainer scrollable>
        <div className="flex h-96 flex-col items-center justify-center gap-4">
          <Package className="h-16 w-16 text-muted-foreground" />
          <p className="text-lg text-muted-foreground">Order not found</p>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer scrollable>
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Package className="h-6 w-6 text-muted-foreground" />
            <h2 className="text-3xl font-bold">Order Details</h2>
          </div>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Download Invoice
          </Button>
        </div>

        {/* Order Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Order Summary</span>
              <span className="font-mono text-lg">{cData.orderId}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              <div className="space-y-1">
                <p className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  Booked Date
                </p>
                <p className="font-medium">
                  {new Date(cData.bookedDate).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}
                </p>
              </div>
              <div className="space-y-1">
                <p className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  Time
                </p>
                <p className="font-medium">{cData.bookedTime}</p>
              </div>
              <div className="space-y-1">
                <p className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  Duration
                </p>
                <p className="font-medium">{cData.duration} mins</p>
              </div>
              <div className="space-y-1">
                <p className="flex items-center gap-1 text-sm text-muted-foreground">
                  <DollarSign className="h-4 w-4" />
                  Amount Paid
                </p>
                <p className="font-medium">₹{cData.paidAmount}</p>
              </div>
            </div>

            <Separator />

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Order Status</p>
                {getStatusBadge(cData.orderStatus)}
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Payment Status</p>
                {getStatusBadge(cData.paymentStatus)}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Customer Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Customer Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-3">
                <User className="mt-1 h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Name</p>
                  <p className="font-medium">{cData.user.name}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="mt-1 h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p className="font-medium">{cData.user.phone}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="mt-1 h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="break-all font-medium">{cData.user.email}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Astrologer Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Astrologer Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-3">
                <User className="mt-1 h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Name</p>
                  <p className="font-medium">{cData.astroId.name}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="mt-1 h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p className="font-medium">{cData.astroId.phone}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="mt-1 h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="break-all font-medium">{cData.astroId.email}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Transaction Details */}
        {cData.transaction_details && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Transaction Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">
                    Transaction ID
                  </p>
                  <p className="font-mono text-sm font-medium">
                    {cData.transactionId}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Mihpay ID</p>
                  <p className="font-mono text-sm font-medium">
                    {cData.transaction_details.mihpayid}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">
                    Bank Ref Number
                  </p>
                  <p className="break-all font-mono text-sm font-medium">
                    {cData.transaction_details.bank_ref_num}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Payment Mode</p>
                  <p className="font-medium">
                    {cData.transaction_details.mode}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Bank Code</p>
                  <p className="font-medium">
                    {cData.transaction_details.bankcode}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">
                    Payment Gateway
                  </p>
                  <p className="font-medium">
                    {cData.transaction_details.PG_TYPE}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">
                    Transaction Amount
                  </p>
                  <p className="font-medium">
                    ₹{cData.transaction_details.transaction_amount}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">
                    Net Amount Debit
                  </p>
                  <p className="font-medium">
                    ₹{cData.transaction_details.net_amount_debit}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">
                    Additional Charges
                  </p>
                  <p className="font-medium">
                    ₹{cData.transaction_details.additional_charges}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Discount</p>
                  <p className="font-medium">
                    ₹{cData.transaction_details.disc}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">
                    Payment Source
                  </p>
                  <p className="font-medium uppercase">
                    {cData.transaction_details.payment_source}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">
                    Transaction Date
                  </p>
                  <p className="font-medium">
                    {cData.transaction_details.addedon}
                  </p>
                </div>
              </div>

              {cData.transaction_details.field9 && (
                <>
                  <Separator className="my-4" />
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    <span className="text-muted-foreground">
                      Status Message:
                    </span>
                    <span className="font-medium">
                      {cData.transaction_details.field9}
                    </span>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </PageContainer>
  );
}
