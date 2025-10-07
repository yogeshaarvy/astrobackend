import { jsPDF } from 'jspdf';
import moment from 'moment';
import html2canvas from 'html2canvas';

export async function handleDownloadInvoice(orderData: any) {
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
            <div class="company-name">AstroIndusoot</div>
            <div>PLOT NO. -27 AND 27-B, KHASRA NO. 46/23</div>
            <div>Near M.S. VATIKA, NILOTHI EXTENSION, NEW DELHI-110041</div>
            <div>astrologyastroindusoot.in@gmail.com | +91 7838388836</div>
            </div>
            <div class="invoice-title">INVOICE</div>
        </div>
        
        <div class="invoice-details">
            <strong>Invoice #:</strong> ORD-${orderData?.orderId || ''}<br>
            <strong>Date:</strong> ${moment(orderData?.createdAt).format(
              'MMMM Do YYYY'
            )}<br>
            <strong>Status:</strong> ${
              orderData?.orderStatus
                ? orderData.orderStatus.toUpperCase()
                : 'PENDING'
            }
        </div>
        
        <div class="addresses">
            <div class="address-block">
            <div class="address-title">Bill To:</div>
            <div>
                <strong>${orderData?.user?.name || ''}</strong><br>
                ${orderData?.user?.email || ''}<br>
                📞 ${orderData?.user?.phone || ''}<br>
                <br>
                <strong>Transaction ID:</strong> ${
                  orderData?.transactionId || ''
                }<br>
                <strong>Payment Status:</strong> ${
                  orderData?.paymentStatus || ''
                }<br>
                <strong>Payment Date:</strong> ${moment(
                  orderData?.createdAt
                ).format('MMM DD, YYYY')}<br>
                <strong>Amount Paid:</strong> ₹ ${orderData?.paidAmount?.toFixed(
                  2
                )}
            </div>
            </div>
            
            <div class="address-block">
            <div class="address-title">From:</div>
            <div>
                <strong>AstroIndusoot</strong><br>
                PLOT NO. -27 AND 27-B, KHASRA NO. 46/23<br>
                Near M.S. VATIKA, NILOTHI EXTENSION,<br>
                NEW DELHI-110041<br>
                astrologyastroindusoot.in@gmail.com<br>
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
                <td>₹${(orderData?.paidAmount || 0).toFixed(2)}</td>
            </tr>
            </tbody>
        </table>
        
        <div class="clearfix">
            <div class="summary">
            <div class="summary-row summary-total">
                <span>Total:</span>
                <span>₹${(orderData?.paidAmount || 0).toFixed(2)}</span>
            </div>
            </div>
        </div>

        <div style="margin-top: 40px; text-align: center; border-top: 1px solid #ddd; padding-top: 20px;">
            <p style="font-size: 18px; font-weight: bold; margin-bottom: 5px;">Thank you for your business!</p>
            <p style="font-size: 13px; color: #666; margin: 5px 0;">
            If you have any questions about this invoice, please contact us at
            <span style="color: #000; font-weight: 500;">astrologyastroindusoot.in@gmail.com</span>
            </p>
            <div style="margin-top: 15px; margin-bottom: 5px; padding-top: 15px; border-top: 1px dashed #c0c0c0; font-size: 12px; color: #888;">
            <p>Astroindusoot © ${new Date().getFullYear()} • All Rights Reserved</p>
            </div>
        </div>
        </div>
        </body>
        </html>`;
    //this is updated invoice 2
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
}
