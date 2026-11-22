# Learn French with Coco: Android and iPhone apps

The apps are the website's own files (`french/`, `assets/`, `privacy/`, `terms/`) packed into a phone app with
[Capacitor](https://capacitorjs.com). Same lessons, games, Coco, sign-in and Supabase account, so progress syncs
between the apps and languageswithcoco.com. Lessons, words, quizzes and Coco's audio work offline; videos,
worksheets and sign-in need the internet.

- App name: **French with Coco** · app id: `com.languageswithcoco.french`
- App links: `com.languageswithcoco.french://auth` (sign-in comes back here) and
  `com.languageswithcoco.french://open/<route>` (e.g. `open/lesson/A1-01`).
- `french/native.js` and the native parts of `french/account.js` only run inside the apps.
- This folder is blocked from the website by `.htaccess`.

## Update the apps after changing the website
```
cd mobile
npm ci
npm run sync          # copies the website files into www/ and into android/ + ios/
```
Pushing to GitHub runs **.github/workflows/mobile-apps.yml**: it builds a test Android app (.apk) and an iPhone
simulator build, takes screenshots on both, and puts them on the `app-preview` pre-release.

## Icons and splash
`npm run icons` (sources in `mobile/assets/`, made by `node scripts/make-art.js` + the Coco app icon).

## Store release (needs the owner's developer accounts)
- Google Play: Google Play Console account ($25 once). Release build = `./gradlew bundleRelease` signed with an
  upload key kept by the owner (never in this repo).
- App Store: Apple Developer Program ($99/year) and a Mac or a cloud Mac build. The iPhone app shows the email
  sign-in only until **Sign in with Apple** is added (Apple requires it next to Google sign-in); set
  `apple: true` in `french/data/db-config.js` once it is on.
- Supabase: `com.languageswithcoco.french://auth` must be in Authentication > URL Configuration > Redirect URLs.
