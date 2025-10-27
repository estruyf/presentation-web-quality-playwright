# EngageTime - Comprehensive Test Plan

## Application Overview

**EngageTime** is a real-time audience engagement platform that enables speakers to interact with their audience through live sessions. The application supports two primary user roles:

- **Attendees**: Join sessions, ask questions, respond to polls, provide feedback, and engage with content
- **Speakers**: Create and manage sessions, interact with audiences, view analytics, and control session features

### Technology Stack

- **Frontend**: Astro + React + TypeScript
- **Backend**: Azure Functions (TypeScript)
- **Database**: Supabase (PostgreSQL)
- **Real-time**: WebSocket connections via Azure Web PubSub
- **Authentication**: Supabase Auth (for speakers)

### Key Features

1. **Session Management**: Create, configure, and control live sessions
2. **Q&A System**: Real-time question submission, upvoting, and answering
3. **Interactive Polls**: 5 poll types (Multiple Choice, Rating Scale, Yes/No, Open Text, Word Cloud)
4. **Feedback Collection**: Post-session ratings and comments
5. **Resource Sharing**: Distribute session materials and links
6. **Connections**: Enable attendee-speaker networking
7. **Quick Reactions**: Real-time emoji reactions
8. **Analytics**: Session engagement metrics and insights
9. **Events/Conferences**: Multi-session event management
10. **Co-speaker Collaboration**: Invite and manage multiple speakers per session

---

## Test Environments

| Environment | URL                          | Purpose                |
| ----------- | ---------------------------- | ---------------------- |
| Beta        | https://beta.engagetime.live | Testing and validation |
| Production  | https://engagetime.live      | Live environment       |

---

## API Endpoints Reference

### Session Management

- `GET /sessions/:id` - Get session details
- `POST /sessions` - Create new session
- `PUT /sessions/:id` - Update session
- `POST /sessions/:id/archive` - Archive session
- `POST /sessions/:id/verify-passcode` - Verify session passcode

### Attendee Management

- `POST /sessions/:id/attendees` - Register attendee
- `GET /sessions/:id/schedule` - Get session schedule

### Q&A System

- `GET /sessions/:id/questions` - Get all questions
- `POST /sessions/:id/questions` - Submit question
- `POST /questions/:id/upvote` - Upvote question
- `PATCH /questions/:id/answer` - Answer question (speaker)
- `DELETE /questions/:id` - Delete question (speaker)

### Polls

- `GET /sessions/:id/polls` - Get all polls
- `POST /sessions/:id/polls` - Create poll (speaker)
- `PATCH /polls/:id` - Update poll (speaker)
- `PATCH /polls/:id/toggle` - Activate/deactivate poll (speaker)
- `DELETE /polls/:id` - Delete poll (speaker)
- `POST /polls/:id/reset` - Reset poll responses (speaker)
- `POST /polls/:id/responses` - Submit poll response (attendee)

### Feedback

- `GET /sessions/:id/feedback` - Get feedback (speaker)
- `POST /sessions/:id/feedback` - Submit feedback (attendee)
- `GET /sessions/:id/feedback/status/:deviceId` - Check if feedback submitted
- `DELETE /sessions/:id/feedback/:id` - Delete feedback (speaker)

### Connections

- `POST /sessions/:id/connections` - Request connection (attendee)
- `GET /sessions/:id/connections` - Get connection requests (speaker)

### Reactions

- `POST /sessions/:id/reactions` - Send reaction (attendee)
- `POST /sessions/:id/reactions/clear` - Clear reactions (speaker)

### Analytics

- `GET /sessions/:id/analytics` - Get session analytics (speaker)

### Speaker Dashboard

- `GET /speaker/sessions` - Get all speaker sessions

### Events/Conferences

- `GET /events/:id` - Get event details
- `GET /events/:id/sessions` - Get event sessions
- `POST /events/:id/sessions` - Create session for event

### WebSocket Events

- `question` - New question submitted
- `deleteQuestion` - Question deleted
- `poll` - Poll created/updated
- `pollResponse` - New poll response
- `reaction` - Reaction sent

---

## 1. Attendee Experience - Test Scenarios

### 1.1 Session Discovery and Join

#### 1.1.1 Join Session via Session ID (Happy Path)

**Prerequisites**: Valid active session exists

**Steps**:

1. Navigate to homepage
2. Click "Join a session" link in banner
3. Enter valid session ID (e.g., "lmvp00")
4. Click "Join Session" button
5. Wait for session validation
6. Verify redirect to `/session/:id`

**Expected Results**:

- Session ID input field is visible and functional
- Join button enables after session ID is entered
- Successful redirect to session page
- No error messages

**API Mocks Needed**:

- `GET /sessions/:id` → Returns session object with `enableQA`, `enablePoll`, etc.

---

#### 1.1.2 Join Session - Invalid Session ID

**Steps**:

1. Navigate to join page
2. Enter invalid session ID (e.g., "INVALID")
3. Click "Join Session"

**Expected Results**:

- Error message: "Session not found. Please check the session ID and try again."
- User remains on join page
- Can retry with different session ID

**API Mocks Needed**:

- `GET /sessions/INVALID` → Returns 404

---

#### 1.1.3 Join Session - Network Error

**Steps**:

1. Navigate to join page
2. Enter session ID
3. Simulate network error
4. Click "Join Session"

**Expected Results**:

- Error message: "Connection error. Please check your internet connection and try again."
- Loading spinner displayed during request
- User can retry

---

#### 1.1.4 Join Session via QR Code

**Manual Test** (QR code scanning cannot be easily automated)

**Steps**:

1. Display QR code containing session URL
2. Scan QR code with mobile device camera
3. Follow link to session

**Expected Results**:

- Direct navigation to session page or join flow
- Same experience as manual session ID entry

---

### 1.2 Attendee Registration

#### 1.2.1 Enter Attendee Name (First Time)

**Prerequisites**: Joined a session

**Steps**:

1. Verify NameForm is displayed
2. Observe session title and description
3. Enter name in "Your Name" field
4. Click "Join Session" button

**Expected Results**:

- NameForm displays session title prominently
- Name input field has placeholder "Enter your name..."
- Submit button is a gradient button with text "Join Session"
- Name is stored in localStorage as `attendee-name-{sessionId}`
- Attendee is registered via POST `/sessions/:id/attendees`
- User proceeds to session content

**API Mocks Needed**:

- `POST /sessions/:id/attendees` → Returns `{ attendeeId, sessionId, joinedAt }`

---

#### 1.2.2 Return Visit - Name Persisted

**Prerequisites**: Previously joined session

**Steps**:

1. Join same session again
2. Verify name form is skipped

**Expected Results**:

- Name is retrieved from localStorage
- User directly enters session content
- POST `/sessions/:id/attendees` still called with stored name

---

#### 1.2.3 Enter Name - Empty Validation

