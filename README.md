# BiblioCart 📚🛒

BiblioCart is a full-stack bookstore web application developed as a COMP-4220 (Agile Software Development) team project. The system was built and enhanced over two Agile sprints using Scrum for planning and Extreme Programming (XP) practices for implementation, testing, and refactoring.

The project evolved from a basic bookstore prototype into a feature-rich application with both customer-facing shopping features and a fully functional admin dashboard, including a modernized React frontend integrated with a .NET backend and a SQL database.

---

## 🚀 Project Highlights

### Customer Features
- Account creation and login/logout
- Shopping cart (add/remove items)
- Checkout flow with shipping/payment validation
- Coupon/discount application at checkout
- Wishlist (add/remove, move to cart)
- Genre-based book recommendations
- Order history
- Pre-order support for out-of-stock books
- Profile page (user info, orders, wishlist)
- Responsive React UI with dark/light theme support

### Admin Features
- Admin authentication and dashboard access
- Inventory and store management tools
- Full CRUD operations for:
  - Books
  - Categories
  - Suppliers
  - Coupons
  - Admin users
  - Orders
- Role validation and admin-only access control
- Foreign key-safe deletion and validation checks
- Real-time UI validation in dashboard forms

---

## 🧱 Tech Stack

### Frontend
- **React**
- TypeScript / JavaScript
- Component-based SPA architecture
- React Testing Library (Sprint 2 testing)

### Backend
- **.NET / ASP.NET API**
- C# controllers and backend logic
- Swagger for endpoint testing/verification

### Database
- **SQL Server** (remote/shared course database setup)
- Relational schema for users, books, cart, orders, coupons, wishlist, etc.

### Testing
- **MSTest** (backend/unit testing)
- **React Testing Library** (frontend component tests)
- Black-box and white-box testing approaches
- TDD workflow for key features

### Development Process
- **Scrum** (user stories, sprint planning, standups, reviews)
- **XP practices** (TDD, pair programming, refactoring, continuous integration)
- GitHub + pull requests + code reviews

---

## 📌 What Was Built Across the Two Sprints?

### Sprint 1 (Core Functionality)
Focused on a working bookstore foundation:
- Customer account creation
- Admin login
- Logout flow
- Cart add/remove logic
- Checkout workflow
- Basic admin privileges and initial inventory management UI prototype
- Backend classes, database tables, and unit tests for core features

### Sprint 2 (Enhancements + Modernization)
Expanded the system into a more complete product:
- React frontend migration and UI redesign
- Profile page, wishlist, recommendations
- Coupon system and checkout integration
- Order history and pre-order support
- Full React-based admin dashboard
- Extended CRUD/admin tooling
- Additional validation, API integration, testing, and refactoring

---

## 🧠 Key Engineering & Design Practices

This project emphasized software engineering process as much as feature delivery:

- **Agile user stories + acceptance criteria**
- **Incremental development across 2 sprints**
- **TDD and test-first thinking**
- **Pair programming for complex features**
- **Continuous integration via branching + PR reviews**
- **Refactoring and layered architecture**
- **Frontend ↔ Backend ↔ DAL ↔ Database separation**

---

## 🏗️ System Architecture (High Level)

BiblioCart follows a layered architecture:

1. **React Frontend**
   - Pages/components for catalog, cart, checkout, profile, admin dashboard
2. **API Controllers (.NET)**
   - Handle requests, validation, and business logic routing
3. **DAL (Data Access Layer)**
   - Typed database operations and query logic
4. **SQL Server Database**
   - Stores users, books, suppliers, categories, carts, orders, coupons, wishlist data

This separation improved maintainability, debugging, and feature expansion during Sprint 2.

---

## 🧪 Testing Approach

BiblioCart includes testing across both backend and frontend workflows:

- **Black-box testing** derived from acceptance criteria
- **White-box testing** for class methods and internal logic
- **Frontend component tests** for React UI interactions and API behavior
- Validation scenarios for:
  - checkout forms
  - coupon application
  - wishlist behavior
  - cart updates
  - admin CRUD operations
  - pre-order logic

---

## 📂 Example Features in the React Frontend

The Sprint 2 React migration introduced/rebuilt components such as:
- Home page
- Header navigation
- Search bar
- Main book display
- Cart popup overlay
- Checkout + confirmation UI
- Profile page
- Wishlist page
- Recommendation component
- Contact page
- Admin dashboard
- Theme switching (dark/light)

---

## ⚙️ Setup Notes (General)

> **Note:** This project was developed in a course environment with a shared/remote database and team-specific configuration. Depending on your local environment, some setup values (e.g., connection strings, credentials, environment variables) will need to be configured manually.

### Backend (General)
- Configure database credentials / environment variables (if required)
- Run the .NET backend (`dotnet run`)
- Confirm API endpoints via Swagger

### Frontend (General)
- Install dependencies (`npm install`)
- Start the React client (`npm run dev` or `npm start`, depending on project config)
- Ensure frontend API base URL points to the backend server

---

## 👥 Team Project Context

This repository was developed as a **team project** for:

- **Course:** COMP-4220 – Agile Software Development  
- **Focus:** Practicing Scrum + XP through iterative delivery, testing, refactoring, and collaboration

The project demonstrates both:
- **Functional software delivery** (a bookstore system), and
- **Agile engineering process execution** (user stories, sprint planning, TDD, pair programming, CI, reviews)

Team Members & Roles:
- Anika Khan: Scrum Master, Tester/Developer
- Raad Islam: Product Owner, Tester/Developer
- Nadia Malaq: Tester/Developer, SCRUM Advisor
- Hadiyah Arif: Tester/Developer
- Faria Islam: Tester/Developer
- Jackie Li: Tester/Developer
- Aryan Bharatkumar Sanghvi: Tester/Developer
- Nikhil Kapoor: Tester/Developer

---

## 📈 Lessons Learned / Project Outcomes

BiblioCart helped our team practice:
- translating user stories into working features
- planning and executing sprint goals
- integrating frontend/backend/database components
- maintaining code quality through tests and reviews
- adapting scope (e.g., simplifying recommendations to a genre-based solution) while preserving user value

---

## 🔮 Possible Future Improvements

- Advanced recommendation engine (beyond genre frequency)
- Payment gateway integration (real payment processing)
- Role-based authorization middleware hardening
- Deployment pipeline (cloud hosting / CI/CD)
- Performance optimization and pagination for large catalogs
- Enhanced analytics and admin reporting

---

## 🙌 Acknowledgements

Built as part of the COMP-4220: Agile Software Development course,
Dr. Xiaobu Yuan, Fall 2025
University of Windsor
