import { supabase } from '../supabase/config';
import imageCompression from 'browser-image-compression';

/**
 * Compress image if it's larger than 1MB
 * @param {File} file - The image file to compress
 * @returns {Promise<File>} - Compressed image file
 */
const compressImageIfNeeded = async (file) => {
  const maxSizeMB = 1; // 1MB target size
  const maxSizeBytes = maxSizeMB * 1024 * 1024;

  // If file is already under 1MB, return as-is
  if (file.size <= maxSizeBytes) {
    return file;
  }

  try {
    const options = {
      maxSizeMB: maxSizeMB,
      maxWidthOrHeight: 1920, // Maximum width or height
      useWebWorker: true, // Use web worker for better performance
      fileType: file.type, // Maintain original file type
    };

    const compressedFile = await imageCompression(file, options);
    
    console.log(`Image compressed: ${(file.size / 1024 / 1024).toFixed(2)}MB -> ${(compressedFile.size / 1024 / 1024).toFixed(2)}MB`);
    
    return compressedFile;
  } catch (error) {
    console.error('Error compressing image:', error);
    // If compression fails, return original file
    return file;
  }
};

/**
 * Upload an image file to Supabase Storage
 * @param {File} file - The image file to upload
 * @param {string} folder - Folder path in storage (e.g., 'news-images')
 * @param {Function} onProgress - Optional callback for upload progress (0-100)
 * @returns {Promise<string>} - The public URL of the uploaded image
 */
export const uploadImageToSupabase = async (file, folder = 'news-images', onProgress = null) => {
  // Check if Supabase is configured
  if (!supabase) {
    throw new Error('Supabase is not configured. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables.');
  }

  // Validate file type
  const validImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  if (!validImageTypes.includes(file.type)) {
    throw new Error('Invalid file type. Please upload an image (JPEG, PNG, GIF, or WebP).');
  }

  // Compress image if it's larger than 1MB
  let fileToUpload = await compressImageIfNeeded(file);

  // Validate file size (max 5MB) - should rarely trigger after compression
  const maxSize = 5 * 1024 * 1024; // 5MB in bytes
  if (fileToUpload.size > maxSize) {
    throw new Error('File size too large. Maximum size is 5MB.');
  }

  // Create a unique filename with timestamp
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 15);
  const fileExtension = file.name.split('.').pop();
  const fileName = `${timestamp}_${randomString}.${fileExtension}`;
  
  // In Supabase, 'news-images' is the bucket name
  // Files are stored directly in the bucket root by default
  const bucketName = 'news-images';
  const filePath = fileName; // Store files directly in bucket root

  try {
    // Upload file to Supabase Storage
    // Note: Supabase doesn't provide built-in progress tracking like Firebase
    // We simulate progress for better UX (Supabase uploads are fast)
    if (onProgress) {
      // Simulate progress for better UX (Supabase uploads are fast)
      onProgress(25);
      await new Promise(resolve => setTimeout(resolve, 100));
      onProgress(50);
      await new Promise(resolve => setTimeout(resolve, 100));
      onProgress(75);
    }

    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(filePath, fileToUpload, {
        contentType: fileToUpload.type,
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      throw error;
    }

    if (onProgress) {
      onProgress(100);
    }

    // Get public URL for the uploaded file
    const { data: urlData } = supabase.storage
      .from(bucketName)
      .getPublicUrl(filePath);

    return urlData.publicUrl;
  } catch (error) {
    console.error('Upload error:', error);
    throw new Error(error.message || 'Failed to upload image. Please try again.');
  }
};

/**
 * Delete an image from Supabase Storage
 * @param {string} url - The Supabase Storage URL of the image to delete
 * @returns {Promise<void>}
 */
export const deleteImageFromSupabase = async (url) => {
  // Check if Supabase is configured
  if (!supabase) {
    throw new Error('Supabase is not configured. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables.');
  }

  try {
    // Extract the path from the Supabase Storage URL
    // Supabase Storage URLs have format: https://[project-id].supabase.co/storage/v1/object/public/[bucket]/[path]
    const urlParts = url.split('/object/public/');
    if (urlParts.length !== 2) {
      throw new Error('Invalid Supabase Storage URL');
    }

    const pathParts = urlParts[1].split('/');
    const bucket = pathParts[0];
    const filePath = pathParts.slice(1).join('/');

    const { error } = await supabase.storage
      .from(bucket)
      .remove([filePath]);

    if (error) {
      throw error;
    }
  } catch (error) {
    console.error('Error deleting image:', error);
    throw error;
  }
};

// Export aliases for backward compatibility (if needed)
export const uploadImageToFirebase = uploadImageToSupabase;
export const deleteImageFromFirebase = deleteImageFromSupabase;
