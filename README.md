# VentureFlow 🚀

VentureFlow is an AI-driven, dual-sided matchmaker and funding predictor designed to connect early-stage founders with highly targeted investor networks. By mapping live operational requirements against historical market benchmarks, the app eliminates manual spreadsheet hunting and reduces cold-outreach friction.

---

## 🛠️ The Core Technical Stack

- **Frontend Framework:** Next.js (React) with TypeScript for type-safe UI development.
- **Styling:** Tailwind CSS for responsive layouts and rapid dashboard development.
- **Backend Architecture:** Next.js Serverless API Routes for secure data handling.
- **Database:** Supabase (PostgreSQL) for relational data storage, authentication, and custom search filtering.
- **Data Intelligence Core:** Built using a localized relational matrix trained on 50,000+ historical investment profiles (`investments_VC.csv`).

---

## 🔒 Key MVP Data & Security Guidelines

To maintain user privacy while preserving marketplace functionality, VentureFlow follows a minimal data collection strategy.

### Authentication

Only the following information is required for account creation:

- Email Address
- Password
- Full Name

Optional identifiers such as phone numbers are intentionally omitted to minimize compliance and privacy risks.

### Data Layer Partitioning

- **Public Metadata:** Industries, funding stages, cities, and similar discovery information are available to power matching algorithms.
- **Sensitive Data:** Personal contact information remains encrypted and inaccessible until both parties establish a confirmed match.

---

## 🚀 Getting Started

### Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/VentureFlow.git
cd VentureFlow
```

### Install Dependencies

```bash
npm install
```

### Run the Development Server

```bash
npm run dev
```

Once the server starts, open your browser and visit:

```
http://localhost:3000
```

---

## 👥 Core Project Team

- **Abdoul Ba**
- **Jimmy Ong**
- **Lawrence Carrillo**

---

## 📌 Project Vision

VentureFlow streamlines fundraising by intelligently matching founders with investors based on operational needs, investment history, industry focus, funding stage, and geographic preferences. The goal is to make early-stage fundraising faster, more accurate, and significantly less reliant on manual research and cold outreach.