**Steps**:

1. Leave name field empty
2. Attempt to submit

**Expected Results**:

- Button disabled or HTML5 validation prevents submission
- Required field indicator visible

---

#### 1.2.4 Conference-Level Name Persistence

**Prerequisites**: Session belongs to an event/conference

**Steps**:

1. Join first session in conference and enter name
2. Join second session in same conference

**Expected Results**:

- Name from first session is reused for second session
- Stored as `conference-attendee-{eventId}` in localStorage

---

### 1.3 Passcode Protection

#### 1.3.1 Join Passcode-Protected Session

**Prerequisites**: Session has `hasPassCode: true`

**Steps**:

1. Join session
2. Enter name
3. Observe PasscodeForm
4. Enter correct passcode
5. Click submit

**Expected Results**:

- PasscodeForm displays after name form
- POST `/sessions/:id/verify-passcode` validates passcode
- On success (`isValid: true`), user enters session content
- On failure, error message displayed: "Invalid passcode"

**API Mocks Needed**:

- `POST /sessions/:id/verify-passcode` → Returns `{ isValid: true/false }`

---

#### 1.3.2 Incorrect Passcode

**Steps**:

1. Enter incorrect passcode
2. Submit

**Expected Results**:

- Error message: "Invalid passcode"
- User can retry
- Passcode field remains visible

---

### 1.4 Session Content - Navigation

#### 1.4.1 View Session Resources Tab

**Prerequisites**: Logged into session

**Steps**:

1. Observe default tab is "Resources" (`#resources` hash)
2. Verify available resources are listed

**Expected Results**:

- Resources tab is active by default
- Session title, description, and speakers displayed in header
- Resources list shows links, documents, or placeholder if empty
- Tab navigation works (Desktop tabs, Mobile bottom bar)

---

#### 1.4.2 Navigate Between Tabs (Desktop)

**Steps**:

1. Click "Q&A" tab
2. Observe URL hash changes to `#qa`
3. Click "Polls" tab
4. Click "Feedback" tab
5. Click "Connect" tab

**Expected Results**:

- Each tab click updates URL hash
- Corresponding tab content loads
- Active tab is visually highlighted
- Tab badges show counts (unanswered questions, active polls)

---

#### 1.4.3 Navigate Between Tabs (Mobile)

**Steps**:

1. Use mobile viewport
2. Use bottom tab bar to switch tabs

**Expected Results**:

- Mobile tab bar is visible and fixed at bottom
- Tab switching works same as desktop
- Tab labels and counts are visible

---

#### 1.4.4 Disabled Tabs

**Prerequisites**: Session has `enableQA: false` or `enablePoll: false`

**Steps**:

1. Observe tabs in UI
2. Attempt to click disabled tab

**Expected Results**:

- Disabled tabs are visually distinct (grayed out or marked)
- Clicking disabled tab has no effect or shows message

---

#### 1.4.5 Deep Linking via Hash

**Steps**:

1. Navigate directly to `https://beta.engagetime.live/session/:id#qa`

**Expected Results**:

- Q&A tab is active on load
- Content loads correctly
- Hash is preserved in URL

---

### 1.5 Q&A - Attendee Actions

#### 1.5.1 Submit Question (Happy Path)

**Prerequisites**: Session has `enableQA: true` and `state: 'active'`

**Steps**:

1. Navigate to Q&A tab
2. Observe "Ask a Question" section
3. Type question in textarea: "What would you like to ask?"
4. Click "Submit Question" button
5. Wait for response

**Expected Results**:

- Textarea is visible and functional
- Submit button enables when text is entered
- POST `/sessions/:id/questions` sends `{ question, attendeeName, deviceId }`
- Question appears in the questions list below
- Question shows attendee name, timestamp, 0 upvotes
- "Your Question" badge visible on submitted question
- Textarea clears after submission

**API Mocks Needed**:

- `GET /sessions/:id/questions` → Returns `[]` or array of questions
- `POST /sessions/:id/questions` → Returns created question object

---

#### 1.5.2 Submit Button Disabled for Empty Question

**Steps**:

1. Navigate to Q&A tab
2. Leave textarea empty
3. Observe submit button

**Expected Results**:

- Submit button is disabled
- Button has `disabled:opacity-50` styling

---

#### 1.5.3 Submit Button Enables/Disables on Text Change

**Steps**:

1. Type text in textarea
2. Observe button enables
3. Clear textarea
4. Observe button disables again

**Expected Results**:

- Button state updates reactively based on textarea content

---

#### 1.5.4 Upvote Question

**Prerequisites**: Other questions exist in the list

**Steps**:

1. View questions list
2. Click upvote button on a question (not your own)
3. Observe upvote count increment

**Expected Results**:

- Upvote button shows current vote count
- After click, POST `/questions/:id/upvote` is called
- Vote count increments by 1
- Button becomes disabled (already upvoted)
- Button style changes to indicate upvoted state (primary color)

**API Mocks Needed**:

- `POST /questions/:id/upvote` → Success (no body needed, or returns updated question)
- `GET /sessions/:id/questions` → Returns updated question list

---

#### 1.5.5 Cannot Upvote Own Question

**Steps**:

1. Submit a question
2. Attempt to upvote your own question

**Expected Results**:

- Upvote button on your question is disabled
- Tooltip or title: "You cannot upvote your own question"
- Button styling indicates disabled state

---

#### 1.5.6 Cannot Upvote Same Question Twice

**Prerequisites**: Already upvoted a question

**Steps**:

1. Try to click upvote button again

**Expected Results**:

- Button remains disabled
- No additional upvote counted

---

#### 1.5.7 View Answered Questions

**Prerequisites**: Speaker has answered questions

**Steps**:

1. View Q&A list
2. Observe answered questions have green badge and answer text

**Expected Results**:

- Answered questions display "Speaker Response:" header
- Answer text is shown in green background box
- CheckCircle icon displayed

---

#### 1.5.8 View Acknowledged Questions (No Answer Text)

**Prerequisites**: Speaker marked question as answered without text

**Steps**:

1. View question marked `isAnswered: true` but `answer: ""`

**Expected Results**:

- Blue badge: "This question has been acknowledged by the speaker"
- No answer text shown

---

#### 1.5.9 Filter Questions

**Steps**:

1. Click filter dropdown
2. Select "All", "Answered", or "Unanswered"

**Expected Results**:

- Questions list updates to show only selected category
- Empty state shown if no questions match filter

---

#### 1.5.10 Sort Questions

**Steps**:

1. Click sort dropdown
2. Select "Engagement" (upvotes) or "Newest"

**Expected Results**:

- Questions re-sort accordingly
- Engagement sort: highest upvotes first, then by time
- Newest sort: most recent first

---

#### 1.5.11 Real-time Question Updates (WebSocket)

**Prerequisites**: WebSocket connection active

**Steps**:

