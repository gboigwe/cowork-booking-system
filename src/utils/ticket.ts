import jsPDF from 'jspdf';
import QRCode from 'qrcode';
import type { Booking } from '../types';
import { CONTACT } from './contact';

const GREEN = '#146B45';
const DARK = '#1B1F1D';
const GRAY = '#6B6B66';

export async function generateTicketPDF(booking: Booking) {
  // Ticket size: 3.5in x 7in, slim & tall like an event ticket
  const W = 252; // 3.5 * 72pt
  const H = 504; // 7 * 72pt

  const doc = new jsPDF({ unit: 'pt', format: [W, H] });

  // ─── Background ───
  doc.setFillColor(255, 255, 255);
  doc.rect(0, 0, W, H, 'F');

  // Green header band
  doc.setFillColor(20, 107, 69);
  doc.rect(0, 0, W, 72, 'F');

  // ─── Logo & Brand ───
  // Placeholder mark, swap for the real ZONEIN logo once the brand document lands.
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(16, 14, 22, 22, 3, 3, 'F');
  doc.setFillColor(20, 107, 69);
  doc.roundedRect(19, 17, 7, 7, 1, 1, 'F');
  doc.roundedRect(28, 17, 7, 7, 1, 1, 'F');
  doc.roundedRect(19, 26, 7, 7, 1, 1, 'F');
  doc.roundedRect(28, 26, 7, 7, 1, 1, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('ZoneIn Hub', 44, 28);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6);
  doc.setTextColor(200, 235, 216);
  doc.text('A quiet place to work', 44, 38);

  // "BOOKING TICKET" label
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(255, 255, 255);
  doc.text('BOOKING TICKET', W / 2, 60, { align: 'center' });

  // ─── Ticket body ───
  let y = 88;
  const col1 = 20;
  const col2 = W / 2 + 6;

  // Guest Name
  doc.setFontSize(6);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(GRAY);
  doc.text('GUEST', col1, y);
  y += 10;
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(DARK);
  doc.text(booking.holderName || 'Guest', col1, y);
  y += 16;

  // Dashed separator
  doc.setDrawColor(220, 217, 205);
  doc.setLineDashPattern([3, 2], 0);
  doc.line(col1, y, W - col1, y);
  doc.setLineDashPattern([], 0);
  y += 12;

  // Desk + Location
  doc.setFontSize(6);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(GRAY);
  doc.text('DESK', col1, y);
  doc.text('LOCATION', col2, y);
  y += 10;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(DARK);
  doc.text(booking.deskName, col1, y);
  doc.setTextColor(GREEN);
  const descLabel = booking.deskDesc.charAt(0).toUpperCase() + booking.deskDesc.slice(1);
  doc.text(descLabel, col2, y);
  y += 16;

  // Date + Phone
  doc.setFontSize(6);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(GRAY);
  doc.text('DATE', col1, y);
  doc.text('PHONE', col2, y);
  y += 10;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(DARK);
  doc.text(booking.date, col1, y);
  doc.text(booking.holderPhone, col2, y);
  y += 16;

  // Status
  doc.setFontSize(6);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(GRAY);
  doc.text('STATUS', col1, y);
  y += 10;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(booking.status === 'confirmed' ? GREEN : DARK);
  doc.text(booking.status === 'confirmed' ? 'Confirmed' : 'Pending, pay at the venue', col1, y);
  y += 16;

  // Dashed separator
  doc.setDrawColor(220, 217, 205);
  doc.setLineDashPattern([3, 2], 0);
  doc.line(col1, y, W - col1, y);
  doc.setLineDashPattern([], 0);
  y += 12;

  // Total cost - highlighted box
  doc.setFillColor(239, 236, 227);
  doc.roundedRect(16, y - 4, W - 32, 28, 4, 4, 'F');
  doc.setDrawColor(20, 107, 69);
  doc.setLineWidth(0.75);
  doc.roundedRect(16, y - 4, W - 32, 28, 4, 4, 'S');

  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(GRAY);
  doc.text('DAY PASS', 26, y + 12);

  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(GREEN);
  const total = `₦${booking.amount.toLocaleString('en-NG')}`;
  doc.text(total, W - 26, y + 13, { align: 'right' });
  y += 38;

  // ─── QR Code ───
  const qrData = [booking.id, booking.deskId, booking.date, booking.holderName].join('|');

  const qrDataUrl = await QRCode.toDataURL(qrData, {
    width: 400,
    margin: 2,
    errorCorrectionLevel: 'M',
    color: { dark: DARK, light: '#ffffff' },
  });

  const qrSize = 150;
  const qrX = (W - qrSize) / 2;
  doc.addImage(qrDataUrl, 'PNG', qrX, y, qrSize, qrSize);
  y += qrSize + 8;

  doc.setFontSize(6);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(GRAY);
  doc.text('Scan to verify booking', W / 2, y, { align: 'center' });
  y += 10;

  // Booking ID
  doc.setFontSize(5);
  doc.setTextColor(180, 180, 180);
  doc.text(`ID: ${booking.id}`, W / 2, y, { align: 'center' });

  // ─── Footer ───
  doc.setFillColor(239, 236, 227);
  doc.rect(0, H - 30, W, 30, 'F');
  doc.setDrawColor(230, 227, 220);
  doc.line(0, H - 30, W, H - 30);

  doc.setFontSize(6);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(GRAY);
  doc.text(`${CONTACT.addressLine1}, ${CONTACT.addressShort}`, W / 2, H - 17, { align: 'center' });
  doc.text(`${CONTACT.email}  |  ${CONTACT.phoneDisplay}`, W / 2, H - 8, { align: 'center' });

  // Save
  const filename = `ZONEIN-Hub-Ticket-${booking.deskId}-${booking.date}.pdf`;
  doc.save(filename);
}
