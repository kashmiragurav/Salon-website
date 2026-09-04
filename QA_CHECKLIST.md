# Salon Website QA Checklist

Date: 2026-09-04
Scope: frontend, admin-panel, Firestore rules, and Storage rules.

Legend: PASS = verified by code review or executable check; MANUAL = requires configured Firebase data/browser; N/A = no automated test harness is present.

## Authentication

- [x] PASS: Valid login checks Firebase credentials, admin record, role, and active status.
- [x] PASS: Invalid login is surfaced by the login error state.
- [ ] MANUAL: Logout redirects to `/login` and clears the Firebase session.
- [x] PASS: Protected routes are wrapped by `ProtectedRoute`.
- [ ] MANUAL: Direct protected URL access while signed out redirects to login.
- [x] PASS: Inactive admins are signed out and rejected.
- [x] PASS: Unauthorized users without an admin record are signed out and rejected.

## Admin Dashboard

- [x] PASS: Statistics and recent booking subscriptions are wired to Firestore.
- [x] FIXED: Recent bookings now display `serviceSelected`, `preferredDate`, and `preferredTime`.
- [x] PASS: Loading, empty, and error states are implemented.

## Services

- [x] PASS: Create, edit, delete, active/inactive, search, category filter, and validation paths exist.
- [x] FIXED: Optional image URLs are validated before save.
- [ ] MANUAL: Verify each CRUD action against deployed Firestore rules.

## Gallery

- [x] PASS: Admin upload, display, category filter, and delete paths exist.
- [x] PASS: Client and Storage rules enforce image type and 10 MB maximum.
- [ ] MANUAL: Verify upload/delete with deployed Storage rules.

## Testimonials

- [x] PASS: Create, edit, delete, approve, reject, and rating validation paths exist.
- [x] FIXED: Public testimonial ordering now handles Firestore timestamps numerically.
- [ ] MANUAL: Verify approved-only public visibility.

## Appointments

- [x] PASS: List, search, date/status filters, confirm, cancel, and invalid status guards exist.
- [x] PASS: Public booking writes force `Pending` and verify the selected service is active.
- [ ] MANUAL: Verify admin status transitions against deployed rules.

## Enquiries

- [x] PASS: List, search/filter, and status-change paths exist.
- [x] PASS: Public enquiry writes force `NEW` and do not expose status controls.
- [ ] MANUAL: Verify status updates against deployed rules.

## Settings

- [x] PASS: Load, edit, save, and persistence paths exist.
- [ ] MANUAL: Verify values persist after reload with deployed Firestore.

## Public Website

- [x] PASS: Routes exist for home, about, services, gallery, pricing, contact, and booking.
- [x] PASS: Shared responsive navigation, CTA buttons, cards, loading, error, and empty states exist.
- [x] PASS: Services are active-only; pricing uses service prices; gallery is newest-first; testimonials are approved-only.
- [x] PASS: Settings drive hero, contact, map, and stats fields.
- [x] FIXED: Booking service-load failures are now visible.
- [ ] MANUAL: Browser-check every page, responsive navigation, map, and form submission.

## Security

- [x] PASS: Firestore rules deny-by-default and restrict admin collections.
- [x] PASS: Public users cannot read/write admin records, bookings, enquiries, or audit logs.
- [x] PASS: Public booking status must be `Pending`; enquiry status must be `NEW`.
- [x] PASS: Booking service IDs must reference active services.
- [x] PASS: Audit logs are admin-create/admin-read and update/delete denied.
- [x] PASS: Storage writes require an active admin and image type/size limits.
- [ ] MANUAL: Run Firebase Emulator security tests after installing Firebase CLI.

## Responsiveness

- [x] PASS: CSS includes desktop, tablet-compatible fluid layout, and mobile breakpoint behavior.
- [ ] MANUAL: Verify desktop, tablet, and mobile screenshots in a real browser.

## Error Handling

- [x] PASS: Admin/public collection loaders expose loading, empty, and error states.
- [x] FIXED: Public booking service-load errors are displayed.
- [x] FIXED: Public form lengths are checked before Firestore writes.
- [ ] MANUAL: Simulate Firestore outage and slow network in browser DevTools.

## Bugs Found

1. Dashboard recent bookings used obsolete field names, producing blank service/date/time cells.
2. Public booking service-load failures were hidden.
3. Public form validation did not match Firestore size limits.
4. Public testimonial sorting compared timestamp objects as strings.
5. Service image URL validation was missing in the admin form.
6. Public pricing used GBP while admin pricing used USD.
7. Firebase rules and Storage rules were not present in the repository.

## Bugs Fixed

All seven listed defects were fixed. Firebase rules and deployment configuration were added as part of the security baseline.

## Remaining Issues

- No automated browser/E2E test harness is configured.
- Firebase Emulator/CLI is unavailable in this environment, so deployed rule behavior remains a manual verification item.
- Anonymous forms need production abuse protection such as App Check, rate limiting, CAPTCHA, or a trusted backend.
- Audit logs are client-created and append-only by rules, not truly server-trusted immutable audit records.
- Dashboard aggregate reads are currently unbounded and may need pagination/aggregation as data grows.
- Legacy documents missing timestamp fields may be omitted by ordered Firestore queries.
- About and Contact still render partial fallback content instead of a dedicated settings-load error state.
- The backend directory is not an implemented/runnable application despite the README technology description.

## Recommended Manual Test Cases

1. Sign in with valid, invalid, inactive, and non-admin accounts; test logout and direct protected URLs.
2. Create, edit, deactivate, reactivate, search, filter, and delete a service; verify invalid image URL and price validation.
3. Upload valid, oversized, and non-image gallery files; filter and delete an image.
4. Create a testimonial with invalid and valid ratings; edit, approve, reject, and delete it; check public visibility.
5. Submit a valid booking, missing-field booking, invalid phone/date booking, inactive-service tampering attempt, and simulate Firestore failure.
6. Confirm and cancel appointments; test invalid status requests and verify audit entries.
7. Submit valid and invalid enquiries, including oversized fields; change status as admin.
8. Edit settings, reload both applications, and verify hero, contact, map, and stats persistence.
9. As an anonymous user, attempt reads/writes to adminUsers, bookings, enquiries, auditLogs, inactive services, and unapproved testimonials.
10. Run all routes at desktop, tablet, and mobile widths with slow network and offline Firestore simulation.