1. Keep Q&A tab open
2. Simulate WebSocket `question` event

**Expected Results**:

- New question appears in list without page refresh
- Question count badge updates

---

#### 1.5.12 Real-time Question Deletion (WebSocket)

**Steps**:

1. Keep Q&A tab open
2. Simulate WebSocket `deleteQuestion` event

**Expected Results**:

- Deleted question removed from list
- Count updates

---

#### 1.5.13 Q&A Disabled in Archived Session

**Prerequisites**: Session `state: 'archived'` or `state: 'closed'`

**Steps**:

1. Navigate to Q&A tab

**Expected Results**:

- "Ask a Question" section replaced with:
  - Icon (lock symbol)
  - Heading: "Questions Unavailable"
  - Message: "New questions cannot be submitted in archived or closed sessions."
- Existing questions are still visible (read-only)

---

### 1.6 Polls - Attendee Actions

#### 1.6.1 View Active Polls

**Prerequisites**: Session has `enablePoll: true` and active polls exist

**Steps**:

1. Navigate to Polls tab
2. Observe list of active polls

**Expected Results**:

- Active polls displayed with green "Active" badge
- Poll title, description, and type shown
- Response input (based on poll type) is visible

---

#### 1.6.2 Respond to Multiple Choice Poll

**Steps**:

1. View active multiple choice poll
2. Select an option (radio button or checkbox if multiple allowed)
3. Click "Submit Response" or similar

**Expected Results**:

- Options displayed as radio buttons (single) or checkboxes (multiple)
- After submit, POST `/polls/:id/responses` sends `{ response: "option", attendeeName, deviceId, sessionId }`
- Confirmation message or updated poll results shown
- If `hideAnswersUntilClosed: true`, results are hidden until poll closes
- If `allowMultipleResponses: false`, cannot respond again

**API Mocks Needed**:

- `GET /sessions/:id/polls` → Returns polls array
- `POST /polls/:id/responses` → Success response

---

#### 1.6.3 Respond to Rating Scale Poll

**Steps**:

1. View active rating scale poll
2. Select a rating (e.g., 1-5 stars)
3. Submit

**Expected Results**:

- Rating scale displayed with min/max ratings (e.g., 1-5)
- After submit, response recorded
- Average rating may be displayed (if not hidden)

---

#### 1.6.4 Respond to Yes/No Poll

**Steps**:

1. View active yes/no poll
2. Select Yes or No
3. Submit

**Expected Results**:

- Two options: "Yes" and "No"
- After submit, response recorded
- Results may show percentage of Yes vs No

---

#### 1.6.5 Respond to Open Text Poll

**Steps**:

1. View active open text poll
2. Type text response in textarea
3. Submit

**Expected Results**:

- Textarea for input
- Character/word limit may be displayed
- After submit, response recorded

---

#### 1.6.6 Respond to Word Cloud Poll

**Steps**:

1. View active word cloud poll
2. Enter word(s) (respecting `maxWords` limit)
3. Submit

**Expected Results**:

- Input field for words
- Validation for max words limit
- After submit, word(s) added to word cloud
- Word cloud visualization updated

---

#### 1.6.7 View Poll Results (Not Hidden)

**Steps**:

1. After responding to poll (or if poll allows viewing without response)
2. Observe results

**Expected Results**:

- Bar charts, percentages, or word cloud displayed
- Total responses count shown
- For multiple choice: votes per option
- For rating: average rating
- For open text: list of responses
- For word cloud: word cloud visualization

---

#### 1.6.8 Poll Results Hidden Until Closed

**Prerequisites**: Poll has `hideAnswersUntilClosed: true`

**Steps**:

1. Respond to poll
2. Attempt to view results

**Expected Results**:

- Results are not visible
- Message: "Results will be shown after the poll closes" or similar
- After speaker closes poll, results become visible

---

#### 1.6.9 Cannot Respond to Closed Poll

**Prerequisites**: Poll has `isActive: false`

**Steps**:

1. View closed poll

**Expected Results**:

- Input disabled or hidden
- "Closed" badge shown
- Results may be visible (depending on settings)

---

#### 1.6.10 Multiple Responses Allowed

**Prerequisites**: Poll has `allowMultipleResponses: true`

**Steps**:

1. Respond to poll
2. Change response and submit again

**Expected Results**:

- Multiple responses accepted
- Previous response may be updated or additional response added

---

#### 1.6.11 Multiple Responses Not Allowed

**Prerequisites**: Poll has `allowMultipleResponses: false`

**Steps**:

1. Respond to poll
2. Attempt to respond again

**Expected Results**:

- Input disabled after first response
- Message: "You have already responded to this poll"

---

#### 1.6.12 Real-time Poll Updates (WebSocket)

**Prerequisites**: WebSocket connection active

**Steps**:

1. Keep Polls tab open
2. Simulate WebSocket `poll` or `pollResponse` event

**Expected Results**:

- New poll appears in list
- Poll results update in real-time as others respond

---

#### 1.6.13 Empty Polls State

**Prerequisites**: No polls created

**Steps**:

1. Navigate to Polls tab

**Expected Results**:

- Empty state message: "No polls yet" or similar
- Icon and friendly message

---

### 1.7 Feedback

#### 1.7.1 Submit Feedback (Happy Path)

**Prerequisites**: Session has `enableFeedback: true` and session state allows feedback

**Steps**:

1. Navigate to Feedback tab
2. Select rating (e.g., 1-5 stars)
3. Enter optional comment in textarea
4. Click "Submit Feedback" button

**Expected Results**:

- Rating selector is visible (stars or scale)
- Comment textarea is optional
- After submit, POST `/sessions/:id/feedback` sends `{ score, comment, attendeeName, deviceId }`
- Success message displayed
- Feedback form replaced with "Thank you" message
- `feedbackSubmitted` state set to true

**API Mocks Needed**:

- `POST /sessions/:id/feedback` → Success response
- `GET /sessions/:id/feedback/status/:deviceId` → Returns `{ hasSubmittedFeedback: true }`

---

#### 1.7.2 Feedback Required Before Accessing Resources

**Prerequisites**: Some resources have `availableAfterFeedback: true`

**Steps**:

1. Navigate to Resources tab before submitting feedback
2. Observe restricted resources
3. Submit feedback
4. Return to Resources tab

**Expected Results**:

- Before feedback: restricted resources hidden or locked
- After feedback: all resources visible and accessible

---

#### 1.7.3 Cannot Submit Feedback Twice

**Prerequisites**: Feedback already submitted

**Steps**:

1. Navigate to Feedback tab
2. Observe form state

**Expected Results**:

- Form is hidden or disabled
- Message: "Thank you for your feedback" or similar

---

#### 1.7.4 Feedback Disabled in Closed Session

**Prerequisites**: Session state is closed or archived

**Steps**:

1. Navigate to Feedback tab

