# Codebase Concerns

**Analysis Date:** 2026-02-19

## Tech Debt

**Unlimited Firebase Queries:**
- Issue: 188 Firestore queries lack `.limit()`, causing unbounded read operations. Risk: Unnecessary costs on free tier, data bloat during load, slow page renders with large collections.
- Files:
  - `app/admin/annonces/page.tsx` - 3 queries without limits
  - `app/admin/blog/page.tsx` - 1 query
  - `app/admin/echos/page.tsx` - Multiple queries
  - `app/admin/missionnaires/page.tsx` - No limits in collections
  - `app/admin/photos/page.tsx` - Gallery queries
  - `app/admin/sites-amis/page.tsx` - Partner sites
  - `app/blog/page.tsx` - Blog listing
  - `hooks/use-contacts.ts` - Contact collection
  - `hooks/use-church-members.ts` - Members list
  - Additional admin pages without pagination
- Impact: Firebase bill could spike dramatically; pages with 1000+ items will load slowly; mobile performance degradation
- Fix approach: Add `.limit(pageSize)` to all collection queries; implement `usePaginatedCollection` hook throughout admin sections; add pagination UI to result sets

**Excessive Console.log Statements:**
- Issue: 356 `console.log` calls across 39 files in production code (lib, hooks, components, app). Debug logs leak implementation details and clutter browser console.
- Files:
  - `lib/image-utils.ts` - 8 logs in image processing
  - `lib/html-parser.ts` - 14 logs during parsing
  - `lib/upload-message-thumbnail.ts` - 6 logs during upload
  - `components/admin/AnnouncementImporter.tsx` - 13 logs
  - `components/infos-docs/ContactsSection.tsx` - Debug mount logs
  - `components/infos-docs/BirthdaysSection.tsx` - Debug mount logs
  - `middleware.ts` - 1 development-mode log
  - `app/admin/annonces/page.tsx` - Multiple logs
  - `app/page.tsx` - 13 logs
  - Plus 31 more files with debug logging
- Impact: Pollutes browser DevTools; potential information leakage; maintainability issue - hard to find actual errors
- Fix approach: Replace all `console.log` with conditional logging using environment variable flag; use dedicated logger (e.g., Sentry or Pino) for errors only; remove or comment out dev-only logs

**Large Unrefactored Components:**
- Issue: Multiple components exceed 500+ lines, mixing concerns and becoming hard to maintain.
- Files:
  - `app/admin/missionnaires/page.tsx` - 728 lines (CRUD + form + uploads all in one file)
  - `components/admin/MessageForm.tsx` - 608 lines (form with nested complex logic)
  - `app/admin/membres/page.tsx` - 532 lines (admin dashboard too monolithic)
  - `app/page.tsx` - 557 lines (homepage with too many nested sections)
  - `app/culte/programme/page.tsx` - 495 lines (single page handling multiple views)
  - `app/culte/calendrier/page.tsx` - 485 lines (calendar with inline logic)
- Impact: Difficult to test; high cognitive load; easy to introduce bugs during edits; slow render performance
- Fix approach: Break into smaller subcomponents; extract form logic into separate `FormContainer` components; extract reusable admin patterns into compound components

## Known Bugs

**Type Casting with `any`:**
- Issue: ~60+ uses of `any` type in codebase instead of proper TypeScript typing, bypassing type safety.
- Files:
  - `lib/airtable-client.ts` - Line 62: `any[]` for records
  - `lib/auth/actions.ts` - Lines 68, 94, 121: error handling with `error: any`
  - `lib/announcements-utils.ts` - Line 146: result object as `any`
  - `lib/date-helpers.ts` - Line 157: timestamp parameter as `any`
  - `components/infos-docs/ContactsSection.tsx` - Line 167: `contact: any`
  - `hooks/__tests__/use-storage.test.ts` - Multiple test declarations with `any[]`
  - `lib/firebase/storage.ts` - Line 110: metadata as `any`
  - `lib/firebase/firestore.ts` - Lines 101, 131: value and query results as `any`
  - `__mocks__/firebase/firestore.ts` - Multiple mock declarations
- Impact: Type errors go undetected until runtime; IDE cannot provide accurate autocomplete; refactoring becomes dangerous
- Trigger: Editing files with `any` types, adding new fields, or changing Firebase schema
- Workaround: Use satisfies operator for validation during transition
- Fix approach: Create proper TypeScript interfaces for all Firebase document types; replace all `any` with specific types; add type guards where appropriate

