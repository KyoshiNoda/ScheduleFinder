# P1.11 outbound integration and image upload contract

**Decision (2026-10-30):** Runtime SendGrid and Cloudinary calls are disabled by default. Set `NODE_ENV=production` and `OUTBOUND_MODE=live`, with all four provider credentials, to enable them. Server startup validates live credentials. Local and test runs cannot send provider requests even if `OUTBOUND_MODE=live`; tests use module fakes. No production data or provider was used for verification.

Profile uploads accept one `photoURL` multipart file up to 5 MiB. The server compares the declared MIME type with JPEG, PNG, or WebP signature bytes. Missing file returns 400, unsupported or mismatched content 415, oversized file 413, disabled provider 503, and upload failure 502. Successful responses keep `{ message, imageUrl }`.

A replacement is uploaded before the user's URL changes. The new Cloudinary `public_id` is stored in a private user field. After the database update succeeds, the prior managed image is deleted on a best-effort basis. If the database update fails or loses a concurrent update, the new upload is deleted on a best-effort basis. Legacy URLs have no stored public ID and are not deleted automatically. Cleanup failure can leave an orphaned asset but does not erase the saved image; an operator must reconcile it. Deleting a profile image resets the database URL first, then deletes a recorded managed asset best-effort.

When outbound calls are disabled, password-reset requests retain the generic 202 response and create no unusable challenge. Friend-request mutations commit without sending email. In live mode, password-reset delivery failure removes the matching challenge; friend-request notification failure leaves the committed mutation successful.

Verify from `backend/` with `npm test` and `npm run build`, and from `client/` with `npm test -- --run` and `npm run build`. These commands use local fixtures and mocked providers. Rate limits and broader error envelopes remain P1.12 work.
