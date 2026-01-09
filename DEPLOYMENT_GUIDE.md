# Deployment Guide: UnderCare to Vercel 🚀

Follow these steps to get your clinical portal online for the world to see.

## Prisma & Database Warning ⚠️
Since UnderCare uses **Prisma with SQLite**, the database is currently a local file (`prisma/dev.db`). 
- **Ephemeral Storage**: Vercel's storage is ephemeral, meaning any data you save (new patients, vitals) will be **wiped** every time the app redeploys or restarts.
- **Recommended Solution**: For a "Real" persistent database, sign up for a free **[Turso](https://turso.tech/)** database (which is SQLite-compatible) and update your `DATABASE_URL` in the Vercel env vars.

---

## Step 1: Push to GitHub 🐙
1.  Initialize git in your project folder:
    ```powershell
    git init
    git add .
    git commit -m "Initial UnderCare commit"
    ```
2.  Create a new repository on [GitHub](https://github.com/new).
3.  Add the remote and push:
    ```powershell
    git remote add origin https://github.com/YOUR_USERNAME/undercare.git
    git branch -M main
    git push -u origin main
    ```

## Step 2: Connect to Vercel ☁️
1.  Go to [Vercel.com](https://vercel.com) and sign in with GitHub.
2.  Click **"Add New"** > **"Project"**.
3.  Import your `undercare` repository.

## Step 3: Environment Variables 🔑
In the "Environment Variables" section of the Vercel setup, add:
- `DATABASE_URL`: `file:./dev.db` (for testing) or your Turso URL.
- `JWT_SECRET`: A long random string (e.g., `your-deep-secret-12345`).

## Step 4: Deploy! 🎉
1.  Click **Deploy**.
2.  Vercel will use the `vercel.json` I created to automatically generate your Prisma client and build the Next.js app.
3.  Once finished, you'll get a URL like `undercare-xyz.vercel.app`.

---

### Need Help?
If you run into "Module not found" errors on Vercel, ensure you've run `npm install` locally before pushing to make sure `package-lock.json` is synced.