**Missing Error Boundaries for Admin Pages:**
- Issue: Admin CRUD pages (`app/admin/*`) lack error boundaries. Single component crash takes down entire admin section.
- Files:
  - `app/admin/annonces/page.tsx` - No error handling for failed uploads
  - `app/admin/membres/page.tsx` - No error boundary around list render
  - `app/admin/blog/page.tsx` - No try-catch for article form submission
  - `app/admin/echos/page.tsx` - Upload failures unhandled
  - `app/admin/photos/page.tsx` - Gallery operations without error boundary
- Impact: User can lose unsaved work; admin must refresh page to recover; poor UX for critical admin workflows
- Trigger: Network errors during upload, Firestore quota exceeded, Firebase auth token expiration
- Fix approach: Wrap admin page sections in error boundary; add form-level error handling; implement graceful degradation for failed operations

## Security Considerations

**Firestore Rules Have TEMPORARY Security Hole:**
- Risk: Line 131-135 in `firestore.rules` - `blogTags` collection has TEMPORARY open write access (allowed create/read without authentication check)
- Files: `firestore.rules` line 131-135
- Current mitigation: Marked as TEMPORARY with comment, but still deployed
- Recommendations:
  1. Immediately restrict `blogTags` to admin-only writes: `allow create, update, delete: if isAdmin();`
  2. Add audit logging to detect unauthorized writes to this collection
  3. Implement deployment checklist to catch TEMPORARY markers before production

**Admin Check Uses Synchronous Firestore Read:**
- Risk: `isAdmin()` function in Firestore rules calls `get()` for every operation, reading user document on each write. This is inefficient and could fail if user doc is deleted.
- Files: `firestore.rules` lines 6-9
- Current mitigation: None - relies on Firestore completing the read
- Recommendations:
  1. Cache user roles in JWT claims via custom claims during sign-in
  2. Update rules to check `request.auth.token.admin == true` instead of Firestore read
  3. Add server-side function to sync user admin status to custom claims

**Missing Data Validation on Public Collections:**
- Risk: Public collections like `announcements`, `messages`, `articles` can be read by anyone. If validation is weak on write, malicious data appears on site.
- Files: Firestore rules lines 106-129 (messages, articles, announcements)
- Current mitigation: Admin-only writes via rules, but no data validation in application
- Recommendations:
  1. Add Zod schema validation to all admin forms before Firestore write
  2. Implement field-level validation in Firestore rules: `request.resource.data.title.size() > 0`
  3. Add content moderation step before publishing (status: 'pending_review' → 'published')

**console.log Can Leak Sensitive Data:**
- Risk: Admin forms and upload functions have console.log statements that could expose file paths, user IDs, or config details.
- Files: `components/admin/AnnouncementImporter.tsx`, `app/admin/annonces/page.tsx`, `app/admin/photos/page.tsx`
- Current mitigation: None - logs are visible to user if DevTools open
- Recommendations:
  1. Remove all `console.log` from production code
  2. Use structured logging service (Sentry) for errors only
  3. Sanitize any user input before logging

## Performance Bottlenecks

**Image Processing Without Optimization:**
- Problem: Images uploaded via admin (photos, messages, hero) are not automatically resized/compressed before storage. Full-resolution images served to mobile users.
- Files: `lib/image-utils.ts`, `lib/upload-message-thumbnail.ts`, `components/admin/PhotoUploader.tsx`
- Cause: Image processing utilities exist but not integrated into upload flow. Manual optimization required.
- Improvement path:
  1. Integrate `generateImageVersions()` into all upload flows
  2. Store thumbnail + medium + original versions
  3. Serve appropriate version based on device width (Next.js Image component)
  4. Add WebP generation for modern browsers

**Admin Page Collection Loads All Documents:**
- Problem: Admin pages like `app/admin/photos/page.tsx` call `getDocs()` without limit. Loading 1000+ photos crashes browser.
- Files: All admin CRUD pages
- Cause: Convenience - easier to load all, filter client-side. But doesn't scale.
- Improvement path:
  1. Add `.limit(50)` to initial query
  2. Implement "Load More" button or infinite scroll
  3. Move filtering to Firestore query (use .where() instead of filter array client-side)
  4. Add search by building Algolia index or Firestore text search

