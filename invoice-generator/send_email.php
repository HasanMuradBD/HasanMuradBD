<?php
/**
 * Setupline Invoice Generator — send_email.php
 * Generates the invoice PDF in-memory, attaches it, and sends via PHPMailer SMTP.
 */

require_once __DIR__ . '/vendor/autoload.php';

use Dompdf\Dompdf;
use Dompdf\Options;
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

header('Content-Type: application/json');

/* ──────────────────────────────────────────────
   SMTP CONFIGURATION — fill in your Hostinger
   credentials here before uploading.
   ────────────────────────────────────────────── */
define('SMTP_HOST',     'smtp.hostinger.com');         // Hostinger SMTP host
define('SMTP_PORT',     465);                          // 465 for SSL  |  587 for TLS
define('SMTP_SECURE',   PHPMailer::ENCRYPTION_SMTPS);  // ENCRYPTION_SMTPS (SSL) | ENCRYPTION_STARTTLS (TLS)
define('SMTP_USERNAME', 'billing@yourdomain.com');     // ← YOUR Hostinger mailbox address (also used as From)
define('SMTP_PASSWORD', 'your_email_password');        // ← YOUR email password
define('SMTP_FROM_NAME','Setupline Agency');           // Display name shown to recipients

/* ─────────────────────────────────────────────────────────────────────
   BRANDING — replace with your logo URL (publicly accessible HTTPS).
   Recommended: 200×60 px transparent PNG hosted on your domain/CDN.
   Set to '' to fall back to the styled text logo.
   ───────────────────────────────────────────────────────────────────── */
define('EMAIL_LOGO_URL', 'https://yourdomain.com/assets/setupline-logo.png');

/* ── Read & decode payload ── */
$raw  = file_get_contents('php://input');
$data = json_decode($raw, true);

if (!$data) {
    echo json_encode(['success' => false, 'message' => 'Invalid request payload.']);
    exit;
}

$toEmail = filter_var($data['toEmail'] ?? '', FILTER_VALIDATE_EMAIL);
if (!$toEmail) {
    echo json_encode(['success' => false, 'message' => 'Invalid recipient email address.']);
    exit;
}

