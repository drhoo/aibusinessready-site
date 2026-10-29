# AI Business Ready — V3 enquiry handler

Files: `index.html`, `sample-report.html`, `enquiry.html`, `api/enquiry.js`.
Upload these to the **root** of the `aibusinessready-site` GitHub repository. Keep `api/enquiry.js` inside a folder named `api`.

## Vercel settings (Project > Settings > Environment Variables)

- `RESEND_API_KEY` — already created and stored by the owner.
- `ENQUIRY_TO_EMAIL` — the existing inbox receiving enquiries (not public on the website).
- `ENQUIRY_FROM_EMAIL` — e.g. `AI Business Ready <hello@aibusinessready.co>` (the domain must be verified in Resend).

Set all three for Production, then **redeploy the latest commit** if the variables were added after the deployment.

## Testing

1. Visit `https://aibusinessready.co/enquiry.html`.
2. Enter **non-sensitive test answers** and submit.
3. Confirm success in browser, and confirm email arrives in the destination inbox (check Spam).
4. Reply to the test enquiry and confirm the response goes to the address entered in the form.
5. Verify the site still loads and the sample report link works.

The function returns HTTP 503 if configuration is incomplete. It doesn't collect payments or add users to marketing lists. It has a honeypot, input limits, and origin checks, **not robust spam protection or rate limiting**. Before broadly promoting the form, add infrastructure-level rate limits and a retention/privacy process. Never paste the Resend API key into GitHub or chat.
