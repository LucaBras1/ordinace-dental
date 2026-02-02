/**
 * Email Integration with Resend
 *
 * Sends transactional emails for booking system:
 * - Booking confirmation with payment link
 * - Payment confirmation
 * - Appointment reminder (24h before)
 * - Cancellation notification
 */

import { Resend } from 'resend'

// ============================================
// Types
// ============================================

type Booking = {
  id: string
  customerName: string
  customerEmail: string
  appointmentDate: Date
  appointmentTime: string
  depositAmount: number
  status: string
  service: {
    name: string
    price: number
    duration: number
  }
}

type EmailOptions = {
  to: string
  subject: string
  html: string
}

// ============================================
// Resend Client
// ============================================

let _resend: Resend | null = null

/**
 * Get or create Resend client (lazy loading).
 */
function getResendClient(): Resend {
  if (!_resend) {
    const apiKey = process.env.RESEND_API_KEY
    if (!apiKey) {
      throw new Error('RESEND_API_KEY environment variable is not set')
    }
    _resend = new Resend(apiKey)
  }
  return _resend
}

/**
 * Get email "from" address from environment.
 */
function getFromAddress(): string {
  return process.env.EMAIL_FROM || 'Dentální ordinace <rezervace@ordinace.cz>'
}

/**
 * Contact information for email templates.
 * Configure via environment variables.
 */
function getContactInfo(): { phone: string; email: string; address: string } {
  return {
    phone: process.env.CONTACT_PHONE || '+420 123 456 789',
    email: process.env.CONTACT_EMAIL || 'info@ordinace.cz',
    address: process.env.CONTACT_ADDRESS || 'Adresa ordinace, Praha',
  }
}

// ============================================
// Email Sending Utilities
// ============================================

/**
 * Send email using Resend.
 */
