# Enhancing Web Application Quality with Playwright

A comprehensive presentation and live coding session demonstrating how to use Playwright to automate end-to-end testing of web applications.

## 📋 Overview

In this session, we explore how to use Playwright to automate end-to-end testing of web applications. We focus on creating practical tests that verify the behavior of various web applications, including authentication scenarios for platforms like Microsoft 365. 

Starting from scratch, we build up test scenarios together, learning techniques and best practices for creating effective tests. By the end of the session, you'll have a deeper understanding of how to use Playwright to improve the quality of your solutions.

### Session Goals

- ✅ Understand Playwright fundamentals for end-to-end testing
- ✅ Learn best practices for creating reliable, maintainable tests
- ✅ Build authentication test scenarios from the ground up
- ✅ Explore real-world testing patterns and techniques
- ✅ Improve web application quality through automated testing

## 🎯 Project Structure

```
.
├── tests/                          # Playwright test files
│   ├── 1.start.spec.ts            # Session page tests
│   ├── 2.api.spec.ts              # API testing examples
│   ├── 3.auth.spec.ts             # Authentication tests
│   ├── login.setup.ts             # Setup for authenticated tests
│   └── screenshot.spec.ts         # Screenshot capture tests
├── utils/                          # Utility functions
│   └── signInAsUser.ts            # Sign-in helper utilities
├── .demo/                          # Demo slides and scripts
│   ├── slides/                    # Markdown presentation slides
│   ├── scripts/                   # AppleScript automation
│   ├── 1.start.yaml               # Demo configuration
│   ├── 2.api.yaml                 # API demo config
│   ├── 3.auth.yaml                # Auth demo config
│   └── 4.end.yaml                 # End demo config
├── playwright.config.ts            # Playwright configuration
├── playwright-report/              # HTML test reports
├── test-results/                   # Test result artifacts
└── package.json                    # Dependencies and scripts
```

## 🚀 Getting Started

### Prerequisites

- Node.js 16+ 
- npm or yarn
- macOS (for demo scripts)

### Installation

```bash
# Install dependencies
npm install

# Install Playwright browsers
npx playwright install
```

### Running Tests

```bash
# Run all tests
npx playwright test

# Run tests for a specific project (chromium)
npx playwright test --project=chromium

# Run a specific test file
npx playwright test tests/1.start.spec.ts

# Run in debug mode
npx playwright test --debug

# Run with UI mode
npx playwright test --ui
```

### Viewing Test Reports

```bash
# Generate and open HTML report
npx playwright show-report
```

## 📝 Test Files

### 1.start.spec.ts
E2E testing basics covering:
- Session page loading
- Title verification
- Welcome message validation
- Registration form verification
- User registration workflow

**Target URL:** `https://engagetime.live/session/yysmtw`

### 2.api.spec.ts
API testing demonstrations with Playwright

### 3.auth.spec.ts
Authentication and authorization testing with authenticated session state

### login.setup.ts
Shared setup project that handles user authentication for dependent tests

### screenshot.spec.ts
Screenshot capture functionality:
- Navigate to `https://engagetime.live`
- Capture full-page screenshots
- Save to `screenshots/` directory

## 🔧 Configuration

### playwright.config.ts

Key configuration settings:
- **testDir:** `./tests` - Location of test files
- **reporter:** `html` - Generate HTML reports
- **projects:** 
  - `setup` - Authentication setup project
  - `chromium` - Desktop Chrome browser testing
- **storageState:** `.playwright/.auth/user.json` - Persisted authentication state

## 🎓 Testing Best Practices Demonstrated

- **Test Isolation:** Each test gets a fresh context
- **Semantic Locators:** Using `getByRole()`, `getByText()` for resilient selectors
- **Web-First Assertions:** Auto-retrying assertions with sensible timeouts
- **Test Organization:** Using `test.step()` for clarity
- **State Management:** Login setup project for authenticated tests
- **Page Object Pattern:** Utility functions for common operations

## 📸 Screenshots

Screenshots are captured to the `screenshots/` directory with full-page content.

Example:
```bash
npx playwright test tests/screenshot.spec.ts --project=chromium
```

Results saved to: `screenshots/chromium-example.png`

## 🎬 Demo Scripts

The `.demo/scripts/` directory contains AppleScript automation for presentation demos:

- `focus.mode.off.scpt` - Deactivate macOS Focus Mode
- `show.menubar.scpt` - Show system menu bar

These are executed as part of the demo workflow defined in the YAML configuration files.

## 🔐 Authentication

The project uses Playwright's `storageState` feature to share authenticated sessions:

1. `login.setup.ts` - Performs initial login and saves authentication state
2. Dependent tests use the saved state via `storageState: "playwright/.auth/user.json"`

## 📊 Environment Variables

Create a `.env` file in the project root for environment-specific configuration:

```env
# Add your environment variables here
```

The `playwright.config.ts` loads these using `dotenv`.

## 🛠️ Development

### Adding New Tests

1. Create a new `.spec.ts` file in the `tests/` directory
2. Use the existing tests as templates for best practices
3. Run `npx playwright test` to execute

### Debugging Tests

```bash
# Run in debug mode with inspector
npx playwright test --debug

# Run with browser visible
npx playwright test --headed

# Run with trace viewer
npx playwright test --trace on
```

## 📦 Dependencies

- **@playwright/test** - Testing framework
- **dotenv** - Environment configuration
- **typescript** - Type safety

See `package.json` for complete dependency list.

## 🔍 Troubleshooting

### Tests Not Finding Elements
- Use browser inspector: `npx playwright test --debug`
- Check element selectors with `getByRole()` first (most reliable)

### Authentication Issues
- Clear storage: `rm -rf playwright/.auth/`
- Re-run setup: `npx playwright test login.setup.ts`

### Screenshot Not Saved
- Ensure `screenshots/` directory exists or is created automatically
- Check file permissions

## 📚 Resources

- [Playwright Documentation](https://playwright.dev)
- [Playwright Best Practices](https://playwright.dev/docs/best-practices)
- [Web Testing Guide](https://playwright.dev/docs/intro)

## 👤 Session Details

**Title:** Enhancing web application quality with Playwright

**Focus Areas:**
- End-to-end testing automation with Playwright
- Building from scratch with live coding
- Practical test scenarios and real-world examples
- Authentication testing for enterprise platforms (Microsoft 365)
- Techniques and best practices for quality assurance

**Attendee Takeaways:**
- Hands-on experience building test scenarios
- Deep understanding of Playwright capabilities
- Best practices for maintainable test code
- Knowledge to improve solution quality through testing

## 📄 License

This project is provided as-is for educational purposes.

---

**Happy Testing! 🎉**
