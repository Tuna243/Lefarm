/**
 * Cloudinary utilities for image upload and management
 */

import { v2 as cloudinary } from 'cloudinary';

export const cloudinaryConfig = {
  cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || '',
  apiKey: process.env.CLOUDINARY_API_KEY || '',
  apiSecret: process.env.CLOUDINARY_API_SECRET || '',
};

export const UPLOAD_PRESET = 'lefarm_products';

// Configure cloudinary for server-side operations
if (cloudinaryConfig.cloudName && cloudinaryConfig.apiKey && cloudinaryConfig.apiSecret) {
  cloudinary.config({
    cloud_name: cloudinaryConfig.cloudName,
    api_key: cloudinaryConfig.apiKey,
    api_secret: cloudinaryConfig.apiSecret,
  });
}

/**
 * Upload image to Cloudinary (server-side using Buffer)
 */
export async function uploadToCloudinary(
  buffer: Buffer,
  folder: string = 'products'
): Promise<any> {
  return new Promise((resolve, reject) => {
    try {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: `lefarm/${folder}`,
          resource_type: 'auto',
          timeout: 60000, // 60 second timeout
        },
        (error, result) => {
          if (error) {
            console.error('Cloudinary error:', error);
            reject(new Error(error.message || 'Cloudinary upload failed'));
          } else {
            resolve(result);
          }
        }
      );

      // End stream with buffer
      uploadStream.end(buffer);
    } catch (error) {
      console.error('Upload error:', error);
      reject(error);
    }
  });
}

/**
 * Upload image to Cloudinary (client-side)
 * @param file File to upload
 * @param folder Folder in Cloudinary (products, projects, etc.)
 */
export async function uploadFileToCloudinary(
  file: File,
  folder: 'products' | 'projects' | 'gallery' = 'products'
): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', UPLOAD_PRESET);
  formData.append('folder', `lefarm/${folder}`);
  formData.append('resource_type', 'auto');

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudinaryConfig.cloudName}/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error('Upload failed');
    }

    const data = await response.json();
    return data.secure_url;
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw error;
  }
}

/**
 * Delete image from Cloudinary (requires server-side)
 * Call the API endpoint: /api/cloudinary/delete
 */
export async function deleteFromCloudinary(publicId: string): Promise<void> {
  try {
    const response = await fetch('/api/cloudinary/delete', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ publicId }),
    });

    if (!response.ok) {
      throw new Error('Delete failed');
    }
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    throw error;
  }
}

/**
 * Get Cloudinary image URL with transformations
 */
export function getCloudinaryUrl(
  publicId: string,
  options?: {
    width?: number;
    height?: number;
    quality?: 'auto' | 'low' | 'high';
    crop?: 'fill' | 'fit' | 'scale';
  }
): string {
  const { width, height, quality = 'auto', crop = 'fill' } = options || {};

  let url = `https://res.cloudinary.com/${cloudinaryConfig.cloudName}/image/upload`;

  const transforms: string[] = [];
  if (width) transforms.push(`w_${width}`);
  if (height) transforms.push(`h_${height}`);
  if (width && height) transforms.push(`c_${crop}`);
  transforms.push(`q_${quality}`);

  if (transforms.length > 0) {
    url += `/${transforms.join(',')}`;
  }

  url += `/${publicId}`;

  return url;
}