**Large Test Files Not Integrated Into Build:**
- Problem: 5 test files (389-571 lines each) in `hooks/__tests__/` cover only hook layer. No tests for components, pages, or integration flows.
- Files: All files in `hooks/__tests__/`
- Cause: Tests were added for hooks but not extended to cover critical paths
- Improvement path:
  1. Add integration tests for admin CRUD workflows
  2. Add component snapshot tests for UI consistency
  3. Integrate tests into CI/CD pipeline
  4. Set coverage target of 60%+ for critical paths

## Fragile Areas

**Admin Membres Page (Bidirectional Sync):**
- Files: `app/admin/membres/page.tsx` (532 lines)
- Why fragile: Synchronizes two data sources (carnet-adresses ↔ membres) with custom sync logic. Recent commits show active changes to sync logic. Risk of data duplication or lost updates.
- Safe modification:
  1. Add data integrity checks before sync (hash comparison)
  2. Implement "dry run" mode to preview changes
  3. Add audit log tracking all sync operations
  4. Write integration test for sync scenarios
- Test coverage: None - critical sync logic untested

**HTML Parser for Announcements:**
- Files: `lib/html-parser.ts`, `app/admin/annonces/page.tsx`
- Why fragile: Complex regex-based parsing extracts announcements from HTML. Any change to input HTML format breaks parsing. 14 `console.log` statements indicate recent debugging.
- Safe modification:
  1. Add unit tests for each regex pattern with sample inputs
  2. Implement validation schema post-parse
  3. Create parsing error report UI to show unparsed items
  4. Document expected HTML format with examples
- Test coverage: None

**Firebase Authentication Flow:**
- Files: `lib/auth/actions.ts`, `hooks/use-firebase-auth.ts`, `middleware.ts`
- Why fragile: Custom auth middleware checks tokens, custom claims, session expiration. Multiple manual error handling with `error: any` casts. Recent updates to member sync suggest changes to user model.
- Safe modification:
  1. Add integration tests for sign-in, sign-up, password reset flows
  2. Add test for session expiration and re-auth
  3. Type all error cases instead of using `any`
  4. Add logging for auth failures (non-console)
- Test coverage: `hooks/__tests__/use-firebase-auth.test.ts` exists but incomplete

**Message/Sermon Upload with Thumbnail:**
- Files: `lib/upload-message-thumbnail.ts`, `components/admin/MessageForm.tsx`
- Why fragile: Custom thumbnail generation, upload to specific path, metadata management. 6+ `console.log` calls indicate recent debugging. No error recovery for partial uploads.
- Safe modification:
  1. Add transaction-like behavior (all-or-nothing upload)
  2. Implement retry logic for failed uploads
  3. Add server-side validation that video/audio files exist before marking complete
  4. Test with various file types and sizes
- Test coverage: None for upload flows

## Scaling Limits

**Firebase Firestore Free Tier Constraints:**
- Current capacity: 1 GB storage, 50K reads/day, 20K writes/day, 20K deletes/day
- Limit: With 14 unlimited queries and 356 console.logs still in production, each page load can trigger 2-5 reads. Site at ~500 daily users could hit limits.
- Scaling path:
  1. Add `.limit()` to all queries immediately
  2. Monitor read/write operations via Firebase Analytics
  3. Consider Blaze plan ($0.06/100K reads) once daily active users exceed 100
  4. Implement client-side caching with React Query to reduce reads

**Next.js Static Export Missing:**
- Current capacity: Site built as full SSR/dynamic rendering
- Limit: Each request requires server compute, limits concurrent users on free hosting (Vercel free tier: limited to 10 instances)
- Scaling path:
  1. Generate static pages for blog articles, events (using `generateStaticParams`)
  2. Use Incremental Static Regeneration (ISR) for content changes (revalidate every 1 hour)
  3. Cache admin pages separately (no static export for auth-required pages)
  4. Reduces server load by 60% for read-heavy content

**Image Storage Growth:**
- Current capacity: Firebase Storage free tier includes 1 GB
- Limit: With gallery, hero images, and message thumbnails, reaching limit in 6-12 months at current upload rate
- Scaling path:
  1. Implement image expiration policy (auto-delete old images after 1 year)
  2. Use image CDN (Cloudinary, Imgix) instead of storing originals
  3. Cleanup duplicate/test images from admin uploads
  4. Monitor storage usage via Firebase Console

## Dependencies at Risk