**Expected Results**:

- Feedback form disabled
- Message explaining feedback is no longer available

---

### 1.8 Connections

#### 1.8.1 Request Connection with Speaker

**Prerequisites**: Session has `enableConnections: true`

**Steps**:

1. Navigate to Connect tab
2. Fill in connection form (e.g., message, contact info)
3. Click "Send Connection Request"

**Expected Results**:

- Form fields for message and contact information
- After submit, POST `/sessions/:id/connections` sends `{ ...data, attendeeName, deviceId }`
- Success confirmation shown
- Cannot submit duplicate connection request

**API Mocks Needed**:

- `POST /sessions/:id/connections` → Success response

---

#### 1.8.2 View Speaker Information

**Steps**:

1. Navigate to Connect tab
2. Observe speaker profiles

**Expected Results**:

- Speaker names, titles, and photos displayed
- Bio or contact information may be shown

---

#### 1.8.3 Connection Already Submitted

**Prerequisites**: Connection request already sent

**Steps**:

1. Navigate to Connect tab

**Expected Results**:

- Form disabled or hidden
- Message: "Connection request sent" or similar

---

### 1.9 Quick Reactions

#### 1.9.1 Send Reaction (Emoji)

**Prerequisites**: Session has `enableReactions: true`

**Steps**:

1. Observe floating reaction button (bottom right or similar)
2. Click reaction button
3. Select emoji from picker
4. Click to send

**Expected Results**:

- Reaction picker opens with emoji options
- After click, POST `/sessions/:id/reactions` sends `{ emoji, attendeeName, deviceId }`
- Flying emoji animation appears on screen
- Emoji "flies" across the screen briefly

**API Mocks Needed**:

- `POST /sessions/:id/reactions` → Success (no body)

---

#### 1.9.2 View Flying Emojis from Other Attendees (WebSocket)

**Prerequisites**: WebSocket active

**Steps**:

1. Keep session page open
2. Simulate WebSocket `reaction` event

**Expected Results**:

- Flying emoji animation appears
- Multiple emojis can animate simultaneously

---

#### 1.9.3 Reactions Cleared by Speaker (WebSocket)

**Steps**:

1. Observe flying emojis
2. Simulate WebSocket `reaction` event with `{ cleared: true }`

**Expected Results**:

- No visible change for attendees (just stops new flying emojis)

---

### 1.10 Session States

#### 1.10.1 Active Session

**Prerequisites**: Session `state: 'active'`

**Steps**:

1. Join session
2. Observe all features are enabled (based on toggles)

**Expected Results**:

- Q&A, Polls, Feedback, Connections, Reactions all functional
- No restrictions on interactions

---

#### 1.10.2 Closed Session

**Prerequisites**: Session `state: 'closed'`

**Steps**:

1. Attempt to join session

**Expected Results**:

- May show error: "This session is currently closed and not available."
- Or allow viewing in read-only mode

---

#### 1.10.3 Archived Session

**Prerequisites**: Session `state: 'archived'`

**Steps**:

1. Join session
2. Observe read-only mode

**Expected Results**:

- Q&A: can view questions but not submit new
- Polls: can view results but not respond
- Feedback: disabled
- Resources: all available (no feedback gate)
- Message indicates session is archived

---

#### 1.10.4 Event Session

**Prerequisites**: Session `state: 'event'`

**Steps**:

1. Join session
2. Verify all features work like active session

**Expected Results**:

- Functionally identical to `active` state
- May display event branding or context

---

### 1.11 Mobile Experience

#### 1.11.1 Mobile Navigation

**Steps**:

1. Use mobile viewport
2. Navigate through tabs using bottom tab bar

**Expected Results**:

- Fixed bottom navigation bar
- Tab switching works smoothly
- Content is responsive and readable

---

#### 1.11.2 Mobile Q&A

**Steps**:

1. Submit question on mobile
2. Upvote question
3. View questions list

**Expected Results**:

- Textarea and buttons are thumb-friendly
- Questions list is scrollable and readable
- Upvote buttons are easily clickable

---

#### 1.11.3 Mobile Polls

**Steps**:

1. Respond to poll on mobile
2. View results

**Expected Results**:

- Poll inputs are appropriately sized
- Submit buttons are accessible
- Results charts are responsive

---

### 1.12 Accessibility

#### 1.12.1 Keyboard Navigation

**Steps**:

1. Navigate through session using only keyboard (Tab, Enter, Arrow keys)

**Expected Results**:

- All interactive elements are reachable via Tab
- Enter/Space activate buttons and inputs
- Focus indicators are visible
- Logical tab order

---

#### 1.12.2 Screen Reader Support

**Steps**:

1. Use screen reader (NVDA, JAWS, VoiceOver)
2. Navigate through session

**Expected Results**:

- Semantic HTML and ARIA labels present
- Form inputs have labels
- Buttons describe their action
- Headings structure content
- Status messages announced

---

#### 1.12.3 Color Contrast

**Steps**:

1. Inspect UI for color contrast ratios

**Expected Results**:

- Text has sufficient contrast (WCAG AA minimum 4.5:1 for normal text)
- Interactive elements are distinguishable

---

---

## 2. Speaker Experience - Test Scenarios

### 2.1 Authentication

#### 2.1.1 Speaker Login (Supabase Auth)

**Steps**:

1. Navigate to `/login`
2. Enter email and password
3. Click "Sign In"

**Expected Results**:

- Supabase authentication called
- On success, redirect to `/speaker` dashboard
- Access token stored for API calls
- On failure, error message displayed

---

#### 2.1.2 Sign Up

**Steps**:

1. Navigate to sign-up page
2. Enter email and password
3. Complete sign-up

**Expected Results**:

- Account created in Supabase
- Confirmation email sent (if email verification enabled)
- Speaker profile created in backend

---

#### 2.1.3 Password Reset

**Steps**:

1. Navigate to `/reset-password`
2. Enter email
3. Request reset link
4. Follow link and reset password

**Expected Results**:

- Reset email sent via Supabase
- Password updated successfully

---

#### 2.1.4 Logout

**Steps**:

1. From speaker dashboard, click logout

**Expected Results**:

- Session cleared
- Redirect to homepage or login

---

### 2.2 Speaker Dashboard

#### 2.2.1 View Sessions List

**Prerequisites**: Speaker is logged in

**Steps**:

1. Navigate to `/speaker` dashboard
2. Observe list of sessions

**Expected Results**:

- Sessions fetched via `GET /speaker/sessions` with Bearer token
- Each session card shows:
  - Title
  - Status (Active, Closed, Archived)
  - Session ID
  - Created date
  - Quick actions (View, Edit, Archive, etc.)

**API Mocks Needed**:

- `GET /speaker/sessions` (with Authorization header) → Returns array of sessions

---

#### 2.2.2 Create New Session

**Steps**:

