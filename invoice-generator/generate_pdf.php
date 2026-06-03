<?php
/**
 * Setupline Invoice Generator — generate_pdf.php
 * Accepts JSON POST, builds a styled HTML invoice, renders via Dompdf, returns binary PDF.
 */

require_once __DIR__ . '/vendor/autoload.php';

use Dompdf\Dompdf;
use Dompdf\Options;

/* ─────────────────────────────────────────────────────────────
   BRANDING — replace the URL below with your own logo image.
   Use a publicly accessible HTTPS URL (e.g. your CDN or website).
   Recommended size: 200×60 px, transparent PNG.
   Set to empty string '' to fall back to the text logo.
   ───────────────────────────────────────────────────────────── */
define('LOGO_URL', 'https://yourdomain.com/assets/setupline-logo.png');

header('Content-Type: application/pdf');

/* ── Read & decode input ── */
$raw  = file_get_contents('php://input');
$data = json_decode($raw, true);

if (!$data) {
    http_response_code(400);
    echo 'Invalid JSON payload';
    exit;
}

/* ── Sanitize helper ── */
function e(string $v): string {
    return htmlspecialchars($v ?? '', ENT_QUOTES, 'UTF-8');
}

/* ── Map data ── */
$fromName      = e($data['fromName']      ?? 'Setupline Agency');
$fromEmail     = e($data['fromEmail']     ?? '');
$fromPhone     = e($data['fromPhone']     ?? '+1 213 221 0369');
$fromAddress   = nl2br(e($data['fromAddress'] ?? ''));
$clientName    = e($data['clientName']    ?? '');
$clientEmail   = e($data['clientEmail']   ?? '');
$clientPhone   = e($data['clientPhone']   ?? '');
$clientAddress = e($data['clientAddress'] ?? '');
$invoiceNumber = e($data['invoiceNumber'] ?? '');
$invoiceDate   = e($data['invoiceDate']   ?? '');
$dueDate       = e($data['dueDate']       ?? '');
$paymentStatus = e($data['paymentStatus'] ?? 'Unpaid');
$currencySymbol= e($data['currencySymbol'] ?? '$');
$notes         = nl2br(e($data['notes']       ?? ''));
$bankDetails   = nl2br(e($data['bankDetails'] ?? ''));
$paymentLink   = e($data['paymentLink']       ?? '');
$items         = $data['items']     ?? [];
$subtotal      = (float)($data['subtotal']  ?? 0);
$taxRate       = (float)($data['taxRate']   ?? 0);
$taxAmount     = (float)($data['taxAmount'] ?? 0);
$grandTotal    = (float)($data['grandTotal']?? 0);

/* ── Payment status badge colour ── */
$statusColors = [
    'Paid'    => ['bg' => '#d1fae5', 'color' => '#065f46'],
    'Unpaid'  => ['bg' => '#fee2e2', 'color' => '#991b1b'],
    'Partial' => ['bg' => '#fef3c7', 'color' => '#92400e'],
    'Overdue' => ['bg' => '#fce7f3', 'color' => '#9d174d'],
];
$sc = $statusColors[$paymentStatus] ?? $statusColors['Unpaid'];

/* ── Build line item rows ── */
$itemRows = '';
foreach ($items as $item) {
    $desc  = e($item['desc']  ?? '');
    $qty   = e((string)($item['qty']   ?? 0));
    $price = number_format((float)($item['price'] ?? 0), 2);
    $total = number_format((float)($item['total'] ?? 0), 2);
    $itemRows .= "
    <tr>
        <td style='padding:10px 12px; border-bottom:1px solid #f1f5f9; font-size:13px; color:#374151;'>{$desc}</td>
        <td style='padding:10px 12px; border-bottom:1px solid #f1f5f9; font-size:13px; color:#374151; text-align:center;'>{$qty}</td>
        <td style='padding:10px 12px; border-bottom:1px solid #f1f5f9; font-size:13px; color:#374151; text-align:right;'>{$currencySymbol}{$price}</td>
        <td style='padding:10px 12px; border-bottom:1px solid #f1f5f9; font-size:13px; color:#374151; text-align:right; font-weight:600;'>{$currencySymbol}{$total}</td>
    </tr>";
}

/* ── Formatted numbers ── */
$fSubtotal  = number_format($subtotal,  2);
$fTaxAmount = number_format($taxAmount, 2);
$fGrand     = number_format($grandTotal,2);
$fTaxRate   = $taxRate;

