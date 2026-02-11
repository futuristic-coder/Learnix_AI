# PDF Upload Fix for Render Deployment

## Problem
Your PDF files weren't accessible on Render because:
1. The code was hardcoding `localhost` URLs
2. Render uses an ephemeral filesystem (files are deleted during restarts)
3. The `/uploads/` directory isn't persistent on Render

## Solution
Migrated from local file storage to **Cloudinary** (cloud storage) for persistent file hosting.

## Setup Instructions

### 1. Create a Cloudinary Account
- Go to [cloudinary.com](https://cloudinary.com)
- Sign up for a free account
- Verify your email

### 2. Get Your Cloudinary Credentials
From the Cloudinary Dashboard:
- Find your **Cloud Name** (top of dashboard)
- Find your **API Key** (Settings → API Keys)
- Find your **API Secret** (Settings → API Keys) - Keep this secret!

### 3. Update Environment Variables

**On Render:**
1. Go to your Render backend service
2. Environment → Add New Environment Variable:
   - `CLOUDINARY_CLOUD_NAME` → your cloud name
   - `CLOUDINARY_API_KEY` → your API key
   - `CLOUDINARY_API_SECRET` → your API secret

**Locally (.env file):**
```
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 4. Install Dependencies
```bash
cd backend
npm install
# or
npm install cloudinary
```

### 5. Re-deploy to Render
```bash
git add .
git commit -m "Fix PDF uploads with Cloudinary integration"
git push
```

Render will automatically pick up your changes.

## What Changed

### Backend Changes
- **documentController.js**: Uploads PDFs to Cloudinary instead of local filesystem
- **cloudinary.js**: New config file for Cloudinary setup
- **Document.js**: Added `cloudinaryPublicId` field to track cloud storage IDs
- **package.json**: Added `cloudinary` dependency

### Frontend Changes
- **DocumentDetailPage.jsx**: Updated to handle cloud URLs (no change needed, was already compatible)

## Testing
1. Upload a new PDF on your deployed site
2. Go to the document detail page
3. The PDF should now display correctly in the viewer

## Optional: Use Existing Database
If you want to serve existing PDFs that were previously stored locally, you'll need to manually re-upload them since PDFs are no longer stored in the `/uploads` folder.

## Free Tier Limits (Cloudinary)
- 25 GB storage
- 25 GB bandwidth/month
- Plenty for most learning applications

## Troubleshooting

**Error: "CLOUDINARY_CLOUD_NAME is missing"**
- Check that environment variables are set on Render
- Restart the Render service after adding env vars

**PDF still not displaying**
- Check browser console (F12) for actual error messages
- Verify Cloudinary credentials are correct
- Check that the file uploaded successfully (no errors during upload)

**Uploads too slow**
- Normal for first upload (creates directory structure)
- Subsequent uploads should be faster
- Consider optimizing PDF size if issues persist