/* ── Re-use PDF generation logic (same as generate_pdf.php) ── */
function buildInvoiceHtml(array $data): string
{
    $e = fn($v) => htmlspecialchars($v ?? '', ENT_QUOTES, 'UTF-8');

    $fromName      = $e($data['fromName']      ?? 'Setupline Agency');
    $fromEmail     = $e($data['fromEmail']      ?? '');
    $fromPhone     = $e($data['fromPhone']      ?? '+1 213 221 0369');
    $fromAddress   = nl2br($e($data['fromAddress'] ?? ''));
    $clientName    = $e($data['clientName']     ?? '');
    $clientEmail   = $e($data['clientEmail']    ?? '');
    $clientPhone   = $e($data['clientPhone']    ?? '');
    $clientAddress = $e($data['clientAddress']  ?? '');
    $invoiceNumber = $e($data['invoiceNumber']  ?? '');
    $invoiceDate   = $e($data['invoiceDate']    ?? '');
    $dueDate       = $e($data['dueDate']        ?? '');
    $paymentStatus = $e($data['paymentStatus']  ?? 'Unpaid');
    $currencySymbol= $e($data['currencySymbol'] ?? '$');
    $notes         = nl2br($e($data['notes']       ?? ''));
    $bankDetails   = nl2br($e($data['bankDetails'] ?? ''));
    $paymentLink   = $e($data['paymentLink']       ?? '');
    $items         = $data['items']      ?? [];
    $subtotal      = (float)($data['subtotal']  ?? 0);
    $taxRate       = (float)($data['taxRate']   ?? 0);
    $taxAmount     = (float)($data['taxAmount'] ?? 0);
    $grandTotal    = (float)($data['grandTotal']?? 0);

    $statusColors = [
        'Paid'    => ['bg' => '#d1fae5', 'color' => '#065f46'],
        'Unpaid'  => ['bg' => '#fee2e2', 'color' => '#991b1b'],
        'Partial' => ['bg' => '#fef3c7', 'color' => '#92400e'],
        'Overdue' => ['bg' => '#fce7f3', 'color' => '#9d174d'],
    ];
    $sc = $statusColors[$paymentStatus] ?? $statusColors['Unpaid'];

    $itemRows = '';
    foreach ($items as $item) {
        $desc  = $e($item['desc']  ?? '');
        $qty   = $e((string)($item['qty']   ?? 0));
        $price = number_format((float)($item['price'] ?? 0), 2);
        $total = number_format((float)($item['total'] ?? 0), 2);
        $itemRows .= "
    <tr>
        <td style='padding:10px 12px; border-bottom:1px solid #f1f5f9; font-size:13px;'>{$desc}</td>
        <td style='padding:10px 12px; border-bottom:1px solid #f1f5f9; font-size:13px; text-align:center;'>{$qty}</td>
        <td style='padding:10px 12px; border-bottom:1px solid #f1f5f9; font-size:13px; text-align:right;'>{$currencySymbol}{$price}</td>
        <td style='padding:10px 12px; border-bottom:1px solid #f1f5f9; font-size:13px; text-align:right; font-weight:600;'>{$currencySymbol}{$total}</td>
    </tr>";
    }

    $fSub = number_format($subtotal, 2);
    $fTax = number_format($taxAmount, 2);
    $fGrand = number_format($grandTotal, 2);

    /* Build payment link block for PDF */
    $payLinkBlock = !empty($paymentLink) ? "
  <div style='margin-top:20px; text-align:right;'>
    <a href='{$paymentLink}'
       style='display:inline-block; background:#4f46e5; color:#ffffff; font-size:13px; font-weight:700;
              padding:10px 24px; border-radius:8px; text-decoration:none;'>
      Pay Invoice Online &#8594;
    </a>
    <div style='font-size:10px; color:#9ca3af; margin-top:4px;'>{$paymentLink}</div>
  </div>" : '';

    /* Combine notes + bank details */
    $notesContent = '';
    if (!empty(strip_tags($notes)))       $notesContent .= $notes;
    if (!empty(strip_tags($bankDetails))) {
        if ($notesContent) $notesContent .= '<br/><br/>';
        $notesContent .= '<strong>Bank Transfer Details:</strong><br/>' . $bankDetails;
    }
    $notesBlock = $notesContent ? "
  <div style='background:#f8fafc; border-left:3px solid #4f46e5; padding:12px 16px; margin-top:28px; border-radius:4px;'>
    <div style='font-size:10px; font-weight:700; color:#4f46e5; text-transform:uppercase; letter-spacing:1px; margin-bottom:4px;'>Notes &amp; Payment Instructions</div>
    <div style='font-size:12px; color:#374151; line-height:1.7;'>{$notesContent}</div>
  </div>" : '';

    /* Logo cell for PDF */
    $pdfLogoCell = !empty(EMAIL_LOGO_URL)
        ? '<img src="' . EMAIL_LOGO_URL . '" alt="Setupline" style="max-height:52px; max-width:200px;"/>'
        : '<span style="font-size:26px; font-weight:700; color:#1e1b4b;">SETUP</span>'
          . '<span style="font-size:26px; font-style:italic; font-weight:300; color:#4f46e5;">LINE</span>';

    return <<<HTML
<!DOCTYPE html><html><head><meta charset="UTF-8"/>
<style>
* { margin:0; padding:0; box-sizing:border-box; }
body { font-family: DejaVu Sans, sans-serif; font-size:13px; color:#111827; background:#fff; }
.page { padding:40px 44px; }
</style>
</head><body><div class="page">
<table width="100%" style="margin-bottom:28px;"><tr>
  <td style="vertical-align:middle;">
    {$pdfLogoCell}
    <div style="font-size:11px; color:#6b7280; margin-top:4px;">{$fromName}</div>
  </td>
  <td style="text-align:right; vertical-align:middle;">
    <div style="font-size:28px; font-weight:700; color:#4f46e5;">INVOICE</div>
    <div style="font-size:13px; color:#6b7280; margin-top:4px;">#{$invoiceNumber}</div>
    <span style="display:inline-block; margin-top:8px; padding:4px 12px; border-radius:99px; background:{$sc['bg']}; color:{$sc['color']}; font-size:11px; font-weight:700; text-transform:uppercase;">{$paymentStatus}</span>
  </td>
</tr></table>
<hr style="border:none; border-top:2px solid #4f46e5; margin-bottom:24px;"/>
<table width="100%" style="margin-bottom:24px;"><tr>
  <td style="width:50%; vertical-align:top; padding-right:20px;">
    <div style="font-size:10px; font-weight:700; color:#4f46e5; text-transform:uppercase; letter-spacing:1px; margin-bottom:6px;">From</div>
    <div style="font-size:14px; font-weight:700; color:#111827;">{$fromName}</div>
    <div style="font-size:12px; color:#374151; line-height:1.7;">{$fromEmail}<br/>{$fromPhone}<br/>{$fromAddress}</div>
  </td>
  <td style="width:50%; vertical-align:top; padding-left:20px;">
    <div style="font-size:10px; font-weight:700; color:#4f46e5; text-transform:uppercase; letter-spacing:1px; margin-bottom:6px;">Bill To</div>
    <div style="font-size:14px; font-weight:700; color:#111827;">{$clientName}</div>
    <div style="font-size:12px; color:#374151; line-height:1.7;">{$clientEmail}<br/>{$clientPhone}<br/>{$clientAddress}</div>
  </td>
</tr></table>
<table width="100%" style="margin-bottom:24px; font-size:12px;">
  <tr><td style="color:#6b7280; width:15%;">Invoice Date</td><td style="font-weight:600;">{$invoiceDate}</td>
  <td style="color:#6b7280; width:10%; padding-left:30px;">Due Date</td><td style="font-weight:600;">{$dueDate}</td></tr>
</table>
<table width="100%" style="border-collapse:collapse; margin-bottom:24px;">
  <thead><tr style="background:#1e1b4b;">
    <th style="padding:10px 12px; font-size:11px; font-weight:700; color:#fff; text-transform:uppercase; text-align:left; width:50%;">Description</th>
    <th style="padding:10px 12px; font-size:11px; font-weight:700; color:#fff; text-transform:uppercase; text-align:center; width:12%;">Qty</th>
    <th style="padding:10px 12px; font-size:11px; font-weight:700; color:#fff; text-transform:uppercase; text-align:right; width:19%;">Unit Price</th>
    <th style="padding:10px 12px; font-size:11px; font-weight:700; color:#fff; text-transform:uppercase; text-align:right; width:19%;">Total</th>
  </tr></thead>
  <tbody>{$itemRows}</tbody>
</table>
<table width="100%"><tr><td></td><td width="240" style="vertical-align:top;">
  <table width="100%" style="font-size:12px;">
    <tr><td style="color:#6b7280; padding:3px 0;">Subtotal</td><td style="text-align:right; font-weight:600;">{$currencySymbol}{$fSub}</td></tr>
    <tr><td style="color:#6b7280; padding:3px 0;">Tax ({$taxRate}%)</td><td style="text-align:right; font-weight:600;">{$currencySymbol}{$fTax}</td></tr>
    <tr style="border-top:2px solid #4f46e5;"><td style="font-size:15px; font-weight:700; color:#1e1b4b; padding-top:8px;">Total Due</td>
    <td style="font-size:18px; font-weight:700; color:#4f46e5; text-align:right; padding-top:8px;">{$currencySymbol}{$fGrand}</td></tr>
  </table>
</td></tr></table>
{$payLinkBlock}
{$notesBlock}
<div style="margin-top:36px; border-top:1px solid #e5e7eb; padding-top:12px; text-align:center; font-size:10px; color:#9ca3af;">
  Thank you for your business! &bull; {$fromName} &bull; {$fromPhone} &bull; {$fromEmail}
</div>
</div></body></html>
HTML;
}

/* ── Generate PDF in memory ── */
try {
    $options = new Options();
    $options->set('isHtml5ParserEnabled', true);
    $options->set('isPhpEnabled', false);
    $options->set('defaultFont', 'DejaVu Sans');

    $dompdf = new Dompdf($options);
    $dompdf->loadHtml(buildInvoiceHtml($data));
    $dompdf->setPaper('A4', 'portrait');
    $dompdf->render();
    $pdfContent = $dompdf->output();
} catch (Throwable $e) {
    echo json_encode(['success' => false, 'message' => 'PDF generation error: ' . $e->getMessage()]);
    exit;
}

/* ── Send via PHPMailer ── */
$mail = new PHPMailer(true);
try {
    $mail->isSMTP();
    $mail->Host       = SMTP_HOST;
    $mail->SMTPAuth   = true;
    $mail->Username   = SMTP_USERNAME;
    $mail->Password   = SMTP_PASSWORD;
    $mail->SMTPSecure = SMTP_SECURE;
    $mail->Port       = SMTP_PORT;

    $invoiceNumber = $data['invoiceNumber'] ?? 'Invoice';
    $clientName    = $data['clientName']    ?? 'Client';
    $subject       = $data['subject']       ?? "Invoice {$invoiceNumber} from Setupline";
    $message       = $data['message']       ?? "Please find your invoice attached.";

    /* ── Sender identity ──────────────────────────────────────────────────
       setFrom: the address that appears in the "From:" field of the email.
       Must match your authenticated SMTP_USERNAME to avoid spam rejection.
       SMTP_FROM_NAME is the human-readable display name beside the address.
       ─────────────────────────────────────────────────────────────────── */
    $mail->setFrom(SMTP_USERNAME, SMTP_FROM_NAME);

    /* ── Reply-To ──────────────────────────────────────────────────────────
       When a client hits "Reply", their email client will address it here.
       Change SMTP_USERNAME to any address you want replies delivered to,
       e.g. 'support@setupline.com' — it does NOT need to match SMTP_USERNAME.
       ─────────────────────────────────────────────────────────────────── */
    $mail->addReplyTo(SMTP_USERNAME, SMTP_FROM_NAME);

    $mail->addAddress($toEmail, $clientName);

    /* Attach PDF from memory */
    $filename = 'Invoice-' . preg_replace('/[^A-Za-z0-9\-_]/', '', $invoiceNumber) . '.pdf';
    $mail->addStringAttachment($pdfContent, $filename, PHPMailer::ENCODING_BASE64, 'application/pdf');

    $mail->isHTML(true);
    $mail->Subject = $subject;

    /* Plain-text body (fallback for email clients that don't render HTML) */
    $plainParts = [$message];
    if (!empty($data['paymentLink'])) {
        $plainParts[] = "Pay online: " . $data['paymentLink'];
    }
    if (!empty($data['bankDetails'])) {
        $plainParts[] = "Bank Transfer Details:\n" . $data['bankDetails'];
    }
    $mail->AltBody = implode("\n\n", $plainParts);

    /* ── Build HTML email body ── */
    $htmlMessage  = nl2br(htmlspecialchars($message,              ENT_QUOTES, 'UTF-8'));
    $paymentLink  = htmlspecialchars($data['paymentLink'] ?? '',  ENT_QUOTES, 'UTF-8');
    $bankDetails  = nl2br(htmlspecialchars($data['bankDetails'] ?? '', ENT_QUOTES, 'UTF-8'));
    $fromPhone    = htmlspecialchars($data['fromPhone'] ?? '+1 213 221 0369', ENT_QUOTES, 'UTF-8');
    $fromName_    = htmlspecialchars($data['fromName']  ?? 'Setupline Agency', ENT_QUOTES, 'UTF-8');

    /* Logo: image if URL is configured, else styled text */
    $logoHtml = !empty(EMAIL_LOGO_URL)
        ? '<img src="' . EMAIL_LOGO_URL . '" alt="Setupline" style="max-height:48px; max-width:180px; display:block;" />'
        : '<span style="font-size:22px; font-weight:700; color:#fff;">SETUP</span>'
          . '<span style="font-size:22px; font-style:italic; font-weight:300; color:#a5b4fc;">LINE</span>';

    /* "Pay Invoice Now" button — only rendered when a payment link is provided */
    $payButtonHtml = '';
    if (!empty($paymentLink)) {
        $payButtonHtml = <<<BTN
    <!-- Pay Now Button -->
    <div style="margin-top:28px; text-align:center;">
      <a href="{$paymentLink}"
         style="display:inline-block; background:#4f46e5; color:#ffffff; font-family:Arial,sans-serif;
                font-size:16px; font-weight:700; padding:14px 36px; border-radius:10px;
                text-decoration:none; letter-spacing:0.3px;">
        Pay Invoice Now &#8594;
      </a>
      <p style="font-size:11px; color:#9ca3af; margin-top:8px;">
        Or copy this link: <a href="{$paymentLink}" style="color:#6366f1;">{$paymentLink}</a>
      </p>
    </div>
BTN;
    }

    /* Bank transfer details block — only rendered when details are provided */
    $bankDetailsHtml = '';
    if (!empty($bankDetails)) {
        $bankDetailsHtml = <<<BANK
    <!-- Bank Transfer Details -->
    <div style="margin-top:24px; background:#f8fafc; border-left:4px solid #4f46e5;
                border-radius:6px; padding:16px 20px;">
      <div style="font-size:11px; font-weight:700; color:#4f46e5; text-transform:uppercase;
                  letter-spacing:1px; margin-bottom:8px;">Bank Transfer Details</div>
      <p style="font-size:13px; color:#374151; line-height:1.8; font-family:monospace;">{$bankDetails}</p>
    </div>
BANK;
    }

    $mail->Body = <<<BODY
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/></head>
<body style="margin:0; padding:0; background:#f3f4f6; font-family:Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f3f4f6; padding:32px 0;">
  <tr><td align="center">
    <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px; width:100%;">

      <!-- Header / Logo -->
      <tr>
        <td style="background:#1e1b4b; padding:22px 32px; border-radius:12px 12px 0 0;">
          {$logoHtml}
        </td>
      </tr>

      <!-- Body -->
      <tr>
        <td style="background:#ffffff; padding:32px; border:1px solid #e5e7eb; border-top:none; border-radius:0 0 12px 12px;">

          <!-- Message -->
          <p style="font-size:15px; line-height:1.9; color:#374151; margin:0 0 8px 0;">{$htmlMessage}</p>

          {$payButtonHtml}

          {$bankDetailsHtml}

          <!-- PDF attachment notice -->
          <div style="margin-top:24px; padding:14px 16px; background:#eef2ff; border-radius:8px;
                      font-size:13px; color:#4338ca;">
            &#128206; <strong>{$filename}</strong> is attached to this email.
          </div>

        </td>
      </tr>

      <!-- Footer -->
      <tr>
        <td style="padding:20px 0; text-align:center;">
          <p style="font-size:11px; color:#9ca3af; margin:0;">
            {$fromName_} &bull; {$fromPhone} &bull;
            <a href="mailto:{$data['fromEmail']}" style="color:#9ca3af;">{$data['fromEmail']}</a>
          </p>
        </td>
      </tr>

    </table>
  </td></tr>
</table>
</body>
</html>
BODY;

    $mail->send();
    echo json_encode(['success' => true, 'message' => 'Invoice sent successfully.']);

} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => 'Email error: ' . $mail->ErrorInfo]);
}