/* ── HTML Template ── */
$html = <<<HTML
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<style>
  * { margin:0; padding:0; box-sizing:border-box; }
  body { font-family: DejaVu Sans, sans-serif; font-size:13px; color:#111827; background:#fff; }
  .page { padding: 40px 44px; }
  .header { display:table; width:100%; margin-bottom:32px; }
  .header-left  { display:table-cell; vertical-align:middle; width:50%; }
  .header-right { display:table-cell; vertical-align:middle; width:50%; text-align:right; }
  .logo-setup { font-size:26px; font-weight:700; color:#1e1b4b; letter-spacing:-0.5px; }
  .logo-line  { font-size:26px; font-style:italic; font-weight:300; color:#4f46e5; }
  .invoice-title { font-size:28px; font-weight:700; color:#4f46e5; letter-spacing:-1px; }
  .invoice-num   { font-size:13px; color:#6b7280; margin-top:4px; }
  .divider { border:none; border-top:2px solid #4f46e5; margin:0 0 24px 0; }
  .badge { display:inline-block; padding:4px 12px; border-radius:99px; font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:0.5px; }
  .section-title { font-size:10px; font-weight:700; color:#4f46e5; text-transform:uppercase; letter-spacing:1px; margin-bottom:6px; }
  .addr-block { font-size:12px; color:#374151; line-height:1.7; }
  .addr-name { font-size:14px; font-weight:700; color:#111827; margin-bottom:2px; }
  .meta-table { width:100%; border-collapse:collapse; margin-bottom:28px; }
  .meta-table td { padding:3px 0; font-size:12px; }
  .meta-label { color:#6b7280; width:40%; }
  .meta-value { color:#111827; font-weight:600; }
  .items-table { width:100%; border-collapse:collapse; margin-bottom:24px; }
  .items-table thead tr { background:#1e1b4b; }
  .items-table thead th { padding:10px 12px; font-size:11px; font-weight:700; color:#fff; text-transform:uppercase; letter-spacing:0.5px; }
  .items-table tbody tr:nth-child(even) td { background:#f8fafc; }
  .totals-wrap { width:100%; }
  .totals-right { float:right; width:240px; }
  .totals-row { display:table; width:100%; margin-bottom:5px; }
  .totals-label { display:table-cell; font-size:12px; color:#6b7280; }
  .totals-val   { display:table-cell; font-size:12px; color:#374151; font-weight:600; text-align:right; }
  .totals-grand-label { display:table-cell; font-size:15px; font-weight:700; color:#1e1b4b; }
  .totals-grand-val   { display:table-cell; font-size:18px; font-weight:700; color:#4f46e5; text-align:right; }
  .grand-row { border-top:2px solid #4f46e5; padding-top:8px; margin-top:4px; display:table; width:100%; }
  .notes-box { background:#f8fafc; border-left:3px solid #4f46e5; padding:12px 16px; margin-top:28px; border-radius:4px; }
  .footer { margin-top:36px; border-top:1px solid #e5e7eb; padding-top:12px; text-align:center; font-size:10px; color:#9ca3af; }
  .two-col { display:table; width:100%; margin-bottom:28px; }
  .col-left  { display:table-cell; width:50%; vertical-align:top; padding-right:20px; }
  .col-right { display:table-cell; width:50%; vertical-align:top; padding-left:20px; }
</style>
</head>
<body>
<div class="page">

  <!-- Header -->
  <div class="header">
    <div class="header-left">
HTML;

/* Render image logo if URL is set, otherwise fall back to styled text */
if (!empty(LOGO_URL)) {
    $html .= "      <div><img src=\"" . LOGO_URL . "\" alt=\"Setupline\" style=\"max-height:52px; max-width:200px;\"/></div>\n";
} else {
    $html .= "      <div><span class=\"logo-setup\">SETUP</span><span class=\"logo-line\">LINE</span></div>\n";
}

$html .= <<<HTML
      <div style="font-size:11px; color:#6b7280; margin-top:4px;">{$fromName}</div>
    </div>
    <div class="header-right">
      <div class="invoice-title">INVOICE</div>
      <div class="invoice-num">#{$invoiceNumber}</div>
      <div style="margin-top:8px;">
        <span class="badge" style="background:{$sc['bg']}; color:{$sc['color']};">{$paymentStatus}</span>
      </div>
    </div>
  </div>

  <hr class="divider"/>

  <!-- From / To / Dates -->
  <div class="two-col">
    <div class="col-left">
      <div class="section-title">From</div>
      <div class="addr-name">{$fromName}</div>
      <div class="addr-block">
        {$fromEmail}<br/>
        {$fromPhone}<br/>
        {$fromAddress}
      </div>
    </div>
    <div class="col-right">
      <div class="section-title">Bill To</div>
      <div class="addr-name">{$clientName}</div>
      <div class="addr-block">
        {$clientEmail}<br/>
        {$clientPhone}<br/>
        {$clientAddress}
      </div>
    </div>
  </div>

  <!-- Invoice Meta -->
  <table class="meta-table">
    <tr>
      <td class="meta-label">Invoice Date</td>
      <td class="meta-value">{$invoiceDate}</td>
      <td class="meta-label" style="padding-left:30px;">Due Date</td>
      <td class="meta-value">{$dueDate}</td>
    </tr>
  </table>

  <!-- Line Items -->
  <table class="items-table">
    <thead>
      <tr>
        <th style="text-align:left; width:50%;">Description</th>
        <th style="text-align:center; width:12%;">Qty</th>
        <th style="text-align:right; width:19%;">Unit Price</th>
        <th style="text-align:right; width:19%;">Total</th>
      </tr>
    </thead>
    <tbody>
      {$itemRows}
    </tbody>
  </table>

  <!-- Totals -->
  <div class="totals-wrap">
    <div class="totals-right">
      <div class="totals-row">
        <span class="totals-label">Subtotal</span>
        <span class="totals-val">{$currencySymbol}{$fSubtotal}</span>
      </div>
      <div class="totals-row">
        <span class="totals-label">Tax ({$fTaxRate}%)</span>
        <span class="totals-val">{$currencySymbol}{$fTaxAmount}</span>
      </div>
      <div class="grand-row">
        <span class="totals-grand-label">Total Due</span>
        <span class="totals-grand-val">{$currencySymbol}{$fGrand}</span>
      </div>
    </div>
  </div>
  <div style="clear:both;"></div>

  <!-- Payment Link (below totals) -->
HTML;

if (!empty($paymentLink)) {
    $html .= "
  <div style='margin-top:20px; text-align:right;'>
    <a href='{$paymentLink}'
       style='display:inline-block; background:#4f46e5; color:#ffffff; font-size:13px; font-weight:700;
              padding:10px 24px; border-radius:8px; text-decoration:none; letter-spacing:0.3px;'>
      Pay Invoice Online &#8594;
    </a>
    <div style='font-size:10px; color:#9ca3af; margin-top:5px;'>{$paymentLink}</div>
  </div>";
}

/* Combine notes + bank details into one notes block */
$notesContent  = '';
if (!empty(strip_tags($notes)))       $notesContent .= $notes;
if (!empty(strip_tags($bankDetails))) {
    if ($notesContent) $notesContent .= '<br/><br/>';
    $notesContent .= '<strong>Bank Transfer Details:</strong><br/>' . $bankDetails;
}

$html .= '  <!-- Notes -->' . PHP_EOL;

if ($notesContent) {
    $html .= "
  <div class='notes-box'>
    <div class='section-title' style='margin-bottom:4px;'>Notes &amp; Payment Instructions</div>
    <div style='font-size:12px; color:#374151; line-height:1.7;'>{$notesContent}</div>
  </div>";
}

$html .= <<<HTML

  <!-- Footer -->
  <div class="footer">
    Thank you for your business! &bull; {$fromName} &bull; {$fromPhone} &bull; {$fromEmail}
  </div>

</div>
</body>
</html>
HTML;

/* ── Render PDF with Dompdf ── */
$options = new Options();
$options->set('isHtml5ParserEnabled', true);
$options->set('isPhpEnabled', false);
$options->set('defaultFont', 'DejaVu Sans');

$dompdf = new Dompdf($options);
$dompdf->loadHtml($html);
$dompdf->setPaper('A4', 'portrait');
$dompdf->render();

$filename = 'Invoice-' . preg_replace('/[^A-Za-z0-9\-_]/', '', $invoiceNumber) . '.pdf';
$dompdf->stream($filename, ['Attachment' => true]);