1. Click "Create New Session" button
2. Fill in session form:
   - Title (required)
   - Description
   - Toggles: Enable Q&A, Polls, Feedback, Connections, Reactions
   - Passcode (optional)
3. Click "Create Session"

**Expected Results**:

- Form validation (title required)
- POST `/sessions` with session data and Bearer token
- On success, redirect to session detail page (`/speaker/session/:id`)
- New session appears in dashboard list

**API Mocks Needed**:

- `POST /sessions` → Returns created session with `sessionId`

---

#### 2.2.3 View Pending Invitations

**Prerequisites**: Co-speaker invitations exist

**Steps**:

1. View dashboard
2. Observe "Pending Invitations" section

**Expected Results**:

- Invitations from other speakers to join sessions as co-speaker
- Actions: Accept, Decline
- After accepting, session added to your sessions list

---

#### 2.2.4 View Pending Session Assignments

**Prerequisites**: Assigned to event sessions

**Steps**:

1. View dashboard
2. Observe "Pending Session Assignments" section

**Expected Results**:

- Sessions assigned to you by event organizers
- Can view or manage these sessions

---

### 2.3 Session Management

#### 2.3.1 Edit Session Details

**Steps**:

1. From session detail page, click "Edit" or navigate to edit page
2. Update title, description, or toggles
3. Click "Save"

**Expected Results**:

- PUT `/sessions/:id` with updated data
- Success message displayed
- Changes reflected in session

**API Mocks Needed**:

- `PUT /sessions/:id` → Returns updated session

---

#### 2.3.2 Archive Session

**Steps**:

1. From session detail page, click "Archive"
2. Confirm action

**Expected Results**:

- POST `/sessions/:id/archive`
- Session state changes to `archived`
- Attendees can no longer interact, only view
- Session marked as archived in dashboard

**API Mocks Needed**:

- `POST /sessions/:id/archive` → Success response

---

#### 2.3.3 Clone Session

**Steps**:

1. From session card or detail, click "Clone"
2. Confirm or adjust settings

**Expected Results**:

- Creates duplicate session with same settings
- New session ID generated
- User redirected to new session

---

#### 2.3.4 View Session QR Code

**Steps**:

1. From session detail, click "QR Code" or similar
2. Observe generated QR code

**Expected Results**:

- QR code encodes session join URL
- Can be downloaded or printed for display

---

### 2.4 Session Info Tab

#### 2.4.1 View Session Information

**Steps**:

1. Navigate to Session Info tab in speaker session view
2. Observe session details

**Expected Results**:

- Session ID, title, description displayed
- Created date, status
- Feature toggles status (Q&A, Polls, etc.)
- Attendee count

---

#### 2.4.2 Share Session Link

**Steps**:

1. View session info
2. Copy session ID or join link

**Expected Results**:

- Easy copy button for session ID
- Full join URL available for sharing

---

### 2.5 Resources Tab (Speaker)

#### 2.5.1 Add Resource

**Steps**:

1. Navigate to Resources tab
2. Click "Add Resource"
3. Fill in:
   - Title
   - URL or file upload
   - Toggle "Available after feedback"
4. Click "Save"

**Expected Results**:

- Resource added to session
- Visible to attendees (subject to feedback gate)

---

#### 2.5.2 Edit Resource

**Steps**:

1. Click edit on existing resource
2. Update fields
3. Save

**Expected Results**:

- Resource updated
- Changes visible to attendees

---

#### 2.5.3 Delete Resource

**Steps**:

1. Click delete on resource
2. Confirm

**Expected Results**:

- Resource removed from session

---

#### 2.5.4 Reorder Resources

**Steps**:

1. Drag and drop resources to reorder

**Expected Results**:

- Order saved and reflected for attendees

---

### 2.6 Q&A Tab (Speaker)

#### 2.6.1 View Questions

**Prerequisites**: Attendees have submitted questions

**Steps**:

1. Navigate to Q&A tab
2. Observe list of questions

**Expected Results**:

- All questions displayed
- Each question shows:
  - Question text
  - Attendee name
  - Upvote count
  - Timestamp
  - Answer status
- Can filter and sort questions

---

#### 2.6.2 Answer Question (with text)

**Steps**:

1. Click "Answer" on a question
2. Type answer in textarea
3. Click "Submit Answer"

**Expected Results**:

- PATCH `/questions/:id/answer` with `{ answer: "text", isAnswered: true }`
- Question marked as answered
- Answer displayed to attendees
- Speaker and attendees see green "Speaker Response" badge

**API Mocks Needed**:

- `PATCH /questions/:id/answer` → Success response

---

#### 2.6.3 Mark Question as Answered (no text)

**Steps**:

1. Click "Mark as Answered" (without typing response)

**Expected Results**:

- Question marked `isAnswered: true` but `answer: ""`
- Blue "Acknowledged" badge shown to attendees

---

#### 2.6.4 Delete Question

**Steps**:

1. Click delete on question
2. Confirm

**Expected Results**:

- DELETE `/questions/:id`
- Question removed from list
- WebSocket `deleteQuestion` event sent to attendees

**API Mocks Needed**:

- `DELETE /questions/:id` → Success response

---

#### 2.6.5 Real-time Question Arrival (WebSocket)

**Steps**:

1. Keep Q&A tab open
2. Attendee submits question

**Expected Results**:

- New question appears in speaker's list without refresh
- Notification or count updates

---

#### 2.6.6 Filter Questions (Speaker)

**Steps**:

1. Use filter dropdown
2. Select "All", "Answered", "Unanswered"

**Expected Results**:

- Questions list filtered accordingly

---

#### 2.6.7 Sort Questions (Speaker)

**Steps**:

1. Use sort dropdown
2. Select sort option (Engagement, Newest, etc.)

**Expected Results**:

- Questions re-sorted

---

### 2.7 Polls Tab (Speaker)

#### 2.7.1 Create Multiple Choice Poll

**Steps**:

1. Navigate to Polls tab
2. Click "Create Poll"
3. Select type: "Multiple Choice"
4. Enter title, description, and options (at least 2)
5. Toggle "Allow Multiple Responses" if desired
6. Toggle "Hide Answers Until Closed" if desired
7. Click "Create Poll"

**Expected Results**:

- POST `/sessions/:id/polls` with poll data
- Poll created and added to list
- Initially `isActive: false`

**API Mocks Needed**:

- `POST /sessions/:id/polls` → Returns created poll object

---

#### 2.7.2 Create Rating Scale Poll

**Steps**:

1. Create poll with type "Rating Scale"
2. Set min and max rating (e.g., 1-5)
3. Create

**Expected Results**:

- Rating scale poll created

---

#### 2.7.3 Create Yes/No Poll

**Steps**:

1. Create poll with type "Yes/No"
2. Enter title
3. Create

**Expected Results**:

- Yes/No poll created with two options pre-set

---

#### 2.7.4 Create Open Text Poll

