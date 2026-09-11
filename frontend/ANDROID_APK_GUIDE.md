# YOUTH — Android APK Build & Deployment Guide

This guide details how the **YOUTH** React/Vite web application is packaged into a native Android APK using **Capacitor**.

---

## 📱 Application Identity

- **App Name:** `YOUTH`
- **Application ID:** `com.youth.wellbeing`
- **Native Platform Directory:** `frontend/android/`
- **Web Build Target:** `frontend/dist/`
- **Bundled Assets in Android:** `frontend/android/app/src/main/assets/public/`

---

## 🏗️ Architecture: Single Shared Codebase

```text
React / Vite Web Frontend (src/)
  ├── 🌐 Vercel Web Deployment (Production HTTPS URL)
  └── 📱 Capacitor Android Bridge (android/)
        └── 📦 Android APK (com.youth.wellbeing)
```

The Android app packages the production-ready frontend bundle locally and communicates with your deployed backend API over secure HTTPS.

---

## ⚙️ Environment Configuration

Set your deployed backend API URL in your environment (or `.env.production`):

```bash
VITE_API_BASE_URL=https://your-backend-domain.com/api/v1
```

*Note: Never hardcode `localhost` URLs in production APK builds. The API client automatically uses `VITE_API_BASE_URL` with offline fallbacks.*

---

## 🚀 Step-by-Step Build & Sync Workflow

### 1. Compile Frontend & Sync Native Assets
Whenever you make updates to the frontend code:

```bash
cd frontend
npm run cap:build
```
*(This automatically runs `tsc -b && vite build` and then `npx cap sync android` to copy the fresh assets into `android/app/src/main/assets/public`).*

---

### 2. Open in Android Studio
Launch the configured native Android project directly in Android Studio:

```bash
cd frontend
npm run cap:open
# or
npx cap open android
```

---

### 3. Generate Signed Release APK

Inside **Android Studio**:

1. Click on the top menu: **Build** → **Generate Signed Bundle / APK...**
2. Select **APK** and click **Next**.
3. Under **Key store path**, click **Create new...** (or choose your existing keystore):
   - **Key store path:** Choose a secure location outside the repository (e.g. `C:\keystores\youth-release.jks`)
   - **Password:** Enter a secure password
   - **Key Alias:** `youth-key`
   - **Certificate:** Fill in Name/Organization details
4. Click **OK**, then click **Next**.
5. Select the **release** build variant and check **V1 (Jar Signature)** & **V2 (Full APK Signature)** if prompted.
6. Click **Finish**.

---

### 📦 Output APK Location

Android Studio will output your signed APK to:

```text
frontend/android/app/release/app-release.apk
# or
frontend/android/app/build/outputs/apk/release/app-release-unsigned.apk / app-release.apk
```

You can transfer this `.apk` directly to any physical Android device or emulator for installation.

---

## 🔒 Security & Privacy Protections

- **Keystores & Credentials Ignored:** `.gitignore` excludes `*.jks`, `*.keystore`, `.env`, and Android build directories.
- **No Insecure WebViews:** Uses local bundled frontend assets—never points to insecure external URLs.
- **Student Data Privacy:** All session storage and tokens remain sandboxed to the `com.youth.wellbeing` Android container.
- **Native Android Hardware Back Button:** Handled automatically to navigate in-app pages before minimizing.
- **Offline Network Detection:** Built-in network listener alerts students if internet connectivity drops.

---

## 🧪 Verification Checklist

- [x] Capacitor core & Android platform configured (`com.youth.wellbeing`).
- [x] Android permissions set (`INTERNET`, `ACCESS_NETWORK_STATE`).
- [x] `index.html` configured with `viewport-fit=cover` and mobile meta tags.
- [x] Safe area inset padding integrated into `index.css`.
- [x] Hardware back button listener attached via `@capacitor/app`.
- [x] Offline banner alert integrated via `@capacitor/network`.
- [x] `npm run cap:build` builds web bundle and syncs with Android assets cleanly.
- [x] `.gitignore` updated to protect keystores, `.jks`, and build outputs.