async function sendEmail({ to, subject, html }: EmailOptions): Promise<{ success: boolean; error?: string }> {
  try {
    const resend = getResendClient()
    const from = getFromAddress()

    console.log(`[Email] Sending "${subject}" to ${to}`)

    const { data, error } = await resend.emails.send({
      from,
      to,
      subject,
      html,
    })

    if (error) {
      console.error('[Email] Resend API error:', error)
      return { success: false, error: error.message }
    }

    console.log('[Email] Successfully sent email:', data?.id)
    return { success: true }
  } catch (error) {
    console.error('[Email] Failed to send email:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

// ============================================
// Email Formatters
// ============================================

/**
 * Format price in CZK (from haléře).
 */
function formatPrice(amountInHalere: number): string {
  const kc = amountInHalere / 100
  return new Intl.NumberFormat('cs-CZ', {
    style: 'currency',
    currency: 'CZK',
  }).format(kc)
}

/**
 * Format date in Czech locale.
 */
function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('cs-CZ', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date)
}

/**
 * Format time (removes seconds if present).
 */
function formatTime(time: string): string {
  // "09:00" or "09:00:00" -> "09:00"
  return time.substring(0, 5)
}

// ============================================
// Email Templates
// ============================================

/**
 * Booking Confirmation Email Template
 * Sent immediately after booking is created (before payment).
 */
function bookingConfirmationTemplate(booking: Booking, paymentUrl: string): string {
  const date = formatDate(booking.appointmentDate)
  const time = formatTime(booking.appointmentTime)
  const depositAmount = formatPrice(booking.depositAmount)
  const totalPrice = formatPrice(booking.service.price)
  const contact = getContactInfo()

  return `
<!DOCTYPE html>
<html lang="cs">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Rezervace vytvořena</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      background-color: #f5f5f5;
    }
    .container {
      background-color: #ffffff;
      border-radius: 8px;
      padding: 30px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .header {
      text-align: center;
      border-bottom: 3px solid #0070f3;
      padding-bottom: 20px;
      margin-bottom: 30px;
    }
    h1 {
      color: #0070f3;
      margin: 0;
      font-size: 24px;
    }
    .detail-box {
      background-color: #f8f9fa;
      border-left: 4px solid #0070f3;
      padding: 15px;
      margin: 20px 0;
    }
    .detail-row {
      display: flex;
      justify-content: space-between;
      margin: 10px 0;
    }
    .label {
      font-weight: 600;
      color: #666;
    }
    .value {
      color: #000;
      font-weight: 500;
    }
    .button {
      display: inline-block;
      background-color: #0070f3;
      color: #ffffff;
      text-decoration: none;
      padding: 14px 28px;
      border-radius: 6px;
      font-weight: 600;
      text-align: center;
      margin: 20px 0;
    }
    .button:hover {
      background-color: #0051cc;
    }
    .warning {
      background-color: #fff3cd;
      border-left: 4px solid #ffc107;
      padding: 15px;
      margin: 20px 0;
    }
    .info {
      background-color: #d1ecf1;
      border-left: 4px solid #17a2b8;
      padding: 15px;
      margin: 20px 0;
    }
    .footer {
      text-align: center;
      margin-top: 30px;
      padding-top: 20px;
      border-top: 1px solid #e0e0e0;
      color: #666;
      font-size: 14px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>✓ Rezervace vytvořena</h1>
    </div>

    <p>Dobrý den <strong>${booking.customerName}</strong>,</p>
    <p>Děkujeme za vytvoření rezervace v naší dentální ordinaci.</p>

    <div class="detail-box">
      <h3 style="margin-top: 0;">📅 Detail rezervace</h3>
      <div class="detail-row">
        <span class="label">Služba:</span>
        <span class="value">${booking.service.name}</span>
      </div>
      <div class="detail-row">
        <span class="label">Datum:</span>
        <span class="value">${date}</span>
      </div>
      <div class="detail-row">
        <span class="label">Čas:</span>
        <span class="value">${time}</span>
      </div>
      <div class="detail-row">
        <span class="label">Trvání:</span>
        <span class="value">${booking.service.duration} minut</span>
      </div>
      <div class="detail-row">
        <span class="label">Celková cena:</span>
        <span class="value">${totalPrice}</span>
      </div>
    </div>

    <div class="warning">
      <h3 style="margin-top: 0;">💳 Potvrzení rezervace</h3>
      <p>Pro potvrzení rezervace je nutné zaplatit kauci ve výši <strong>${depositAmount}</strong>.</p>
      <p>Kauce bude odečtena z celkové ceny služby.</p>
    </div>

    <div style="text-align: center;">
      <a href="${paymentUrl}" class="button">Zaplatit kauci ${depositAmount}</a>
    </div>

    <div class="info">
      <h3 style="margin-top: 0;">ℹ️ Storno podmínky</h3>
      <ul style="margin: 10px 0; padding-left: 20px;">
        <li>Zrušení do 24 hodin před termínem: kauce bude vrácena v plné výši</li>
        <li>Zrušení méně než 24 hodin před termínem: kauce propadá</li>
        <li>Nedostavení se na termín: kauce propadá</li>
      </ul>
    </div>

    <div class="footer">
      <p><strong>Kontakt na ordinaci:</strong></p>
      <p>
        📞 ${contact.phone}<br>
        📧 ${contact.email}<br>
        📍 ${contact.address}
      </p>
      <p style="color: #999; font-size: 12px; margin-top: 20px;">
        Tento email byl odeslán automaticky. Pokud jste rezervaci nevytvářeli, kontaktujte nás.
      </p>
    </div>
  </div>
</body>
</html>
  `.trim()
}

/**
 * Payment Confirmation Email Template
 * Sent after successful payment.
 */
function paymentConfirmationTemplate(booking: Booking): string {
  const date = formatDate(booking.appointmentDate)
  const time = formatTime(booking.appointmentTime)
  const depositAmount = formatPrice(booking.depositAmount)
  const totalPrice = formatPrice(booking.service.price)
  const remainingAmount = formatPrice(booking.service.price - booking.depositAmount)
  const contact = getContactInfo()

  return `
<!DOCTYPE html>
<html lang="cs">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Platba přijata</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      background-color: #f5f5f5;
    }
    .container {
      background-color: #ffffff;
      border-radius: 8px;
      padding: 30px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .header {
      text-align: center;
      border-bottom: 3px solid #28a745;
      padding-bottom: 20px;
      margin-bottom: 30px;
    }
    h1 {
      color: #28a745;
      margin: 0;
      font-size: 24px;
    }
    .success-box {
      background-color: #d4edda;
      border-left: 4px solid #28a745;
      padding: 15px;
      margin: 20px 0;
    }
    .detail-box {
      background-color: #f8f9fa;
      border-left: 4px solid #0070f3;
      padding: 15px;
      margin: 20px 0;
    }
    .detail-row {
      display: flex;
      justify-content: space-between;
      margin: 10px 0;
    }
    .label {
      font-weight: 600;
      color: #666;
    }
    .value {
      color: #000;
      font-weight: 500;
    }
    .info {
      background-color: #d1ecf1;
      border-left: 4px solid #17a2b8;
      padding: 15px;
      margin: 20px 0;
    }
    .footer {
      text-align: center;
      margin-top: 30px;
      padding-top: 20px;
      border-top: 1px solid #e0e0e0;
      color: #666;
      font-size: 14px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>✓ Platba přijata</h1>
    </div>

    <div class="success-box">
      <h3 style="margin-top: 0;">🎉 Rezervace potvrzena!</h3>
      <p>Kauce ve výši <strong>${depositAmount}</strong> byla úspěšně zaplacena.</p>
      <p>Vaše rezervace je nyní potvrzena.</p>
    </div>

    <p>Dobrý den <strong>${booking.customerName}</strong>,</p>
    <p>Těšíme se na Vaši návštěvu!</p>

    <div class="detail-box">
      <h3 style="margin-top: 0;">📅 Detail návštěvy</h3>
      <div class="detail-row">
        <span class="label">Služba:</span>
        <span class="value">${booking.service.name}</span>
      </div>
      <div class="detail-row">
        <span class="label">Datum:</span>
        <span class="value">${date}</span>
      </div>
      <div class="detail-row">
        <span class="label">Čas:</span>
        <span class="value">${time}</span>
      </div>
      <div class="detail-row">
        <span class="label">Trvání:</span>
        <span class="value">${booking.service.duration} minut</span>
      </div>
      <hr style="border: none; border-top: 1px solid #ddd; margin: 15px 0;">
      <div class="detail-row">
        <span class="label">Celková cena:</span>
        <span class="value">${totalPrice}</span>
      </div>
      <div class="detail-row">
        <span class="label">Zaplacená kauce:</span>
        <span class="value">${depositAmount}</span>
      </div>
      <div class="detail-row">
        <span class="label">K doplacení na místě:</span>
        <span class="value"><strong>${remainingAmount}</strong></span>
      </div>
    </div>

    <div class="info">
      <h3 style="margin-top: 0;">📝 Co si přinést</h3>
      <ul style="margin: 10px 0; padding-left: 20px;">
        <li>Průkaz totožnosti (občanský průkaz)</li>
        <li>Kartu pojišťovny (pokud máte)</li>
        <li>Seznam léků, které užíváte</li>
        <li>Potvrzení o platbě kauce (tento email)</li>
      </ul>
    </div>

    <div class="info">
      <h3 style="margin-top: 0;">⚠️ Storno podmínky</h3>
      <p>Pokud potřebujete termín zrušit:</p>
      <ul style="margin: 10px 0; padding-left: 20px;">
        <li>Zrušení do 24 hodin před termínem: kauce bude vrácena v plné výši</li>
        <li>Zrušení méně než 24 hodin před termínem: kauce propadá</li>
      </ul>
      <p>Pro zrušení nás prosím kontaktujte na telefonu nebo emailu níže.</p>
    </div>

    <div class="footer">
      <p><strong>Kontakt na ordinaci:</strong></p>
      <p>
        📞 ${contact.phone}<br>
        📧 ${contact.email}<br>
        📍 ${contact.address}
      </p>
      <p style="color: #999; font-size: 12px; margin-top: 20px;">
        ID rezervace: ${booking.id}
      </p>
    </div>
  </div>
</body>
</html>
  `.trim()
}

/**
 * Reminder Email Template
 * Sent 24 hours before appointment.
 */
function reminderTemplate(booking: Booking): string {
  const date = formatDate(booking.appointmentDate)
  const time = formatTime(booking.appointmentTime)
  const remainingAmount = formatPrice(booking.service.price - booking.depositAmount)
  const contact = getContactInfo()

  return `
<!DOCTYPE html>
<html lang="cs">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Připomínka návštěvy</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      background-color: #f5f5f5;
    }
    .container {
      background-color: #ffffff;
      border-radius: 8px;
      padding: 30px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .header {
      text-align: center;
      border-bottom: 3px solid #ffc107;
      padding-bottom: 20px;
      margin-bottom: 30px;
    }
    h1 {
      color: #ffc107;
      margin: 0;
      font-size: 24px;
    }
    .reminder-box {
      background-color: #fff3cd;
      border-left: 4px solid #ffc107;
      padding: 15px;
      margin: 20px 0;
    }
    .detail-box {
      background-color: #f8f9fa;
      border-left: 4px solid #0070f3;
      padding: 15px;
      margin: 20px 0;
    }
    .detail-row {
      display: flex;
      justify-content: space-between;
      margin: 10px 0;
    }
    .label {
      font-weight: 600;
      color: #666;
    }
    .value {
      color: #000;
      font-weight: 500;
    }
    .info {
      background-color: #d1ecf1;
      border-left: 4px solid #17a2b8;
      padding: 15px;
      margin: 20px 0;
    }
    .footer {
      text-align: center;
      margin-top: 30px;
      padding-top: 20px;
      border-top: 1px solid #e0e0e0;
      color: #666;
      font-size: 14px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🔔 Připomínka návštěvy</h1>
    </div>

    <p>Dobrý den <strong>${booking.customerName}</strong>,</p>
    <p>Připomínáme Vám, že zítra máte objednaný termín v naší dentální ordinaci.</p>

    <div class="reminder-box">
      <h3 style="margin-top: 0;">⏰ Termín je zítra!</h3>
      <p style="font-size: 18px; margin: 0;">
        <strong>${date}</strong> v <strong>${time}</strong>
      </p>
    </div>

    <div class="detail-box">
      <h3 style="margin-top: 0;">📅 Detail návštěvy</h3>
      <div class="detail-row">
        <span class="label">Služba:</span>
        <span class="value">${booking.service.name}</span>
      </div>
      <div class="detail-row">
        <span class="label">Trvání:</span>
        <span class="value">${booking.service.duration} minut</span>
      </div>
      <div class="detail-row">
        <span class="label">K doplacení:</span>
        <span class="value"><strong>${remainingAmount}</strong></span>
      </div>
    </div>

    <div class="info">
      <h3 style="margin-top: 0;">📝 Co si přinést</h3>
      <ul style="margin: 10px 0; padding-left: 20px;">
        <li>Průkaz totožnosti</li>
        <li>Kartu pojišťovny</li>
        <li>Seznam léků, které užíváte</li>
      </ul>
    </div>

    <div class="info">
      <h3 style="margin-top: 0;">⚠️ Potřebujete zrušit?</h3>
      <p>Pokud se nemůžete dostavit, kontaktujte nás prosím co nejdříve.</p>
      <p><strong>Připomínáme:</strong> Zrušení méně než 24 hodin před termínem znamená propadnutí kauce.</p>
    </div>

    <div class="footer">
      <p><strong>Kontakt na ordinaci:</strong></p>
      <p>
        📞 ${contact.phone}<br>
        📧 ${contact.email}<br>
        📍 ${contact.address}
      </p>
      <p style="color: #999; font-size: 12px; margin-top: 20px;">
        Těšíme se na Vás!
      </p>
    </div>
  </div>
</body>
</html>
  `.trim()
}

/**
 * Cancellation Email Template
 * Sent when booking is cancelled.
 */
function cancellationTemplate(booking: Booking, refundAmount?: number): string {
  const date = formatDate(booking.appointmentDate)
  const time = formatTime(booking.appointmentTime)
  const depositAmount = formatPrice(booking.depositAmount)
  const contact = getContactInfo()

  const refundInfo = refundAmount !== undefined
    ? `<p>Kauce ve výši <strong>${formatPrice(refundAmount)}</strong> bude vrácena na Váš účet do 5 pracovních dnů.</p>`
    : `<p>Kauce ve výši <strong>${depositAmount}</strong> propadá v souladu se storno podmínkami (zrušení méně než 24 hodin před termínem).</p>`

  return `
<!DOCTYPE html>
<html lang="cs">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Rezervace zrušena</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      background-color: #f5f5f5;
    }
    .container {
      background-color: #ffffff;
      border-radius: 8px;
      padding: 30px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .header {
      text-align: center;
      border-bottom: 3px solid #dc3545;
      padding-bottom: 20px;
      margin-bottom: 30px;
    }
    h1 {
      color: #dc3545;
      margin: 0;
      font-size: 24px;
    }
    .cancel-box {
      background-color: #f8d7da;
      border-left: 4px solid #dc3545;
      padding: 15px;
      margin: 20px 0;
    }
    .detail-box {
      background-color: #f8f9fa;
      border-left: 4px solid #6c757d;
      padding: 15px;
      margin: 20px 0;
    }
    .detail-row {
      display: flex;
      justify-content: space-between;
      margin: 10px 0;
    }
    .label {
      font-weight: 600;
      color: #666;
    }
    .value {
      color: #000;
      font-weight: 500;
    }
    .info {
      background-color: #d1ecf1;
      border-left: 4px solid #17a2b8;
      padding: 15px;
      margin: 20px 0;
    }
    .footer {
      text-align: center;
      margin-top: 30px;
      padding-top: 20px;
      border-top: 1px solid #e0e0e0;
      color: #666;
      font-size: 14px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>✕ Rezervace zrušena</h1>
    </div>

    <p>Dobrý den <strong>${booking.customerName}</strong>,</p>
    <p>Informujeme Vás, že Vaše rezervace byla zrušena.</p>

    <div class="cancel-box">
      <h3 style="margin-top: 0;">🗓️ Zrušený termín</h3>
      <div class="detail-row">
        <span class="label">Služba:</span>
        <span class="value">${booking.service.name}</span>
      </div>
      <div class="detail-row">
        <span class="label">Datum:</span>
        <span class="value">${date}</span>
      </div>
      <div class="detail-row">
        <span class="label">Čas:</span>
        <span class="value">${time}</span>
      </div>
    </div>

    <div class="info">
      <h3 style="margin-top: 0;">💰 Vrácení kauce</h3>
      ${refundInfo}
    </div>

    <div class="info">
      <h3 style="margin-top: 0;">📅 Nová rezervace</h3>
      <p>Pokud si chcete objednat nový termín, navštivte prosím naše webové stránky nebo nás kontaktujte telefonicky.</p>
    </div>

    <div class="footer">
      <p><strong>Kontakt na ordinaci:</strong></p>
      <p>
        📞 ${contact.phone}<br>
        📧 ${contact.email}<br>
        📍 ${contact.address}
      </p>
      <p style="color: #999; font-size: 12px; margin-top: 20px;">
        Děkujeme za pochopení.
      </p>
    </div>
  </div>
</body>
</html>
  `.trim()
}

// ============================================
// Public API Functions
// ============================================

/**
 * Send booking confirmation email with payment link.
 * Called after booking is created (status: PENDING_PAYMENT).
 */
export async function sendBookingConfirmation(
  booking: Booking,
  paymentUrl: string
): Promise<{ success: boolean; error?: string }> {
  const subject = `Rezervace vytvořena - ${booking.service.name} dne ${formatDate(booking.appointmentDate)}`
  const html = bookingConfirmationTemplate(booking, paymentUrl)

  return sendEmail({
    to: booking.customerEmail,
    subject,
    html,
  })
}

/**
 * Send payment confirmation email.
 * Called after successful payment (status: PAID).
 */
export async function sendPaymentConfirmation(
  booking: Booking
): Promise<{ success: boolean; error?: string }> {
  const subject = `Platba přijata - potvrzení rezervace`
  const html = paymentConfirmationTemplate(booking)

  return sendEmail({
    to: booking.customerEmail,
    subject,
    html,
  })
}

/**
 * Send appointment reminder email.
 * Should be sent 24 hours before appointment.
 */
export async function sendReminder(
  booking: Booking
): Promise<{ success: boolean; error?: string }> {
  const subject = `Připomínka: Návštěva zítra v ${formatTime(booking.appointmentTime)}`
  const html = reminderTemplate(booking)

  return sendEmail({
    to: booking.customerEmail,
    subject,
    html,
  })
}

/**
 * Send cancellation notification email.
 * Called when booking is cancelled.
 *
 * @param booking - Booking data
 * @param refundAmount - Amount to refund in haléře (undefined if no refund)
 */
export async function sendCancellation(
  booking: Booking,
  refundAmount?: number
): Promise<{ success: boolean; error?: string }> {
  const subject = `Rezervace zrušena - ${booking.service.name}`
  const html = cancellationTemplate(booking, refundAmount)

  return sendEmail({
    to: booking.customerEmail,
    subject,
    html,
  })
}