**Steps**:

1. Create poll with type "Open Text"
2. Enter title
3. Create

**Expected Results**:

- Open text poll created

---

#### 2.7.5 Create Word Cloud Poll

**Steps**:

1. Create poll with type "Word Cloud"
2. Set `maxWords` per response
3. Create

**Expected Results**:

- Word cloud poll created

---

#### 2.7.6 Activate Poll

**Steps**:

1. From polls list, click "Activate" on a poll
2. Confirm

**Expected Results**:

- PATCH `/polls/:id/toggle` with `{ isActive: true }`
- Poll status changes to "Active"
- Attendees can now respond
- Badge changes to green "Active"

**API Mocks Needed**:

- `PATCH /polls/:id/toggle` → Success response

---

#### 2.7.7 Deactivate Poll

**Steps**:

1. Click "Close" or "Deactivate" on active poll

**Expected Results**:

- PATCH `/polls/:id/toggle` with `{ isActive: false }`
- Poll status changes to "Closed"
- Attendees can no longer respond
- Results become visible (if hidden)

---

#### 2.7.8 Edit Poll

**Steps**:

1. Click "Edit" on poll (only if no responses yet or poll not active)
2. Update title, description, or options
3. Save

**Expected Results**:

- PATCH `/polls/:id` with updated data
- Poll updated

**API Mocks Needed**:

- `PATCH /polls/:id` → Success response

---

#### 2.7.9 Delete Poll

**Steps**:

1. Click "Delete" on poll
2. Confirm (may require double-click confirmation)

**Expected Results**:

- DELETE `/polls/:id`
- Poll removed from list
- Attendees no longer see poll

**API Mocks Needed**:

- `DELETE /polls/:id` → Success response

---

#### 2.7.10 Reset Poll Responses

**Steps**:

1. Click "Reset" on poll
2. Confirm

**Expected Results**:

- POST `/polls/:id/reset`
- All responses cleared
- Vote counts reset to 0
- Poll can be re-opened

**API Mocks Needed**:

- `POST /polls/:id/reset` → Success response

---

#### 2.7.11 View Poll Results

**Steps**:

1. View poll in list
2. Observe results preview

**Expected Results**:

- For multiple choice: bar chart or percentage breakdown
- For rating: average rating
- For open text: list of responses
- For word cloud: word cloud visualization
- Total response count displayed

---

#### 2.7.12 Real-time Poll Responses (WebSocket)

**Steps**:

1. Keep Polls tab open
2. Attendees respond to poll

**Expected Results**:

- Poll results update in real-time
- Response count increments
- Charts/visualizations update

---

### 2.8 Feedback Tab (Speaker)

#### 2.8.1 View Feedback Submissions

**Prerequisites**: Attendees have submitted feedback

**Steps**:

1. Navigate to Feedback tab
2. Observe list of feedback

**Expected Results**:

- GET `/sessions/:id/feedback` (with Bearer token) returns feedback array
- Each feedback shows:
  - Attendee name
  - Rating (score)
  - Comment (if provided)
  - Timestamp
- Average rating displayed
- Feedback count displayed

**API Mocks Needed**:

- `GET /sessions/:id/feedback` → Returns array of feedback objects

---

#### 2.8.2 Filter Feedback by Rating

**Steps**:

1. Use filter to show only 5-star, 4-star, etc.

**Expected Results**:

- Feedback list filtered by score

---

#### 2.8.3 Delete Feedback

**Steps**:

1. Click delete on feedback entry
2. Confirm

**Expected Results**:

- DELETE `/sessions/:id/feedback/:id`
- Feedback removed from list

**API Mocks Needed**:

- `DELETE /sessions/:id/feedback/:id` → Success response

---

#### 2.8.4 Export Feedback

**Steps**:

1. Click "Export" or "Download" button

**Expected Results**:

- Feedback exported as CSV or JSON
- Includes all feedback fields

---

### 2.9 Connections Tab (Speaker)

#### 2.9.1 View Connection Requests

**Prerequisites**: Attendees have requested connections

**Steps**:

1. Navigate to Connections tab
2. Observe list of connection requests

**Expected Results**:

- GET `/sessions/:id/connections` returns connections array
- Each connection shows:
  - Attendee name
  - Message
  - Contact information
  - Timestamp

**API Mocks Needed**:

- `GET /sessions/:id/connections` → Returns array of connection objects

---

#### 2.9.2 Export Connections

**Steps**:

1. Click "Export" button

**Expected Results**:

- Connections exported as CSV or JSON

---

### 2.10 Reactions Tab (Speaker)

#### 2.10.1 View Reaction Timeline

**Steps**:

1. Navigate to Reactions tab
2. Observe timeline of reactions

**Expected Results**:

- Reactions displayed chronologically
- Each reaction shows emoji and timestamp
- Can see spikes in reactions

---

#### 2.10.2 Clear Reactions

**Steps**:

1. Click "Clear Reactions" button

**Expected Results**:

- POST `/sessions/:id/reactions/clear`
- WebSocket event sent to attendees (stops flying emojis)

**API Mocks Needed**:

- `POST /sessions/:id/reactions/clear` → Success response

---

### 2.11 Analytics Tab

#### 2.11.1 View Session Analytics

**Steps**:

1. Navigate to Analytics tab
2. Observe metrics

**Expected Results**:

- GET `/sessions/:id/analytics` returns analytics data
- Metrics displayed:
  - Total attendees
  - Questions submitted
  - Polls responses
  - Feedback count and average rating
  - Connections count
  - Reactions count
- Charts and graphs (engagement over time, etc.)

**API Mocks Needed**:

- `GET /sessions/:id/analytics` → Returns analytics object

---

#### 2.11.2 Export Analytics

**Steps**:

1. Click "Export" button

**Expected Results**:

- Analytics exported as PDF or CSV

---

### 2.12 Co-Speakers Tab

#### 2.12.1 Invite Co-Speaker

**Steps**:

1. Navigate to Co-Speakers tab
2. Click "Invite Co-Speaker"
3. Enter email address
4. Click "Send Invitation"

**Expected Results**:

- Invitation sent to email
- Pending invitation listed
- Invited speaker receives email with link

---

#### 2.12.2 Remove Co-Speaker

**Steps**:

1. Click "Remove" on co-speaker
2. Confirm

**Expected Results**:

- Co-speaker removed from session
- No longer has access

---

#### 2.12.3 View Co-Speaker Invitations Status

**Steps**:

1. View co-speakers list
2. Observe invitation status

**Expected Results**:

- Pending: invitation sent, not yet accepted
- Accepted: co-speaker has joined
- Can resend invitation

---

### 2.13 Events/Conferences (Speaker)

#### 2.13.1 Create Event

**Steps**:

1. Navigate to events section
2. Click "Create Event"
3. Fill in event details (name, dates, description)
4. Create

