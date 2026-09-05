import type { Guest } from "./types";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * GUEST MANAGEMENT SYSTEM — API UTILITIES
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * Utility functions untuk:
 * - Generate unique guest links
 * - Create QR codes (optional)
 * - Send notifications via WhatsApp
 * - Track guest views
 */

/**
 * Generate WhatsApp message template
 */
export function generateWhatsAppMessage(guestName: string, guestLink: string): string {
  const cleanGuestName = guestName.trim() || "Bapak/Ibu/Saudara/i";

  return `Assalamu'alaikum warahmatullahi wabarakatuh,

Yth. Bapak/Ibu/Saudara/i *${cleanGuestName}*,

Dengan memohon rahmat dan ridha Allah SWT, serta penuh kebahagiaan dan rasa syukur, kami bermaksud mengundang Bapak/Ibu/Saudara/i untuk hadir dalam acara pernikahan kami dan memberikan doa restu bagi:

💍 *Rian Pebriansyah, S.Psi.*
🤍 *Windi Nuraeni*

InsyaAllah acara akan dilaksanakan pada:

📅 *Hari, tanggal:* Sabtu, 07 November 2026
🕐 *Waktu:* Pukul 08.00 WIB
📍 *Tempat:* Rumah Mempelai Wanita

Untuk melihat undangan digital personal, detail acara, lokasi, serta melakukan konfirmasi kehadiran, silakan buka link berikut:

🔗 ${guestLink}

Mohon kesediaan Bapak/Ibu/Saudara/i untuk membuka undangan tersebut dan mengisi konfirmasi kehadiran melalui halaman yang tersedia. Kehadiran dan doa restu Bapak/Ibu/Saudara/i merupakan kebahagiaan yang sangat berarti bagi kami.

Atas perhatian, doa, dan kesediaannya untuk hadir, kami ucapkan terima kasih.

Wassalamu'alaikum warahmatullahi wabarakatuh.

Salam hormat dan bahagia,
*Rian & Windi* 🙏🤍`;
}

/**
 * Generate email template
 */
export function generateEmailTemplate(guestName: string, guestLink: string): {
  subject: string;
  html: string;
} {
  return {
    subject: `Undangan Pernikahan Rian & Windi`,
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: Arial, sans-serif; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { text-align: center; color: #d946a6; margin-bottom: 30px; }
    .card { background: #faf9f6; border: 1px solid #e5ddd8; border-radius: 12px; padding: 30px; }
    .button { display: inline-block; padding: 12px 32px; background: #000; color: #fff; text-decoration: none; border-radius: 8px; margin-top: 20px; }
    .footer { text-align: center; font-size: 12px; color: #999; margin-top: 30px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Undangan Pernikahan ✨</h1>
    </div>
    
    <div class="card">
      <p>Assalamu'alaikum <strong>${guestName}</strong>,</p>
      
      <p>Dengan penuh kebahagiaan, kami mengundang Anda untuk hadir merayakan pernikahan kami:</p>
      
      <div style="text-align: center; margin: 30px 0;">
        <h2 style="color: #1f2937;">Rian Pebriansyah</h2>
        <p style="color: #999;">💍</p>
        <h2 style="color: #d946a6;">Windi Nuraeni</h2>
      </div>
      
      <p><strong>📅 Hari & Tanggal:</strong> Sabtu, 07 November 2026</p>
      <p><strong>🕐 Waktu:</strong> Pukul 08.00 WIB</p>
      <p><strong>📍 Lokasi:</strong> Rumah Mempelai Wanita</p>
      
      <p style="text-align: center;">
        <a href="${guestLink}" class="button">Buka Undangan Digital</a>
      </p>
      
      <p style="font-size: 12px; color: #999; margin-top: 20px;">
        Mohon untuk memberikan konfirmasi kehadiran melalui link undangan di atas sebelum 31 Oktober 2026.
      </p>
    </div>
    
    <div class="footer">
      <p>Terima kasih telah menjadi bagian dari kebahagiaan kami 🙏💕</p>
      <p>Rian & Windi</p>
    </div>
  </div>
</body>
</html>
    `,
  };
}

/**
 * Generate guest CSV export
 */
export function generateGuestCSV(guests: Guest[]): string {
  const headers = ["No", "Nama", "Hubungan", "Kategori", "Email", "Telepon"];
  const rows = guests.map((g, i) => [
    i + 1,
    g.name,
    g.relation,
    g.category,
    g.email,
    g.phone,
  ]);

  const csvContent = [
    headers.join(","),
    ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
  ].join("\n");

  return csvContent;
}

/**
 * Validate guest slug format
 */
export function isValidGuestSlug(slug: string): boolean {
  const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
  return slugRegex.test(slug) && slug.length > 0 && slug.length <= 100;
}

/**
 * Format phone number for WhatsApp
 */
export function formatPhoneForWhatsApp(phone: string): string {
  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, "");

  if (!cleaned) return "";
  
  // If starts with 0, replace with 62
  if (cleaned.startsWith("0")) {
    return "62" + cleaned.substring(1);
  }
  
  // If already starts with 62, keep it
  if (cleaned.startsWith("62")) {
    return cleaned;
  }
  
  // Otherwise assume Indonesia and add 62
  return "62" + cleaned;
}
