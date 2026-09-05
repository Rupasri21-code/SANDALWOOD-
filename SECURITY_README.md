# 🛡️ CHANDAN NILAYAM — Security Fixes & README

This document explains all four security issues identified in **Chandan Nilayam**, why they occurred, and how they were fixed in simple, easy-to-understand terms.

---

## 📌 Summary Table

| Bug ID | Security Issue | Severity | Status | Simple Explanation |
| :--- | :--- | :--- | :--- | :--- |
| **WEB-01** | Administrative Auth Bypass | 🔴 Critical | **FIXED** | Locked all Admin pages & APIs so non-admins cannot access them. |
| **WEB-02** | Route Exposure in `robots.txt` | 🟡 Low | **FIXED** | Hidden private Admin URLs from public `robots.txt` file. |
| **WEB-03** | `sitemap.xml` Route Exposure | 🔵 Info | **AUDITED** | Verified only public pages (`/home`, `/login`) are listed in sitemap. |
| **WEB-04** | Auto Account Creation on Invalid Login | 🟠 Medium | **FIXED** | Made login read-only; wrong logins never create database records. |

---

## 🔍 Detailed Bug Breakdown (Simple & Clear)

---

### 1️⃣ WEB-01: Administrative Authentication & Authorization Bypass

* 🔴 **Severity:** Critical
* ❓ **Why it Occurred (Reason):**  
  Previously, some admin functions relied on frontend browser checks. Unauthenticated users or regular investors could attempt to send requests directly to Admin API routes (`/api/v1/investors`, `/api/v1/lands`, etc.).

* 💡 **How We Fixed It (Solution):**  
  We added strict **double-layer security** on the backend:
  1. **`protect` Middleware:** Checks if the user has a valid logged-in token (JWT). If not logged in, returns `401 Unauthorized`.
  2. **`authorize('ADMIN')` Middleware:** Checks if the logged-in user is actually an Admin. If a normal investor tries to access it, returns `403 Forbidden`.
  3. **Frontend Edge Guard (`middleware.ts`):** Automatically blocks unauthenticated visitors attempting to open `/admin/*` pages.

---

### 2️⃣ WEB-02: Admin Endpoint Disclosure through `robots.txt`

* 🟡 **Severity:** Low
* ❓ **Why it Occurred (Reason):**  
  The `robots.txt` file listed private folders like `/admin/`, `/portal/`, and `/api/`. Since `robots.txt` is a public file accessible to anyone on the internet, it accidentally told attackers exactly where private admin routes were located.

* 💡 **How We Fixed It (Solution):**  
  1. Removed private folder names (`/admin/`, `/portal/`, `/api/`) from `robots.txt`.
  2. Instead of exposing paths in `robots.txt`, we added a hidden HTTP response header (`X-Robots-Tag: noindex, nofollow`) inside Next.js `middleware.ts`. This tells search engines **not to index** admin pages without leaking private URL names to the public.

---

### 3️⃣ WEB-03: `sitemap.xml` Route Exposure Analysis

* 🔵 **Severity:** Informational
* ❓ **Why it Occurred (Reason):**  
  `sitemap.xml` tells search engines which pages to show on Google. If private user dashboards or admin pages get included in `sitemap.xml`, search engines might index private pages.

* 💡 **How We Fixed It (Solution):**  
  We audited `sitemap.ts` and confirmed it **strictly contains only public marketing pages**:
  * `/` (Landing Page)
  * `/home` (Home Page)
  * `/login` (Login Page)
  * `/reset-password` (Password Reset Page)  
  No admin pages or private user URLs are included in `sitemap.xml`.

---

### 4️⃣ WEB-04: Automatic Account Creation after Invalid Login

* 🟠 **Severity:** Medium
* ❓ **Why it Occurred (Reason):**  
  If someone tried logging in with an invalid email or failed password, there was a risk of auto-provisioning logic creating unexpected user records in the database.

* 💡 **How We Fixed It (Solution):**  
  1. Made the login controller **strictly READ-ONLY**.
  2. If an email/password combination is wrong, the server immediately stops and returns a generic error: `"Invalid email/username or password"` (Status 401).
  3. **Zero database records** (users, profiles, or tokens) are created or modified during failed logins.
  4. Added rate-limiting (`loginLimiter`) to block repeated brute-force login attempts.

---

## 🧪 Verification & Proof of Fixes

All fixes were tested automatically using `node test-security.js`:

| Test Performed | Expected Result | Actual Result | Status |
| :--- | :--- | :--- | :--- |
| Request Admin API without token | `401 Unauthorized` | `401 Unauthorized` | 🟢 **PASS** |
| Investor token used on Admin API | `403 Forbidden` | `403 Forbidden` | 🟢 **PASS** |
| Admin token used on Admin API | `200 OK` | `200 OK` | 🟢 **PASS** |
| Wrong password or SQL-injection login | `401 Unauthorized` | `401 Unauthorized` | 🟢 **PASS** |
| Database user count after failed login | Unchanged (No new records) | Unchanged | 🟢 **PASS** |
| Check `robots.txt` for internal paths | No private paths exposed | Clean | 🟢 **PASS** |
| Check `sitemap.xml` entries | Public pages only | Public pages only | 🟢 **PASS** |

---

## 🏆 Final Conclusion

```text
WEB-01 Status: FIXED & VERIFIED (100% Locked)
WEB-02 Status: FIXED & VERIFIED (Cleaned & Secured)
WEB-03 Status: AUDITED & VERIFIED (Clean)
WEB-04 Status: FIXED & VERIFIED (Read-Only Login)

Automated Security Verification: 18 / 18 Tests PASSED
```
