# Cloudinary Setup Guide for Raitakarya

This guide will help you set up Cloudinary for image uploads in the Raitakarya platform.

## What is Cloudinary?

Cloudinary is a cloud-based image and video management platform that provides:
- Free tier: 25GB storage, 25GB monthly bandwidth
- Automatic image optimization and compression
- CDN delivery for fast image loading worldwide
- No credit card required for free tier

## Step-by-Step Setup

### 1. Create a Cloudinary Account

1. Go to [https://cloudinary.com/users/register_free](https://cloudinary.com/users/register_free)
2. Sign up with your email (use the official Raitakarya Gmail account)
3. Verify your email address
4. Complete the account setup

### 2. Get Your Cloudinary Credentials

Once logged in:

1. Go to your **Dashboard** (https://console.cloudinary.com/)
2. You'll see three important values:
   - **Cloud Name**: Something like `dxxxxx123`
   - **API Key**: A long number like `123456789012345`
   - **API Secret**: A random string (click the eye icon to reveal)

### 3. Add Credentials to Render (Backend)

1. Go to your Render dashboard: https://dashboard.render.com/
2. Click on your `raitakarya-backend` service
3. Go to **Environment** tab on the left sidebar
4. Click **Add Environment Variable** and add these three variables:

```
CLOUDINARY_CLOUD_NAME = your_cloud_name_here
CLOUDINARY_API_KEY = your_api_key_here
CLOUDINARY_API_SECRET = your_api_secret_here
```

5. Click **Save Changes**
6. Your backend will automatically redeploy with the new credentials

### 4. Test the Upload Feature

Once deployed:

1. Go to your deployed frontend (https://raitakarya-mvp.vercel.app)
2. Sign up as a new worker
3. Try uploading a profile photo
4. Check your Cloudinary dashboard to see the uploaded image

## Folder Structure

Images are automatically organized in Cloudinary:

- **Profile photos**: `raitakarya/profiles/`
- **Job photos**: `raitakarya/jobs/`

## Image Optimization

The platform automatically:
- Resizes large images (profile: 500x500, jobs: 1200x900)
- Compresses images to 85% quality
- Converts to optimal format (WebP when supported)
- Limits upload size to 5MB

## Free Tier Limits

Cloudinary's free tier includes:
- **25 credits/month** (1 credit = 1GB storage or bandwidth)
- **25,000 transformations/month**
- **10GB managed storage**

This is more than enough for an MVP with hundreds of users.

## Troubleshooting

### Upload fails with "Invalid credentials"
- Double-check that you copied the credentials correctly
- Make sure there are no extra spaces in the environment variables
- Verify the API Secret (it's case-sensitive)

### Images not appearing
- Check the browser console for errors
- Verify the Cloudinary dashboard shows the upload
- Check that the frontend is calling the correct backend URL

### Bandwidth limit reached
- Upgrade to Cloudinary's paid plan ($99/month for 75 credits)
- Or optimize by reducing image quality/size
- Consider implementing lazy loading

## Security Notes

- ✅ API credentials are stored securely in Render environment variables
- ✅ Upload routes require authentication (JWT token)
- ✅ File type validation (images only)
- ✅ File size limit (5MB maximum)
- ✅ Images are publicly accessible via Cloudinary CDN (this is normal for profile photos)

## Next Steps

Once Cloudinary is set up and working:
1. Test uploading various image types (JPG, PNG, HEIC)
2. Test with mobile camera capture
3. Monitor usage in Cloudinary dashboard
4. Set up webhook notifications (optional) for upload tracking