**Expected Results**:

- Event created
- Can add sessions to event

---

#### 2.13.2 Add Session to Event

**Steps**:

1. From event detail, click "Add Session"
2. Fill in session details
3. Set schedule time
4. Create

**Expected Results**:

- POST `/events/:id/sessions` with session data
- Session added to event schedule

**API Mocks Needed**:

- `POST /events/:id/sessions` → Returns created session

---

#### 2.13.3 View Event Schedule

**Steps**:

1. Navigate to event page
2. Observe schedule of sessions

**Expected Results**:

- GET `/events/:id/sessions` returns sessions array
- Sessions displayed in chronological order
- Each session shows title, time, speaker

**API Mocks Needed**:

- `GET /events/:id` → Returns event object
- `GET /events/:id/sessions` → Returns sessions array

---

#### 2.13.4 Edit Event Details

**Steps**:

1. Edit event name, dates, or description
2. Save

**Expected Results**:

- Event updated

---

#### 2.13.5 View Event Analytics

**Steps**:

1. Navigate to event analytics

**Expected Results**:

- Aggregate analytics across all sessions in event
- Total attendees across all sessions
- Feedback and engagement metrics

---

---

## 3. Edge Cases and Error Handling

### 3.1 Network Errors

#### 3.1.1 Session Load Failure

**Steps**:

1. Join session
2. Simulate network error during session fetch

**Expected Results**:

- Error message displayed
- Retry option available

---

#### 3.1.2 Question Submission Failure

**Steps**:

1. Submit question
2. Simulate network error

**Expected Results**:

- Error message displayed
- Question not added to list
- User can retry

---

#### 3.1.3 Poll Response Failure

**Steps**:

1. Respond to poll
2. Simulate network error

**Expected Results**:

- Error message displayed
- Response not recorded
- User can retry

---

### 3.2 WebSocket Disconnection

#### 3.2.1 WebSocket Connection Lost

**Steps**:

1. Establish session
2. Disconnect WebSocket

**Expected Results**:

- App falls back to polling (every 8 seconds)
- Periodic refreshes of questions and polls
- User experience degrades but remains functional

---

#### 3.2.2 WebSocket Reconnection

**Steps**:

1. Disconnect WebSocket
2. Restore connection

**Expected Results**:

- WebSocket reconnects automatically
- Polling stops
- Real-time updates resume

---

### 3.3 Data Validation

#### 3.3.1 Invalid Session ID Format

**Steps**:

1. Enter invalid characters or very long session ID

**Expected Results**:

- Validation error or backend 404
- User informed of issue

---

#### 3.3.2 Overly Long Question Text

**Steps**:

1. Type extremely long question (e.g., >10,000 characters)

**Expected Results**:

- Character limit enforced (either frontend or backend)
- User notified of limit

---

#### 3.3.3 Special Characters in Input

**Steps**:

1. Enter special characters (emojis, HTML, etc.) in questions, polls, feedback

**Expected Results**:

- Input sanitized to prevent XSS
- Emojis and safe characters preserved
- HTML stripped or escaped

---

### 3.4 Concurrency

#### 3.4.1 Simultaneous Upvotes

**Steps**:

1. Multiple users upvote same question at same time

**Expected Results**:

- Backend handles race condition
- Upvote count increments correctly (no duplicates per user)

---

#### 3.4.2 Poll Closed While Responding

**Steps**:

1. Start responding to poll
2. Speaker closes poll before submission

**Expected Results**:

- Response rejected with message
- User notified poll is closed

---

### 3.5 Session State Transitions

#### 3.5.1 Session Archived While Attendee Viewing

**Steps**:

1. Attendee is in active session
2. Speaker archives session

**Expected Results**:

- Attendee sees notification or reload prompt
- Session transitions to read-only
- No data loss

---

#### 3.5.2 Session Deleted While Attendee Viewing

**Steps**:

1. Attendee is in session
2. Speaker deletes session

**Expected Results**:

- Attendee sees error message
- Redirect to join page or error page

---

### 3.6 Browser Compatibility

#### 3.6.1 Test on Major Browsers

**Browsers to test**:

- Chrome/Edge (Chromium)
- Firefox
- Safari (desktop and iOS)
- Mobile browsers (Chrome, Safari)

**Expected Results**:

- Consistent functionality across browsers
- Graceful degradation if features unsupported

---

#### 3.6.2 JavaScript Disabled

**Steps**:

1. Disable JavaScript
2. Attempt to use app

**Expected Results**:

- Graceful message: "JavaScript required"
- Or basic HTML fallback (unlikely for React app)

---

### 3.7 Accessibility Edge Cases

#### 3.7.1 High Contrast Mode

**Steps**:

1. Enable OS high contrast mode
2. Use app

**Expected Results**:

- App respects high contrast settings
- UI remains usable

---

#### 3.7.2 Screen Reader with Complex Components

**Steps**:

1. Use screen reader with polls, Q&A, and feedback

**Expected Results**:

- All controls and content are announced
- Complex interactions (e.g., word cloud) have text alternatives

---

### 3.8 Performance

#### 3.8.1 Large Number of Questions

**Steps**:

1. Load session with 1000+ questions

**Expected Results**:

- Questions render efficiently (pagination or virtualization)
- No significant lag

---

#### 3.8.2 Large Number of Poll Responses

**Steps**:

1. View poll with 10,000+ responses

**Expected Results**:

- Results render efficiently
- Charts and visualizations load without lag

---

---

## 4. Test Data Requirements

### Sample Session Data

```json
{
  "id": "lmvp00",
  "sessionId": "lmvp00",
  "title": "Test Session for EngageTime",
  "description": "Comprehensive test session with all features enabled",
  "status": "live",
  "state": "active",
  "enableQA": true,
  "enablePoll": true,
  "enableFeedback": true,
  "enableConnections": true,
  "enableReactions": true,
  "hasPassCode": false,
  "passcode": null,
  "sources": [
    {
      "id": "src1",
      "title": "Slide Deck",
      "url": "https://example.com/slides.pdf",
      "availableAfterFeedback": false
    },
    {
      "id": "src2",
      "title": "Bonus Material",
      "url": "https://example.com/bonus.zip",
      "availableAfterFeedback": true
    }
  ],
  "speakers": [
    {
      "id": "spk1",
      "name": "John Doe",
      "email": "john@example.com",
      "title": "Senior Developer"
    }
  ],
  "eventId": null,
  "eventSlug": null,
  "createdAt": "2025-10-14T10:00:00Z"
}
```

### Sample Question Data

```json
{
  "id": "q1",
  "sessionId": "lmvp00",
  "question": "How do you handle state management in large React apps?",
  "attendeeName": "Jane Smith",
  "deviceId": "device123",
  "upvotes": 5,
  "upvotedBy": ["device456", "device789"],
  "isAnswered": false,
  "answer": "",
  "createdAt": "2025-10-14T10:15:00Z"
}
```

