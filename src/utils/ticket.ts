import jsPDF from 'jspdf';
import QRCode from 'qrcode';
import type { Booking } from '../types';

const BLUE = '#2563eb';
const DARK = '#1e293b';
const GRAY = '#64748b';

export async function generateTicketPDF(booking: Booking, holderName: string) {
  // Ticket size: 3.5in x 7in — slim & tall like an event ticket
  const W = 252; // 3.5 * 72pt
  const H = 504; // 7 * 72pt

  const doc = new jsPDF({ unit: 'pt', format: [W, H] });

  // ─── Background ───
  doc.setFillColor(255, 255, 255);
  doc.rect(0, 0, W, H, 'F');

  // Blue header band (compact)
  doc.setFillColor(37, 99, 235);
  doc.rect(0, 0, W, 72, 'F');

  // Darker overlay on top half of header
  doc.setFillColor(30, 58, 95);
  doc.setGState(new (doc as any).GState({ opacity: 0.3 }));
  doc.rect(0, 0, W, 30, 'F');
  doc.setGState(new (doc as any).GState({ opacity: 1 }));

  // ─── Logo & Brand ───
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(16, 14, 22, 22, 3, 3, 'F');
  doc.setFillColor(37, 99, 235);
  doc.roundedRect(19, 17, 7, 7, 1, 1, 'F');
  doc.roundedRect(28, 17, 7, 7, 1, 1, 'F');
  doc.roundedRect(19, 26, 7, 7, 1, 1, 'F');
  doc.roundedRect(28, 26, 7, 7, 1, 1, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('TECH-AGE Hub', 44, 28);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6);
  doc.setTextColor(200, 220, 255);
  doc.text('Co-Working Space', 44, 38);

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
  doc.text(holderName || 'Guest', col1, y);
  y += 16;

  // Dashed separator
  doc.setDrawColor(200, 200, 200);
  doc.setLineDashPattern([3, 2], 0);
  doc.line(col1, y, W - col1, y);
  doc.setLineDashPattern([], 0);
  y += 12;

  // Desk + Type
  doc.setFontSize(6);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(GRAY);
  doc.text('DESK', col1, y);
  doc.text('TYPE', col2, y);
  y += 10;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(DARK);
  doc.text(booking.deskName, col1, y);
  doc.setTextColor(BLUE);
  const typeLabel = booking.deskType.charAt(0).toUpperCase() + booking.deskType.slice(1);
  doc.text(typeLabel, col2, y);
  y += 16;

  // Date + Time
  doc.setFontSize(6);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(GRAY);
  doc.text('DATE', col1, y);
  doc.text('TIME', col2, y);
  y += 10;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(DARK);
  doc.text(booking.date, col1, y);
  doc.text(`${booking.startTime} - ${booking.endTime}`, col2, y);
  y += 16;

  // Tier + Duration
  doc.setFontSize(6);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(GRAY);
  doc.text('MEMBERSHIP', col1, y);
  doc.text('DURATION', col2, y);
  y += 10;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(DARK);
  const tierLabel = booking.membershipTier
    ? booking.membershipTier.charAt(0).toUpperCase() + booking.membershipTier.slice(1)
    : 'Team';
  doc.text(tierLabel, col1, y);
  doc.text(`${booking.hours}h`, col2, y);
  y += 16;

  // Dashed separator
  doc.setDrawColor(200, 200, 200);
  doc.setLineDashPattern([3, 2], 0);
  doc.line(col1, y, W - col1, y);
  doc.setLineDashPattern([], 0);
  y += 12;

  // Total cost - highlighted box
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(16, y - 4, W - 32, 28, 4, 4, 'F');
  doc.setDrawColor(37, 99, 235);
  doc.setLineWidth(0.75);
  doc.roundedRect(16, y - 4, W - 32, 28, 4, 4, 'S');

  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(GRAY);
  doc.text('TOTAL', 26, y + 12);

  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(BLUE);
  const total = `$${booking.totalCost.toFixed(2)}`;
  doc.text(total, W - 26, y + 13, { align: 'right' });
  y += 38;

  // ─── QR Code ───
  // Keep payload compact so QR modules stay large and scannable
  const qrData = [
    booking.id,
    booking.deskName,
    booking.date,
    `${booking.startTime}-${booking.endTime}`,
    holderName,
  ].join('|');

  const qrDataUrl = await QRCode.toDataURL(qrData, {
    width: 400,
    margin: 2,
    errorCorrectionLevel: 'M',
    color: { dark: '#1e293b', light: '#ffffff' },
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
  doc.setFillColor(248, 250, 252);
  doc.rect(0, H - 30, W, 30, 'F');
  doc.setDrawColor(230, 230, 230);
  doc.line(0, H - 30, W, H - 30);

  doc.setFontSize(6);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(GRAY);
  doc.text('123 Innovation Drive, San Francisco, CA 94107', W / 2, H - 17, { align: 'center' });
  doc.text('hello@techage.hub  |  (555) 123-4567', W / 2, H - 8, { align: 'center' });

  // Save
  const filename = `TECH-AGE-Hub-Ticket-${booking.deskName.replace(' ', '-')}-${booking.date}.pdf`;
  doc.save(filename);
}
