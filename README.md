# Linktree with Admin Panel

A simple linktree website with an admin panel for easy customization, hosted on Cloudflare Pages with Cloudflare D1 Database for data storage.

## Features

- **Public Linktree Page**: Display your profile, bio, and links
- **Admin Panel**: Customize your site without editing code
- **Live Customization**: Change colors, profile info, and links
- **Cloudflare D1 Database**: Uses SQLite-compatible database
- **Responsive Design**: Works on all devices

## Setup Instructions

### 1. Prerequisites

- Cloudflare account (free tier works)

### 2. Create D1 Database

1. Go to Cloudflare Dashboard → Workers & Pages → D1
2. Click "Create database"
3. Name it `linktree_db`
4. Copy the Database ID

### 3. Initialize Database Schema

1. In your D1 database dashboard, click "Console"
2. Run the SQL from `schema.sql`:
```sql
CREATE TABLE IF NOT EXISTS config (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL DEFAULT 'Your Name',
  bio TEXT DEFAULT 'Your bio goes here',
  profile_image TEXT DEFAULT 'https://via.placeholder.com/150',
  bg_color TEXT DEFAULT '#1a1a2e',
  text_color TEXT DEFAULT '#ffffff',
  accent_color TEXT DEFAULT '#6c5ce7',
  links TEXT DEFAULT '[]',
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);
```

### 4. Create Cloudflare Pages Project

1. Go to Cloudflare Dashboard → Workers & Pages → Create → Pages
2. Choose "Upload assets" or connect to Git
3. Upload all files from this folder (except `README.md`)
4. Deploy

### 5. Bind D1 Database to Pages

1. Go to your Pages project settings
2. Navigate to Settings → Functions → D1 database bindings
3. Add binding:
   - Variable name: `DB`
   - D1 database: Select the database you created
4. Save

### 6. Access Your Site

Your site will be available at `your-project.pages.dev`

- Main page: `your-project.pages.dev`
- Admin panel: `your-project.pages.dev/admin.html`

## Usage

1. **Access Admin Panel**: Go to `your-domain.com/admin.html`
2. **Customize**: Edit your profile, add links, change colors
3. **Save**: Click "Save Changes" to persist to Cloudflare KV
4. **Preview**: Click "Preview" to see changes before saving

## API Endpoints

- `GET /api/config` - Retrieve current configuration
- `POST /api/config` - Save new configuration

## Security Note

The admin panel is currently accessible to anyone who knows the URL. For production, consider:
- Adding password protection
- Using Cloudflare Access for authentication
- Restricting admin access by IP

## File Structure

```
linktree test/
├── index.html              # Main linktree page
├── admin.html              # Admin customization page
├── style.css               # Main page styles
├── admin-style.css         # Admin page styles
├── script.js               # Main page functionality
├── admin.js                # Admin page functionality
├── schema.sql              # D1 database schema
├── functions/
│   └── api/
│       └── config.js       # Cloudflare Pages Function for API
└── README.md               # This file
```
