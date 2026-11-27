<div align="center">

<img src="assets/zentro-banner.svg" width="100%" alt="Zentro — India's Next Shopping Experience" />

# 🛒 Zentro

<a href="https://github.com/Ayaan-20-11/Zentro-">
  <img src="https://readme-typing-svg.demolab.com?font=Poppins&weight=600&size=20&duration=3000&pause=1000&color=00C2FF&background=0F172A&center=true&vCenter=true&width=640&height=44&lines=India%27s+Next+Shopping+Experience;Dark+Glassmorphic+E-Commerce+Prototype;HTML5+%E2%80%A2+CSS3+%E2%80%A2+Vanilla+JavaScript;Open-Source+%26+Beginner-Friendly" alt="Zentro animated typing tagline" />
</a>

**A dark, glassmorphic static e-commerce storefront prototype — built with HTML5, CSS3, and Vanilla JavaScript.**

> **Project Status:** Early-Stage Frontend Prototype — all storefront flows run client-side using hardcoded HTML and browser `localStorage` (no backend, database, authentication, or real payments yet).

[![License: MIT](https://img.shields.io/badge/License-MIT-00c2ff?style=flat-square&labelColor=0f172a)](LICENSE)
[![Status: Frontend Prototype](https://img.shields.io/badge/Status-Frontend%20Prototype-312e81?style=flat-square&labelColor=0f172a)](https://github.com/Ayaan-20-11/Zentro-)
[![GitHub Stars](https://img.shields.io/github/stars/Ayaan-20-11/Zentro-?style=flat-square&labelColor=0f172a&color=00c2ff)](https://github.com/Ayaan-20-11/Zentro-/stargazers)
[![GitHub Forks](https://img.shields.io/github/forks/Ayaan-20-11/Zentro-?style=flat-square&labelColor=0f172a&color=7c3aed)](https://github.com/Ayaan-20-11/Zentro-/network/members)
[![GitHub Issues](https://img.shields.io/github/issues/Ayaan-20-11/Zentro-?style=flat-square&labelColor=0f172a&color=00c2ff)](https://github.com/Ayaan-20-11/Zentro-/issues)
[![Good First Issues](https://img.shields.io/github/issues/Ayaan-20-11/Zentro-/good%20first%20issue?style=flat-square&labelColor=0f172a&color=312e81&label=good%20first%20issues)](https://github.com/Ayaan-20-11/Zentro-/issues?q=is%3Aopen+label%3A%22good+first+issue%22)
[![Pull Requests Welcome](https://img.shields.io/badge/PRs-welcome-00c2ff?style=flat-square&labelColor=0f172a)](CONTRIBUTING.md)

[About](#about-zentro) • [Features](#features) • [Getting Started](#getting-started) • [Limitations](#current-limitations) • [Roadmap](#planned-roadmap) • [Contributing](#contributing)

</div>

---

## About Zentro

**Zentro** (*"India's Next Shopping Experience"*) is an early-stage e-commerce web prototype designed around a dark slate (`#0f172a`) and electric cyan (`#00c2ff`) glassmorphic aesthetic.

The project demonstrates a complete client-side shopping journey across four connected pages:

1. **Interactive Entry (`index.html`)** — A glassmorphic welcome screen featuring an animated **Zentro Bot** mascot that reacts to user focus and typing.
2. **Storefront (`home.html`)** — A dark-themed storefront with live title search, animated stats counters, 16 product cards priced in INR (`₹`), a product quick-view modal, and a slide-out cart sidebar.
3. **Mock Checkout (`checkout.html`)** — A simulated checkout screen that captures order confirmation state locally.
4. **Order Confirmation (`success.html`)** — A receipt view summarizing the most recent simulated order from `localStorage`.

---

## Screenshots / Preview

Actual captures of the Zentro prototype running locally in a desktop browser (`index.html` → `home.html` → `checkout.html` → `success.html`):

| Landing Page (`index.html`) | Storefront & Product Catalog (`home.html`) |
| :---: | :---: |
| ![Zentro Landing Page](screenshots/landing-page.png) | ![Zentro Storefront](screenshots/storefront.png) |
| *Glassmorphic entry screen with the interactive Zentro Bot mascot and client-side form.* | *Sticky navbar with live search, animated stats, and 16-card dark storefront.* |

| Mock Checkout (`checkout.html`) | Order Confirmation (`success.html`) |
| :---: | :---: |
| ![Zentro Checkout](screenshots/checkout.png) | ![Zentro Order Confirmation](screenshots/order-confirmation.png) |
| *Simulated checkout form populated with demo values before placing an order.* | *Client-side receipt showing generated Order ID and `localStorage` order summary.* |

---

## Features

Zentro distinguishes clearly between **implemented client-side UI features** and **simulated prototype flows**:

### Implemented (Client-Side)
- **Multi-Page Storefront:** Four linked HTML pages (`index.html` → `home.html` → `checkout.html` → `success.html`) connected via browser navigation and `localStorage`.
- **Product Catalog:** 16 hardcoded product cards in `home.html` with product imagery, titles, and INR (`₹`) pricing.
- **Live Product Search:** Real-time, case-insensitive title filtering via `searchProducts()` in `home.html`.
- **Product Quick-View Modal:** Clicking any product card opens `#product-popup` with its title, image, price, and an **Add To Cart** button.
- **Shopping Cart with `localStorage` Persistence:** Slide-out `#cart-sidebar` that persists items across page reloads via `localStorage.getItem("cart")`.
- **Quantity Management:** Increment (`+`), decrement (`-`, removing items at `0`), clear cart (`Reset`), live navbar item count badge, and formatted total calculation (`₹`).
- **Free Delivery Progress Bar:** Cart sidebar shows how much more is needed to reach `₹5,000` for free delivery, with an animated progress bar that turns green once unlocked.
- **UI Animations & Dark Glassmorphic Design:**
  - Animated Zentro Bot (floating loop, blinking eyes, input focus/typing tilt), floating background particles, and cursor-follow glow on `index.html`.
  - Scroll reveal transitions (`.reveal`), card hover lift, `IntersectionObserver`-triggered stats counters (`10K+`, `500+`, `24/7`), and slide-in toast notifications on `home.html`.

### Simulated / Prototype Flows
- **Entry Screen (`index.html`):** Checks that Full Name is non-empty and Mobile Number has 10 digits, saves `userName` and `userPhone` to `localStorage`, and navigates to `home.html` (no OTP, password, or server verification).
- **Mock Checkout & Order Confirmation (`checkout.html` → `success.html`):** Moves `cart` to `lastOrder` in `localStorage`, clears `cart`, and renders a client-generated `ZT` order ID alongside a static delivery date on `success.html`.

---

## Technology Stack

| Layer | Technology | Usage in Zentro |
| :--- | :--- | :--- |
| **Markup** | HTML5 | Semantic/static page structure across 4 HTML files |
| **Styling** | CSS3 | `style.css` + inline `<style>` blocks (dark glassmorphism, keyframe animations) |
| **Logic** | Vanilla JavaScript (ES6+) | `script.js` + inline `<script>` blocks (DOM updates, search, cart state) |
| **Persistence** | Browser `localStorage` | Stores `userName`, `userPhone`, `cart`, `customerName`, and `lastOrder` |
| **Typography** | [Google Fonts](https://fonts.google.com/specimen/Poppins) | `Poppins` font family loaded via CDN |
| **Product Images** | [Unsplash](https://unsplash.com/) | External product card image URLs in `home.html` |

---

## Project Structure

```text
Zentro-/
├── .github/
│   ├── ISSUE_TEMPLATE/
│   │   ├── bug_report.yml           # Bug report form template
│   │   ├── config.yml               # Issue chooser configuration
│   │   ├── documentation.yml        # Documentation issue template
│   │   └── feature_request.yml      # Feature proposal template
│   └── PULL_REQUEST_TEMPLATE.md     # Standard pull request checklist
├── .vscode/
│   └── settings.json                # VS Code Live Server port configuration (5501)
├── .gitignore                       # Ignores OS metadata, temp/env/log files, and unused media
├── CODE_OF_CONDUCT.md               # Contributor Covenant v2.1 standards
├── CONTRIBUTING.md                  # Fork/branch/test/PR workflow for contributors
├── LICENSE                          # MIT License
├── README.md                        # Project overview and documentation
├── SECURITY.md                      # Security status and private vulnerability reporting
├── SUPPORT.md                       # Where to ask questions and report issues
├── index.html                       # Entry / simulated login page with Zentro Bot
├── home.html                        # Main storefront, 16 product cards, search, modal, cart
├── checkout.html                    # Mock checkout form
├── success.html                     # Client-side order confirmation page
├── style.css                        # Shared styles for cart sidebar, modal, reveal, footer, toast
├── script.js                        # User greeting, cart sidebar toggle, scroll reveal
├── background.jpg                   # Background artwork used in index.html
├── hero-bg.jpg                      # Hero background artwork used in home.html
└── screenshots/                     # Application preview screenshots used in README.md
    ├── landing-page.png
    ├── storefront.png
    ├── checkout.png
    └── order-confirmation.png
```

---

## Getting Started

### Prerequisites
Zentro currently requires **no build step, package manager, or backend setup**. You only need:
- [Git](https://git-scm.com/)
- A modern web browser (Chrome, Brave, Firefox, Safari, or Edge)
- [Visual Studio Code](https://code.visualstudio.com/) with **Live Server** (`ritwickdey.LiveServer`), *or* Python 3

### 1. Clone the Repository
```bash
git clone https://github.com/Ayaan-20-11/Zentro-.git
cd Zentro-
```

### 2. Run Locally

- **Option A — VS Code Live Server (Recommended):**
  1. Open the cloned `Zentro-` folder in VS Code.
  2. [`.vscode/settings.json`](.vscode/settings.json) preconfigures Live Server to port `5501`.
  3. Open `index.html` and click **Go Live** (or right-click `index.html` → **Open with Live Server**).

- **Option B — Python Built-In HTTP Server:**
  ```bash
  python3 -m http.server 5501
  ```
  Then open [`http://localhost:5501/index.html`](http://localhost:5501/index.html) in your browser.

### 3. Navigate the Prototype
Start at `index.html` (enter any name and 10-digit number) → browse, search, quick-view, and add products to your cart on `home.html` → proceed to `checkout.html` → view the simulated confirmation on `success.html`.

---

## Current Limitations

Because Zentro is an early-stage frontend prototype, the following limitations apply today:

- **No Backend or Database:** All state (`cart`, `lastOrder`, `userName`, `userPhone`) lives only in browser `localStorage` and is neither synced across devices nor isolated per user.
- **No Real Authentication or OTP Verification:** `index.html` accepts any non-empty name and 10-digit number; `home.html`, `checkout.html`, and `success.html` are directly accessible without a verified session.
- **No Real Payment Gateway:** No payment integration, tax/shipping calculation, or order processing exists.
- **Mock Checkout Behavior:** `checkout.html` does not display the cart summary or totals, performs no input validation, and discards the Address and Phone fields. `success.html` generates a new random `ZT` order ID on refresh and shows a hardcoded estimated delivery date.
- **Client-Side-Only Product & Order Data:** All 16 products are hardcoded in `home.html` with no categories, filters, sorting, or dedicated product pages. The wishlist (`❤️`) and profile (`👤`) navbar icons are currently static placeholders.
- **No Production-Grade Security:** Client-side prices can be altered in DevTools, and `home.html` / `success.html` currently interpolate `localStorage` fields with `innerHTML`. Do not deploy this prototype with sensitive user data or real transactions.

---

## Planned Roadmap

Planned milestones as Zentro evolves from a static prototype toward a full e-commerce application:

- **UI/UX Improvements**
  - Fix mobile responsiveness across `index.html`, `checkout.html`, `success.html`, `.stats`, and `#cart-sidebar`.
  - Add missing image `alt` attributes, form `<label>` associations, keyboard navigation, and deduplicate CSS/JS.
  - Replace unsafe `innerHTML` interpolation of `localStorage` values with safe DOM text rendering.
- **Shopping Experience**
  - Fix cart edge cases (repeat-add toast notification, empty-cart state after decrementing to zero, per-item remove button, empty search state).
  - Implement functional wishlist (`❤️`) and user profile (`👤`) views.
- **Product Catalog Improvements**
  - Move the 16 hardcoded HTML cards into a structured JS/JSON data model.
  - Add product categories, price/category filtering, sorting, and dedicated product detail views with descriptions and variants.
- **Backend & Database**
  - Introduce a backend or BaaS layer to store products, user carts, and persistent order history with server-side price/total verification.
- **Authentication**
  - Implement real user authentication (such as Phone OTP or Email/Password), protected checkout/profile routes, and logout.
- **Payments & Order Management**
  - Integrate sandboxed payment processing, checkout validation, persistent order IDs, and order tracking.
- **Testing & Production Readiness**
  - Optimize local and remote media assets, add automated browser/unit tests, configure linting/CI, and prepare production hosting.

---

## Contributing

Contributions from both experienced developers and first-time open-source contributors are warmly welcomed!

- Please read [`CONTRIBUTING.md`](CONTRIBUTING.md) for the fork, branch, manual testing, and pull request workflow.
- All participants are expected to follow our [`CODE_OF_CONDUCT.md`](CODE_OF_CONDUCT.md).
- **Discuss substantial changes first:** Before implementing large features, architectural refactors, or new dependencies, please [open an issue](https://github.com/Ayaan-20-11/Zentro-/issues/new/choose) to align with the maintainer.
- **Report bugs or request features:** Use our [Issue Templates](https://github.com/Ayaan-20-11/Zentro-/issues/new/choose).
- **Submit changes:** Open a [Pull Request](https://github.com/Ayaan-20-11/Zentro-/pulls) targeting `main` and complete [`.github/PULL_REQUEST_TEMPLATE.md`](.github/PULL_REQUEST_TEMPLATE.md).

---

## Security

Zentro is currently an early-stage frontend prototype without backend or production security controls. **Please do not disclose security vulnerabilities in public issues or pull requests.**

See [`SECURITY.md`](SECURITY.md) for supported status and instructions on reporting vulnerabilities privately.

---

## Support

Need help running Zentro locally or have a question about the codebase? Check [`SUPPORT.md`](SUPPORT.md) or search [existing GitHub Issues](https://github.com/Ayaan-20-11/Zentro-/issues) before opening a new one.

---

## License

This project is licensed under the **MIT License** — see the [`LICENSE`](LICENSE) file for details.

---

## Acknowledgements

- **Author & Maintainer:** [Ayaan Kapoor](https://github.com/Ayaan-20-11)
- **Typography:** [Poppins](https://fonts.google.com/specimen/Poppins) via Google Fonts
- **Product Photography:** [Unsplash](https://unsplash.com/)
- **Community Standards:** [Contributor Covenant v2.1](https://www.contributor-covenant.org/)

---

<div align="center">
  <img src="assets/zentro-footer.svg" width="100%" alt="Built by the Zentro Open-Source Community" />
</div>
