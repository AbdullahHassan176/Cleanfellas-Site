// Netlify Function — receives the booking form and sends two emails via Resend:
//   1. Notification to Cleanfellas with all booking details
//   2. Auto-reply to the customer confirming receipt

const RESEND_API = 'https://api.resend.com/emails';
const FROM_ADDRESS = 'bookings@cleanfellas.co.za';      // must match your verified Resend domain
const NOTIFY_ADDRESS = 'cleanfellas@absamail.co.za';    // where Cleanfellas receives bookings
const FALLBACK_ADDRESS = 'abdullah.hassan@globalnext.rocks'; // used only if the primary send fails

exports.handler = async function (event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return { statusCode: 500, body: JSON.stringify({ error: 'Server not configured' }) };
  }

  let body;
  try {
    body = JSON.parse(event.body);
  } catch {
    return { statusCode: 400, body: JSON.stringify({ error: 'Invalid request body' }) };
  }

  const { name, phone, email, company, service, property, urgency, date, time, location, details, ref, source } = body;

  if (!name || !phone || !service) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Missing required fields' }) };
  }

  const preferredDate = date ? new Date(date).toLocaleDateString('en-ZA', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : '';

  // ── Email 1: Notification to Cleanfellas ──────────────────────────────────
  const notifyHtml = `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;color:#2b3138;">
      <div style="background:#0d2940;padding:24px 32px;border-radius:10px 10px 0 0;">
        <h2 style="color:#fff;margin:0;font-size:20px;">New Booking Request${ref ? ' · ' + ref : ''}</h2>
        <p style="color:#a9dcf5;margin:4px 0 0;font-size:14px;">Via Cleanfellas website — ${new Date().toLocaleString('en-ZA')}${source ? ' · Source: ' + source : ''}</p>
      </div>
      <div style="background:#f7fafc;padding:28px 32px;border:1px solid #e0e8f0;border-top:none;">
        <table style="width:100%;border-collapse:collapse;font-size:15px;">
          <tr><td style="padding:8px 0;color:#5b6570;width:140px;">Name</td><td style="padding:8px 0;font-weight:600;">${name}</td></tr>
          <tr><td style="padding:8px 0;color:#5b6570;">Phone</td><td style="padding:8px 0;font-weight:600;"><a href="tel:${phone}" style="color:#1d4e79;">${phone}</a></td></tr>
          ${email ? `<tr><td style="padding:8px 0;color:#5b6570;">Email</td><td style="padding:8px 0;"><a href="mailto:${email}" style="color:#1d4e79;">${email}</a></td></tr>` : ''}
          ${company ? `<tr><td style="padding:8px 0;color:#5b6570;">Company</td><td style="padding:8px 0;">${company}</td></tr>` : ''}
          <tr><td style="padding:8px 0;color:#5b6570;">Service</td><td style="padding:8px 0;font-weight:600;">${service}</td></tr>
          ${property ? `<tr><td style="padding:8px 0;color:#5b6570;">Property type</td><td style="padding:8px 0;">${property}</td></tr>` : ''}
          ${urgency ? `<tr><td style="padding:8px 0;color:#5b6570;">Urgency</td><td style="padding:8px 0;">${urgency}</td></tr>` : ''}
          ${preferredDate ? `<tr><td style="padding:8px 0;color:#5b6570;">Date</td><td style="padding:8px 0;">${preferredDate}</td></tr>` : ''}
          ${time ? `<tr><td style="padding:8px 0;color:#5b6570;">Time</td><td style="padding:8px 0;">${time}</td></tr>` : ''}
          ${location ? `<tr><td style="padding:8px 0;color:#5b6570;">Location</td><td style="padding:8px 0;">${location}</td></tr>` : ''}
          ${details ? `<tr><td style="padding:8px 0;color:#5b6570;vertical-align:top;">Details</td><td style="padding:8px 0;">${details.replace(/\n/g, '<br>')}</td></tr>` : ''}
        </table>
        <div style="margin-top:24px;">
          <a href="tel:${phone}" style="display:inline-block;background:#1d4e79;color:#fff;padding:12px 24px;border-radius:999px;text-decoration:none;font-weight:700;font-size:15px;">Call ${name}</a>
          ${email ? `<a href="mailto:${email}?subject=Re: Your Cleanfellas Booking Request" style="display:inline-block;margin-left:12px;background:#f7fafc;color:#1d4e79;padding:12px 24px;border-radius:999px;text-decoration:none;font-weight:700;font-size:15px;border:2px solid #1d4e79;">Reply by Email</a>` : ''}
        </div>
      </div>
      <div style="background:#e8f5fc;padding:14px 32px;border-radius:0 0 10px 10px;font-size:13px;color:#5b6570;border:1px solid #e0e8f0;border-top:none;">
        Cleanfellas CC &bull; 082 491 1234
      </div>
    </div>`;

  // ── Email 2: Auto-reply to customer ───────────────────────────────────────
  const replyHtml = email ? `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;color:#2b3138;">
      <div style="background:#0d2940;padding:24px 32px;border-radius:10px 10px 0 0;">
        <h2 style="color:#fff;margin:0;font-size:20px;">We've received your booking request</h2>
        <p style="color:#a9dcf5;margin:4px 0 0;font-size:14px;">Cleanfellas CC — Specialist Deep Cleaning</p>
      </div>
      <div style="background:#f7fafc;padding:28px 32px;border:1px solid #e0e8f0;border-top:none;">
        <p style="font-size:16px;line-height:1.6;">Hi ${name},</p>
        <p style="font-size:15px;line-height:1.7;color:#3a3f45;">Thank you for reaching out to Cleanfellas CC. We've received your request for a <strong>${service}</strong> and one of our team members will contact you shortly to confirm your appointment.</p>
        <div style="background:#e8f5fc;border-left:4px solid #1d4e79;padding:16px 20px;border-radius:0 8px 8px 0;margin:20px 0;">
          <p style="margin:0;font-size:14px;color:#1d4e79;font-weight:600;">Your request summary</p>
          <p style="margin:6px 0 0;font-size:14px;color:#3a3f45;">Service: ${service}${preferredDate ? '<br>Preferred date: ' + preferredDate : ''}${location ? '<br>Location: ' + location : ''}</p>
        </div>
        <p style="font-size:15px;line-height:1.7;color:#3a3f45;">If you need to reach us urgently, please call or WhatsApp <strong>Faye Khan</strong> directly on <a href="tel:0824911234" style="color:#1d4e79;font-weight:600;">082 491 1234</a>.</p>
        <p style="font-size:15px;color:#3a3f45;margin-top:24px;">Dare to be the best!<br><strong>The Cleanfellas Team</strong></p>
      </div>
      <div style="background:#e8f5fc;padding:14px 32px;border-radius:0 0 10px 10px;font-size:13px;color:#5b6570;border:1px solid #e0e8f0;border-top:none;">
        Cleanfellas CC &bull; 082 491 1234 &bull; cleanfellas@absamail.co.za
      </div>
    </div>` : null;

  // ── Send emails via Resend ────────────────────────────────────────────────
  const send = async (payload) => {
    const response = await fetch(RESEND_API, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok || data.error) {
      return { error: data.error || { message: `Email delivery failed (${response.status})` } };
    }
    return data;
  };

  const notifyPayload = {
    from: FROM_ADDRESS,
    reply_to: email || undefined,
    subject: `New Booking: ${service} — ${name}`,
    html: notifyHtml,
  };

  try {
    let notifyResult;
    try {
      notifyResult = await send({ ...notifyPayload, to: [NOTIFY_ADDRESS] });
    } catch (err) {
      console.error('Primary booking email failed:', err);
      notifyResult = { error: { message: err.message || 'Primary send failed' } };
    }

    if (notifyResult.error) {
      console.error('Primary booking email failed, trying fallback:', notifyResult.error);
      try {
        notifyResult = await send({ ...notifyPayload, to: [FALLBACK_ADDRESS] });
      } catch (err) {
        console.error('Fallback booking email failed:', err);
        notifyResult = { error: { message: err.message || 'Fallback send failed' } };
      }
      if (notifyResult.error) {
        console.error('Fallback booking email failed:', notifyResult.error);
        return { statusCode: 502, body: JSON.stringify({ error: 'Email delivery failed' }) };
      }
    }

    if (replyHtml && email) {
      const replyResult = await send({
        from: FROM_ADDRESS,
        to: [email],
        subject: `Booking Received — ${service} | Cleanfellas CC`,
        html: replyHtml,
      });
      if (replyResult.error) {
        console.error('Auto-reply failed:', replyResult.error);
      }
    }

    return { statusCode: 200, body: JSON.stringify({ ok: true }) };
  } catch (err) {
    console.error('Function error:', err);
    return { statusCode: 500, body: JSON.stringify({ error: 'Unexpected error' }) };
  }
};