### Sample Poll Data

```json
{
  "id": "poll1",
  "sessionId": "lmvp00",
  "title": "Which frontend framework do you prefer?",
  "description": "Vote for your favorite",
  "type": "multiple_choice",
  "options": [
    { "id": "opt1", "text": "React", "votes": 25 },
    { "id": "opt2", "text": "Vue", "votes": 10 },
    { "id": "opt3", "text": "Angular", "votes": 8 }
  ],
  "isActive": true,
  "allowMultipleResponses": false,
  "hideAnswersUntilClosed": false,
  "createdAt": "2025-10-14T10:20:00Z",
  "responses": [],
  "totalResponses": 43
}
```

### Sample Feedback Data

```json
{
  "id": "fb1",
  "sessionId": "lmvp00",
  "attendeeName": "Alice Johnson",
  "deviceId": "device555",
  "score": 5,
  "comment": "Excellent session, learned a lot!",
  "createdAt": "2025-10-14T11:00:00Z"
}
```

---

## 5. Test Automation Strategy

### Playwright Test Structure

```typescript
// Example test file: tests/attendee-qa.spec.ts
import { test, expect } from "@playwright/test";

test.describe("Attendee Q&A Flow", () => {
  test.beforeEach(async ({ page }) => {
    // Setup mocks before each test
    await setupMocks(page);
  });

  test("Submit and view question", async ({ page }) => {
    // Navigate to beta site
    await page.goto("https://beta.engagetime.live");

    // Join session
    await page.getByRole("link", { name: "Join a session" }).click();
    await page.getByRole("textbox", { name: "Session ID" }).fill("lmvp00");
    await page.getByRole("button", { name: "Join Session" }).click();

    // Enter name
    await page.getByRole("textbox", { name: "Your Name" }).fill("Test User");
    await page.getByRole("button", { name: "Join Session" }).click();

    // Navigate to Q&A
    await page.getByRole("tab", { name: "Q&A" }).click();

    // Submit question
    const questionText = "How is state managed?";
    await page
      .getByRole("textbox", { name: "What would you like to ask?" })
      .fill(questionText);
    await page.getByRole("button", { name: "Submit Question" }).click();

    // Verify question appears
    await expect(page.getByText(questionText)).toBeVisible();
  });
});

async function setupMocks(page) {
  await page.route("**/sessions/lmvp00", (route) => {
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        id: "lmvp00",
        sessionId: "lmvp00",
        title: "Test Session",
        state: "active",
        enableQA: true,
        enablePoll: true,
        enableFeedback: true,
        enableConnections: true,
        enableReactions: true,
        sources: [],
        speakers: [],
      }),
    });
  });

  await page.route("**/sessions/lmvp00/attendees", (route) => {
    if (route.request().method() === "POST") {
      route.fulfill({
        status: 201,
        body: JSON.stringify({ attendeeId: "att123" }),
      });
    }
  });

  await page.route("**/sessions/lmvp00/questions", (route) => {
    if (route.request().method() === "GET") {
      route.fulfill({
        status: 200,
        body: JSON.stringify([]),
      });
    } else if (route.request().method() === "POST") {
      const postData = JSON.parse(route.request().postData());
      route.fulfill({
        status: 201,
        body: JSON.stringify({
          id: "q123",
          sessionId: "lmvp00",
          question: postData.question,
          attendeeName: postData.attendeeName,
          deviceId: postData.deviceId,
          upvotes: 0,
          upvotedBy: [],
          isAnswered: false,
          answer: "",
          createdAt: new Date().toISOString(),
        }),
      });
    }
  });

  // Add more mocks as needed for polls, feedback, etc.
}
```

### Mock Service Worker (MSW) for Local Development

```typescript
// src/mocks/handlers.ts
import { rest } from "msw";

export const handlers = [
  rest.get("/sessions/:id", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        id: req.params.id,
        sessionId: req.params.id,
        title: "Mock Session",
        state: "active",
        enableQA: true,
        // ... other fields
      })
    );
  }),

  rest.post("/sessions/:id/attendees", (req, res, ctx) => {
    return res(ctx.status(201), ctx.json({ attendeeId: "mock-att-123" }));
  }),

  // Add more handlers for all endpoints
];
```

---

## 6. Test Execution Plan

### Phase 1: Smoke Tests (Priority 1)

- Attendee: Join session, submit question, respond to poll
- Speaker: Login, create session, view dashboard

### Phase 2: Core Features (Priority 2)

- Attendee: All Q&A actions, all poll types, feedback submission
- Speaker: Session management, Q&A management, poll management

### Phase 3: Advanced Features (Priority 3)

- Events/conferences
- Co-speakers
- Analytics
- Connections

### Phase 4: Edge Cases and Non-Functional (Priority 4)

- Error handling
- Performance
- Accessibility
- Cross-browser

### CI/CD Integration

- Run smoke tests on every commit
- Run full test suite nightly
- Generate test reports and trace files
- Store test artifacts (screenshots, traces) for debugging

---

## 7. Success Criteria

### Test Coverage Goals

- **Smoke Tests**: 100% pass rate required for release
- **Core Features**: 95% pass rate
- **Advanced Features**: 90% pass rate
- **Edge Cases**: 85% pass rate

### Performance Benchmarks

- Page load time: < 3 seconds
- Time to interactive: < 5 seconds
- WebSocket connection: < 1 second
- API response time: < 500ms (p95)

### Accessibility Compliance

- WCAG 2.1 Level AA compliance
- Keyboard navigation fully functional
- Screen reader compatibility verified

---

## 8. Test Maintenance

### Regular Review

- Review test plan quarterly
- Update tests when features change
- Retire obsolete tests

### Test Data Management

- Use consistent test data across environments
- Refresh test data regularly
- Isolate test data from production

### Documentation

- Keep test plan in sync with app features
- Document test failures and resolutions
- Maintain test environment setup guide

---

## Appendix A: Test Accounts

### Speaker Accounts

- Email: `speaker.test@engagetime.live`
- Password: `[Secure Password]`

### Test Session IDs

- Active session: `lmvp00`
- Archived session: `archived01`
- Passcode-protected: `protected01` (passcode: `1234`)

---

## Appendix B: Glossary

- **Attendee**: User who joins a session to participate
- **Speaker**: User who creates and manages sessions
- **Session**: A single event/presentation with Q&A, polls, etc.
- **Event**: A collection of multiple sessions (conference)
- **Device ID**: Unique identifier for an attendee's device (stored in localStorage)
- **WebSocket**: Real-time bidirectional communication channel
- **Polling**: Fallback mechanism when WebSocket unavailable (HTTP requests every 8s)

---

**End of Test Plan**

_Version: 1.0_  
_Date: October 14, 2025_  
_Author: GitHub Copilot (AI Assistant)_
