<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of your project. PostHog was already substantially set up (SDK initialized in `instrumentation-client.ts`, server client in `lib/posthog-server.ts`, reverse-proxy rewrites in `next.config.ts`, and 12 existing `posthog.capture()` calls). This run supplemented the existing coverage with 5 new events spanning the group collaboration and tour lifecycle flows. User identification (via `posthog.identify()`) was already in place on login and magic-link verification. Environment variables were confirmed up to date.

| Event | Description | File |
|---|---|---|
| `user_signed_up` | User completes password sign-up | `app/(marketing)/signup/page.tsx` |
| `magic_link_requested` | User requests a magic-link email | `app/(marketing)/signup/page.tsx`, `app/(marketing)/login/page.tsx` |
| `user_logged_in` | User logs in with password | `app/(marketing)/login/page.tsx` |
| `magic_link_verified` | Magic-link token verified, user signed in | `app/(marketing)/auth/callback/page.tsx` |
| `search_submitted` | User submits an AI-powered listing search | `app/(app)/search/AppSearchClient.tsx` |
| `property_saved` | User saves/unsaves a property to favorites | `app/(marketing)/properties/[propertyKey]/PropertyDetailsClient.tsx` |
| `property_shared` | User shares a listing URL | `app/(marketing)/properties/[propertyKey]/PropertyDetailsClient.tsx` |
| `property_note_saved` | User saves a note on a property | `app/(marketing)/properties/[propertyKey]/PropertyDetailsClient.tsx` |
| `tour_requested` | User submits an email-based tour request | `app/(marketing)/properties/[propertyKey]/PropertyDetailsClient.tsx` |
| `review_submitted` | User submits a building/landlord review | `components/reviews/ReviewForm.tsx` |
| `group_invite_sent` | Group owner sends an email invite | `app/(app)/groups/[groupId]/page.tsx` |
| `group_share_link_created` | Group owner copies a shareable join link | `app/(app)/groups/[groupId]/page.tsx` |
| `group_created` | ✨ NEW — User creates a new group | `app/(app)/groups/page.tsx` |
| `group_invite_accepted` | ✨ NEW — User accepts a group invite and joins | `app/invites/accept/page.tsx` |
| `tour_scheduled` | ✨ NEW — User schedules (or reschedules) a tour | `components/tours/ScheduleTourSheet.tsx` |
| `tour_logged` | ✨ NEW — User logs a past tour via LogTourModal | `components/tours/LogTourModal.tsx` |
| `tour_completed` | ✨ NEW — User marks an upcoming tour as completed | `app/(app)/tours/page.tsx` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- **Dashboard — Analytics basics**: https://us.posthog.com/project/400549/dashboard/1519423
- **Sign-up & Login Funnel**: https://us.posthog.com/project/400549/insights/J4qeJ1DJ
- **Search → Tour Conversion Funnel**: https://us.posthog.com/project/400549/insights/Etlvw4mn
- **Property Engagement Trends**: https://us.posthog.com/project/400549/insights/nqlT1B3B
- **Group Collaboration Funnel**: https://us.posthog.com/project/400549/insights/hq8unQCC
- **Review Submissions Over Time**: https://us.posthog.com/project/400549/insights/nB3dgnzT

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
