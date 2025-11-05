'use client';
import { useEffect, useState } from 'react';
import PageContainer from '@/components/layout/page-container';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { useSearchParams } from 'next/navigation';
import { useAppSelector, useAppDispatch } from '@/redux/hooks';
import AllOrdersTable from './orders-tables';
import {
  fetchConsultationOrderList,
  IConsultationsOrdersList
} from '@/redux/slices/consultations/consultationsOrdersSlice';
import { toast } from 'sonner';
import * as XLSX from 'xlsx';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function OrdersListingPage() {
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();
  const keyword = searchParams.get('q') || '';
  const active = searchParams.get('active') || '';
  const field = searchParams.get('field') || '';
  const paymentStatus = searchParams.get('paymentStatus') || '';
  const orderStatus = searchParams.get('orderStatus') || '';
  const page = parseInt(searchParams.get('page') ?? '1', 10);
  const pageSize = parseInt(searchParams.get('limit') ?? '10', 10);

  const {
    consultationOrderList: {
      loading: consultationOrderListLoading,
      data: cData = [],
      pagination: { totalCount }
    }
  } = useAppSelector((state) => state.consultationOrder);

  const consultationOrder: IConsultationsOrdersList[] = cData;

  useEffect(() => {
    dispatch(
      fetchConsultationOrderList({
        page,
        pageSize,
        keyword,
        field,
        active,
        exportData: false,
        paymentStatus: paymentStatus || undefined,
        orderStatus: orderStatus || undefined
      })
    );
  }, [
    page,
    pageSize,
    keyword,
    field,
    active,
    paymentStatus,
    orderStatus,
    dispatch
  ]);

  const handleSearch = () => {
    if ((!field && keyword) || (!keyword && field)) {
      alert('Both keyword and field is required to search with keyword');
      return;
    }
    dispatch(
      fetchConsultationOrderList({
        page,
        pageSize,
        keyword,
        field,
        active,
        exportData: false,
        paymentStatus,
        orderStatus
      })
    );
  };

  const handleExport = async () => {
    dispatch(
      fetchConsultationOrderList({
        page,
        pageSize,
        keyword,
        field,
        active,
        exportData: true,
        paymentStatus: paymentStatus || undefined,
        orderStatus: orderStatus || undefined
      })
    ).then((response: any) => {
      if (response?.error) {
        toast.error("Can't Export The Data Something Went Wrong");
      }
      const allConsultationOrder = response.payload?.astroBooking;
      const fileType =
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
      const fileExtension = '.xlsx';
      const fileName = 'consultation_order_list';

      const ws = XLSX.utils.json_to_sheet(
        allConsultationOrder?.map((row: IConsultationsOrdersList) => {
          const id = row?._id || 'N/A';
          const orderId = row?.orderId || 'N/A';
          const bookedDate = row?.bookedDate
            ? new Date(row.bookedDate).toLocaleDateString('en-GB')
            : 'N/A';
          const bookedTime = row?.bookedTime || 'N/A';
          const duration = row?.duration || 'N/A';
          const paidAmount =
            row?.paidAmount !== undefined ? `₹${row.paidAmount}` : 'N/A';
          const orderStatus = row?.orderStatus || 'N/A';
          const paymentStatus = row?.paymentStatus || 'N/A';
          const talkTime = row?.talkTime || 'N/A';
          const message = row?.message || 'N/A';
          const transactionId = row?.transactionId || 'N/A';
          const createdAt = row?.createdAt
            ? new Date(row.createdAt).toLocaleString('en-GB', { hour12: false })
            : 'N/A';

          const userEmail = row?.user?.email || 'N/A';
          const astroEmail = row?.astroId?.email || 'N/A';

          return {
            ID: id,
            Order_ID: orderId,
            User_Name: userEmail,
            Astrologer_Name: astroEmail,
            Booked_Date: bookedDate,
            Booked_Time: bookedTime,
            Duration: duration,
            Paid_Amount: paidAmount,
            Talk_Time: talkTime,
            Message: message,
            Order_Status: orderStatus,
            Payment_Status: paymentStatus,
            Transaction_ID: transactionId,
            Created_At: createdAt
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
        <div className="flex items-start justify-between ">
          <Heading
            title={`All Consultation Orders (${totalCount})`}
            description=""
          />
          {/* {empPermissions.permission.add ? ( */}
          <div>
            <Button
              className="mx-5 py-4"
              variant="default"
              onClick={handleExport}
            >
              Export
            </Button>
          </div>
          {/* ) : (
            <EmployeeNotAllowedToAdd />
          )} */}
        </div>
        <Separator />
        <AllOrdersTable
          data={consultationOrder}
          totalData={totalCount}
          handleSearch={handleSearch}
        />
      </div>
    </PageContainer>
  );
}

// 'use client';
// import { useEffect, useState } from 'react';
// import PageContainer from '@/components/layout/page-container';
// import { Heading } from '@/components/ui/heading';
// import { Separator } from '@/components/ui/separator';
// import { useSearchParams } from 'next/navigation';
// import { useAppSelector, useAppDispatch } from '@/redux/hooks';
// import AllOrdersTable from './orders-tables';
// import {
//   fetchConsultationOrderList,
//   IConsultationsOrdersList
// } from '@/redux/slices/consultations/consultationsOrdersSlice';
// import { toast } from 'sonner';
// import * as XLSX from 'xlsx';
// import { Button } from '@/components/ui/button';
// import Link from 'next/link';

// export default function OrdersListingPage() {
//   const dispatch = useAppDispatch();
//   const searchParams = useSearchParams();
//   const keyword = searchParams.get('q') || '';
//   const active = searchParams.get('active') || '';
//   const field = searchParams.get('field') || '';
//   const paymentStatus = searchParams.get('paymentStatus') || ''; // Add this
//   const orderStatus = searchParams.get('orderStatus') || ''; // Add this
//   const page = parseInt(searchParams.get('page') ?? '1', 10);
//   const pageSize = parseInt(searchParams.get('limit') ?? '10', 10);

//   const {
//     consultationOrderList: {
//       loading: consultationOrderListLoading,
//       data: cData = [],
//       pagination: { totalCount }
//     }
//   } = useAppSelector((state) => state.consultationOrder);

//   const consultationOrder: IConsultationsOrdersList[] = cData;

//   useEffect(() => {
//     dispatch(
//       fetchConsultationOrderList({
//         page,
//         pageSize,
//         keyword,
//         field,
//         active,
//         exportData: false,
//         paymentStatus: paymentStatus || undefined,
//         orderStatus: orderStatus || undefined
//       })
//     );
//   }, [page, pageSize, dispatch]);

//   const handleSearch = () => {
//     if ((!field && keyword) || (!keyword && field)) {
//       alert('Both keyword and field is required to search with keyword');
//       return; // Add return to prevent execution
//     }
//     dispatch(
//       fetchConsultationOrderList({
//         page,
//         pageSize,
//         keyword,
//         field,
//         active,
//         exportData: false, // Changed to false - you had true here
//         paymentStatus: paymentStatus || undefined,
//         orderStatus: orderStatus || undefined
//       })
//     );
//   };

//   const handleExport = async () => {
//     dispatch(
//       fetchConsultationOrderList({
//         page,
//         pageSize,
//         keyword,
//         field,
//         active,
//         exportData: true,
//         paymentStatus: paymentStatus || undefined,
//         orderStatus: orderStatus || undefined
//       })
//     ).then((response: any) => {
//       if (response?.error) {
//         toast.error("Can't Export The Data Something Went Wrong");
//         return;
//       }
//       const allConsultationOrder = response.payload?.astroBooking;
//       const fileType =
//         'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
//       const fileExtension = '.xlsx';
//       const fileName = 'consultation_order_list';

//       const ws = XLSX.utils.json_to_sheet(
//         allConsultationOrder?.map((row: IConsultationsOrdersList) => {
//           const id = row?._id || 'N/A';
//           const orderId = row?.orderId || 'N/A';
//           const bookedDate = row?.bookedDate
//             ? new Date(row.bookedDate).toLocaleDateString('en-GB')
//             : 'N/A';
//           const bookedTime = row?.bookedTime || 'N/A';
//           const duration = row?.duration || 'N/A';
//           const paidAmount =
//             row?.paidAmount !== undefined ? `₹${row.paidAmount}` : 'N/A';
//           const orderStatus = row?.orderStatus || 'N/A';
//           const paymentStatus = row?.paymentStatus || 'N/A';
//           const talkTime = row?.talkTime || 'N/A';
//           const message = row?.message || 'N/A';
//           const transactionId = row?.transactionId || 'N/A';
//           const createdAt = row?.createdAt
//             ? new Date(row.createdAt).toLocaleString('en-GB', { hour12: false })
//             : 'N/A';

//           const userEmail = row?.user?.email || 'N/A';
//           const astroEmail = row?.astroId?.email || 'N/A';

//           return {
//             ID: id,
//             Order_ID: orderId,
//             User_Name: userEmail,
//             Astrologer_Name: astroEmail,
//             Booked_Date: bookedDate,
//             Booked_Time: bookedTime,
//             Duration: duration,
//             Paid_Amount: paidAmount,
//             Talk_Time: talkTime,
//             Message: message,
//             Order_Status: orderStatus,
//             Payment_Status: paymentStatus,
//             Transaction_ID: transactionId,
//             Created_At: createdAt
//           };
//         })
//       );

//       const wb = { Sheets: { data: ws }, SheetNames: ['data'] };
//       const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });

//       const data = new Blob([excelBuffer], { type: fileType });
//       const url = URL.createObjectURL(data);
//       const a = document.createElement('a');
//       a.href = url;
//       a.download = fileName + fileExtension;
//       a.click();
//     });
//   };

//   return (
//     <PageContainer scrollable>
//       <div className="space-y-4">
//         <div className="flex items-start justify-between ">
//           <Heading
//             title={`All Consultation Orders (${totalCount})`}
//             description=""
//           />
//           <div>
//             <Button
//               className="mx-5 py-4"
//               variant="default"
//               onClick={handleExport}
//             >
//               Export
//             </Button>
//           </div>
//         </div>
//         <Separator />
//         <AllOrdersTable
//           data={consultationOrder}
//           totalData={totalCount}
//           handleSearch={handleSearch}
//         />
//       </div>
//     </PageContainer>
//   );
// }
