# 🏡 StayNest – Full-Stack Accommodation & Rental Platform

[![Node.js](https://img.shields.io/badge/Node.js-v18+-68a063?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-5.x-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Bootstrap](https://img.shields.io/badge/Bootstrap-5.3-7952B3?style=for-the-badge&logo=bootstrap&logoColor=white)](https://getbootstrap.com/)
[![Leaflet](https://img.shields.io/badge/Leaflet-OpenStreetMap-199900?style=for-the-badge&logo=leaflet&logoColor=white)](https://leafletjs.com/)
[![Cloudinary](https://img.shields.io/badge/Cloudinary-Image_CDN-3448C5?style=for-the-badge&logo=cloudinary&logoColor=white)](https://cloudinary.com/)

> **StayNest** is a full-featured vacation rental and accommodation platform inspired by Airbnb. Built with Node.js, Express, and MongoDB using the **MVC (Model-View-Controller)** pattern, it offers listing management, real-time geocoding with interactive maps, secure authentication & authorization, cloud image storage, and review systems.

---

## 📑 Table of Contents

- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [System Architecture](#-system-architecture)
- [Project Structure](#-project-structure)
- [Database Schema](#-database-schema)
- [API Endpoints](#-api-endpoints)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Database Seeding](#database-seeding)
  - [Running the Application](#running-the-application)
- [Security & Validation](#-security--validation)
- [Author](#-author)

---

## ✨ Key Features

- 🔐 **Authentication & Authorization:**
  - User registration, login, and logout via **Passport.js** (salted hashing & session serialization).
  - Role-based authorization middlewares (`isLoggedIn`, `isOwner`, `isReviewAuthor`) to restrict unauthorized edits/deletions.
  - Persistent session management with **Connect-Mongo** stored in MongoDB Atlas.

- 🏠 **Listing Management (Full CRUD):**
  - Create, view, edit, and delete accommodation listings.
  - Category tagging (Rooms, Mountains, Castles, Camping, Farms, Arctic, Domes, Boats, Trending).
  - Responsive cards with tax-switch pricing display.

- 🗺️ **Geocoding & Interactive Maps:**
  - Automated forward geocoding via **OpenStreetMap (Nominatim API)** to fetch GeoJSON coordinates for any entered location.
  - Dynamic maps rendered on listing detail pages using **Leaflet.js** with custom markers and interactive popups.

- ☁️ **Cloud Media Storage:**
  - Image uploading handled with **Multer** and directly streamed to **Cloudinary CDN** via `multer-storage-cloudinary`.
  - Image URL transformation and optimization on thumbnail rendering.

- ⭐ **Reviews & Rating System:**
  - 5-star animated rating UI with comments.
  - Author attribution for each review.
  - Mongoose post-delete cascading middleware to delete associated reviews automatically when a listing is removed.

- 🔍 **Search & Category Filters:**
  - Live query filtering by categories.
  - Multi-field regex search by **Title, Location, or Country**.

- 🛡️ **Robust Validation & Feedback:**
  - Server-side data validation using **Joi** schemas.
  - Client-side Bootstrap form validation.
  - User-friendly Flash messages (`connect-flash`) for success and error alerts.

---

## 🛠 Tech Stack

| Layer | Technologies Used |
| :--- | :--- |
| **Frontend** | EJS (Embedded JavaScript), EJS-Mate layouts, Bootstrap 5.3, FontAwesome, Leaflet.js |
| **Backend** | Node.js, Express.js (v5.x), RESTful APIs, MVC Pattern |
| **Database** | MongoDB Atlas, Mongoose ODM v8 |
| **Authentication** | Passport.js, Passport-Local, Passport-Local-Mongoose |
| **Cloud & Media** | Cloudinary API, Multer, Multer-Storage-Cloudinary |
| **External APIs** | OpenStreetMap Nominatim Geocoding API |
| **Validation & Sessions** | Joi, Express-Session, Connect-Mongo, Connect-Flash |

---

## 🏛 System Architecture

The project strictly follows the **MVC (Model-View-Controller)** design pattern for maintainability and clean separation of concerns:

```
                  ┌──────────────────────┐
                  │    Client / Browser  │
                  └──────────┬───────────┘
                             │ HTTP Requests
                             ▼
                  ┌──────────────────────┐
                  │    Express Router    │
                  └──────────┬───────────┘
                             │ Middleware (Auth, Joi Validation)
                             ▼
                  ┌──────────────────────┐
                  │     Controllers      │ ◄─── External APIs (Nominatim, Cloudinary)
                  └─────┬──────────┬─────┘
        Data Operations │          │ Renders Template
                        ▼          ▼
             ┌─────────────┐    ┌─────────────┐
             │   Models    │    │    Views    │
             │ (Mongoose)  │    │ (EJS / CSS) │
             └──────┬──────┘    └─────────────┘
                    ▼
             ┌─────────────┐
             │   MongoDB   │
             │   (Atlas)   │
             └─────────────┘
```

---

## 📁 Project Structure

```bash
StayNest/
│
├── controllers/          # Business logic & request handlers
│   ├── listing.js        # Listing CRUD & Nominatim Geocoding
│   ├── review.js         # Review creation & deletion
│   └── user.js           # Signup, login, logout flows
│
├── models/               # Mongoose schemas & cascade hooks
│   ├── listing.js        # Listing schema (GeoJSON, Owner, Reviews ref)
│   ├── review.js         # Review schema (Rating, Comment, Author ref)
│   └── user.js           # User schema (Passport plugin)
│
├── routes/               # Express REST routers
│   ├── listing.js        # /listings routes
│   ├── review.js         # /listings/:id/reviews routes
│   └── user.js           # /signup, /login, /logout routes
│
├── views/                # EJS Templates
│   ├── includes/         # Navbar, footer, flash alerts
│   ├── layouts/          # Boilerplate layout (EJS-Mate)
│   ├── listings/         # Index, show, new, edit templates
│   ├── users/            # Login, signup templates
│   └── error.ejs         # Custom error page
│
├── public/               # Static assets
│   ├── css/              # Custom styling & star ratings
│   └── js/               # Leaflet map rendering & client scripts
│
├── utils/                # Helper utilities
│   ├── categories.js     # Category constants with FontAwesome icons
│   ├── ExpressError.js   # Custom HTTP error class
│   └── wrapAsync.js      # Async error handler wrapper
│
├── init/                 # Database seed data
│   ├── data.js           # Sample listings dataset
│   └── index.js          # DB population script
│
├── cloudConfig.js        # Cloudinary & Multer configuration
├── middleware.js         # Auth, ownership, and Joi validation guards
├── schema.js             # Joi validation schemas
├── app.js                # App entrypoint, server config & middleware
├── .env.example          # Sample environment variables template
├── package.json          # Node dependencies & project scripts
└── README.md             # Project documentation
```

---

## 🗄 Database Schema

### `Listing` Schema
- `title` *(String, Required)*
- `description` *(String)*
- `image` *({ url: String, filename: String })*
- `price` *(Number)*
- `location` *(String)*
- `country` *(String)*
- `category` *(String, Enum: Rooms, Mountains, Castles, etc.)*
- `geometry` *({ type: "Point", coordinates: [lon, lat] })*
- `reviews` *([ObjectId ref 'Review'])*
- `owner` *(ObjectId ref 'User')*

### `Review` Schema
- `comment` *(String)*
- `rating` *(Number, min: 1, max: 5)*
- `createdAt` *(Date, default: Date.now)*
- `author` *(ObjectId ref 'User')*

### `User` Schema
- `email` *(String, Required)*
- `username` *(Handled by Passport-Local-Mongoose)*
- `hash & salt` *(Handled by Passport-Local-Mongoose)*

---

## 🔌 API Endpoints

| Method | Endpoint | Description | Protection |
| :--- | :--- | :--- | :--- |
| **GET** | `/listings` | Show all listings (Search & Category filter) | Public |
| **GET** | `/listings/new` | Form to create a new listing | Logged In |
| **POST** | `/listings` | Create listing (Uploads image, geocodes address) | Logged In |
| **GET** | `/listings/:id` | View listing details, map & reviews | Public |
| **GET** | `/listings/:id/edit` | Form to edit listing | Owner Only |
| **PUT** | `/listings/:id` | Update listing data & optional image | Owner Only |
| **DELETE** | `/listings/:id` | Delete listing & cascade delete its reviews | Owner Only |
| **POST** | `/listings/:id/reviews` | Add review and rating to a listing | Logged In |
| **DELETE** | `/listings/:id/reviews/:reviewId` | Delete a specific review | Review Author Only |
| **GET** | `/signup` | User signup page | Public |
| **POST** | `/signup` | Register new user account | Public |
| **GET** | `/login` | User login page | Public |
| **POST** | `/login` | Authenticate user | Public |
| **GET** | `/logout` | Destroy session & logout user | Logged In |

---

## 🚀 Getting Started

### Prerequisites

Ensure you have installed:
- [Node.js](https://nodejs.org/) (v18.0.0 or higher)
- [Git](https://git-scm.com/)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account (or a local MongoDB instance)
- [Cloudinary](https://cloudinary.com/) account for image uploads

---

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/akhilesh-chaurasia/StayNest.git
   cd StayNest
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

---

### Environment Variables

Create a `.env` file in the root directory:

```bash
touch .env
```

Add the following credentials (refer to `.env.example`):

```env
# Cloudinary Credentials
CLOUD_NAME=your_cloudinary_cloud_name
CLOUD_API_KEY=your_cloudinary_api_key
CLOUD_API_SECRET=your_cloudinary_api_secret

# Session Secret Key
SECRET=your_super_secret_session_key

# MongoDB Atlas Connection String
ATLASDB_URL=your_mongodb_connection_uri
```

---

### Database Seeding

To populate your database with initial sample listings:

```bash
node init/index.js
```
*(Make sure your `.env` contains a valid `ATLASDB_URL` before seeding).*

---

### Running the Application

Start the server:

```bash
npm start
```
*(or run `node app.js`)*

Open your browser and navigate to:
```
http://localhost:8080/listings
```

---

## 🔒 Security & Validation

- **No Plaintext Passwords:** Password hashing and salting are automatically managed with PBKDF2 via `passport-local-mongoose`.
- **Session Security:** Cookies configured with `maxAge` expiration and cryptographic secrets stored securely using `connect-mongo`.
- **Validation Layers:**
  - Client-side validation with HTML5 + custom Bootstrap classes (`needs-validation`).
  - Strict server-side validation using **Joi** prevents malformed payloads directly at the API boundary.
- **Resource Protection:** Middlewares verify that users can only modify or delete listings and reviews they personally own.

---

## 👨‍💻 Author

**Akhilesh Chaurasia**
- GitHub: [@akhilesh-chaurasia](https://github.com/akhilesh-chaurasia)
- Project: [StayNest](https://github.com/akhilesh-chaurasia/StayNest)

⭐ *If you found this project helpful, feel free to give it a star!*