**Firebase SDK Versions:**
- Risk: `firebase@10.13.0` and `firebase-admin@13.2.0` - relatively recent but check for security updates
- Impact: Breaking changes in major version bumps; security patches may require code changes
- Migration plan:
  1. Monitor Firebase changelog for security advisories
  2. Test update in dev branch before production deployment
  3. Implement semantic versioning lock (^10.13.0 allows patches, not minor versions)

**Anthropic/OpenAI SDK Versions:**
- Risk: `@ai-sdk/anthropic@0.0.48` and `@ai-sdk/openai@0.0.54` - pre-1.0 versions indicate unstable API
- Impact: Updates could break AI features; API changes without notice in minor versions
- Migration plan:
  1. Pin exact versions in package.json instead of `^`
  2. Test AI features after any SDK update
  3. Monitor SDK docs for deprecated features
  4. Consider waiting for 1.0 stable release before major updates

**Marked (Markdown Parser):**
- Risk: `marked@17.0.0` - used for blog content, potential XSS vectors if not properly sanitized
- Impact: Malicious markdown in blog posts could execute scripts
- Migration plan:
  1. Verify `dompurify@3.3.0` is used after marked parsing
  2. Add CSP headers to prevent inline script execution
  3. Add markdown validation to admin forms (no raw HTML allowed)
  4. Consider moving to safer alternative like `remark` + `rehype`

## Missing Critical Features

**Automated Testing Infrastructure:**
- Problem: 5 test files for hooks only; no tests for 100+ pages, 170+ components, API routes, or integration flows
- Blocks: Cannot safely refactor; no regression detection; unreliable deploys
- Approach:
  1. Set up GitHub Actions CI to run Jest on every PR
  2. Add minimum coverage gates (fail if coverage drops below 50%)
  3. Write tests for critical paths (auth, admin CRUD, public content)
  4. Implement E2E tests with Playwright for user workflows

**Error Monitoring in Production:**
- Problem: No Sentry/error tracking configured despite `tasks.md` line 162 mentioning it as "completed"
- Blocks: Errors in production go unnoticed; admin cannot proactively fix issues
- Approach:
  1. Install `@sentry/nextjs`
  2. Configure error capture for API routes and client-side
  3. Set up alerts for critical errors
  4. Implement error logging dashboard in admin

**Database Pagination UI:**
- Problem: Admin pages load all records; no pagination visible to users managing large datasets
- Blocks: Poor UX when 500+ items; browser slowdown
- Approach:
  1. Implement pagination controls (prev/next, page numbers)
  2. Add page size selector (10, 25, 50 items)
  3. Show "X of Y" total count
  4. Implement infinite scroll as alternative on mobile

## Test Coverage Gaps

**Admin CRUD Operations (Untested):**
- What's not tested: Add, edit, delete operations for announcements, blogs, photos, messages, missionaries, birthdays, contacts
- Files: All files in `app/admin/` except routes themselves
- Risk: User loses work on form submit; data corruption; silent failures
- Priority: HIGH - these are critical workflows

**Authentication Flows (Partially Tested):**
- What's not tested: Sign-up, sign-in, password reset, session expiration, token refresh, admin role verification
- Files: `lib/auth/actions.ts`, `hooks/use-firebase-auth.ts`, `middleware.ts`
- Risk: Auth bypass, session hijacking, invalid state after token expiration
- Priority: HIGH - security critical

**Image/File Upload Flows (Not Tested):**
- What's not tested: Image compression, version generation, upload progress, error handling, cleanup on failure
- Files: `lib/image-utils.ts`, `lib/upload-message-thumbnail.ts`, components using them
- Risk: Corrupted images served; storage quota exceeded; failed uploads not cleaned up
- Priority: MEDIUM - affects user-uploaded content

**Responsive Design (Manual Only):**
- What's not tested: Mobile layout at various breakpoints (320px, 375px, 768px, 1024px)
- Files: Almost all components, pages
- Risk: Layout breaks on specific devices; accessibility issues missed
- Priority: MEDIUM - UX-critical but can be verified manually

**Theme/Dark Mode Toggle (Not Tested):**
- What's not tested: Theme switching, persistence, CSS variable application, dark mode styling
- Files: `components/theme-provider.tsx`, related theme logic
- Risk: Users lose theme preference; dark mode doesn't apply correctly
- Priority: LOW - can be tested manually, but critical for accessibility

---

*Concerns audit: 2026-02-19*
