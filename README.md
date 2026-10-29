# AI Business Ready — V2 enquiry draft

Static pages: `index.html`, `sample-report.html`, `enquiry.html`. Vercel serverless function: `api/enquiry.js`.

**Current safety state:** The enquiry form will return HTTP 503 (`Enquiries are not open yet`) until all three Vercel environment variables are configured. No payments are collected.

## Before enabling
1. Create/choose an actual mailbox to RECEIVE enquiries. Resend is for sending messages; it does not automatically provide an inbox.
2. Verify `aibusinessready.co` as a sending domain in Resend and add the provider's exact DNS records. Do not overwrite the existing Vercel A and CNAME records or any MX records.
3. In Vercel Project → Settings → Environment Variables, set: `RESEND_API_KEY`, `ENQUIRY_TO_EMAIL` (real mailbox you control), and `ENQUIRY_FROM_EMAIL` (e.g. a sender on the verified domain). Redeploy to apply.
4. Test delivery with a non-sensitive enquiry, including that reply-to works. Check desktop and mobile.
5. **Before making this public at scale**, add robust bot/rate controls (the honeypot is only light friction), a final privacy notice including retention/contact details, and a deletion/retention procedure for mailbox records. Confirm the assessment service process before taking payments.

Do not place API secrets in HTML, GitHub or source files. Configure them only through Vercel environment variables.

The custom domain was not externally retrievable in our verification on 29 Oct 2026; the Vercel preview was.
