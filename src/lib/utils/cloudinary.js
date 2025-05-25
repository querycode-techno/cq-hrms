// src/lib/utils/cloudinary.js
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Upload file to Cloudinary
 * @param {File|string} file - File object or base64 string
 * @param {Object} options - Upload options
 * @returns {Promise<Object>} Upload result
 */
export const uploadToCloudinary = async (file, options = {}) => {
  try {
    const {
      folder = 'cqams', // Default folder
      transformation = {},
      resourceType = 'auto',
      ...otherOptions
    } = options;

    let fileData;
    
    // Handle File object
    if (file instanceof File) {
      const buffer = await file.arrayBuffer();
      fileData = `data:${file.type};base64,${Buffer.from(buffer).toString('base64')}`;
    } else if (typeof file === 'string') {
      // Handle base64 string or URL
      fileData = file;
    } else {
      throw new Error('Invalid file format');
    }

    const uploadOptions = {
      folder,
      resource_type: resourceType,
      transformation,
      ...otherOptions
    };

    const result = await cloudinary.uploader.upload(fileData, uploadOptions);
    
    return {
      success: true,
      data: {
        public_id: result.public_id,
        secure_url: result.secure_url,
        url: result.url,
        width: result.width,
        height: result.height,
        format: result.format,
        resource_type: result.resource_type,
        bytes: result.bytes,
        created_at: result.created_at
      }
    };
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Upload multiple files to Cloudinary
 * @param {File[]} files - Array of File objects
 * @param {Object} options - Upload options
 * @returns {Promise<Object[]>} Array of upload results
 */
export const uploadMultipleToCloudinary = async (files, options = {}) => {
  try {
    const uploadPromises = files.map(file => uploadToCloudinary(file, options));
    const results = await Promise.all(uploadPromises);
    return results;
  } catch (error) {
    console.error('Multiple upload error:', error);
    return [];
  }
};

/**
 * Delete file from Cloudinary
 * @param {string} publicId - Public ID of the file to delete
 * @param {string} resourceType - Resource type (image, video, raw)
 * @returns {Promise<Object>} Delete result
 */
export const deleteFromCloudinary = async (publicId, resourceType = 'image') => {
  try {
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType
    });
    
    return {
      success: result.result === 'ok',
      data: result
    };
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Generate optimized image URL
 * @param {string} publicId - Public ID of the image
 * @param {Object} transformations - Image transformations
 * @returns {string} Optimized image URL
 */
export const getOptimizedImageUrl = (publicId, transformations = {}) => {
  const {
    width,
    height,
    crop = 'auto',
    quality = 'auto',
    format = 'auto',
    ...otherTransforms
  } = transformations;

  return cloudinary.url(publicId, {
    width,
    height,
    crop,
    quality,
    format,
    ...otherTransforms
  });
};

/**
 * Upload profile image with specific transformations
 * @param {File} file - Image file
 * @param {string} userId - User ID for folder organization
 * @returns {Promise<Object>} Upload result
 */
export const uploadProfileImage = async (file, userId) => {
  return uploadToCloudinary(file, {
    folder: `cqams/profiles/${userId}`,
    transformation: {
      width: 400,
      height: 400,
      crop: 'fill',
      gravity: 'face',
      quality: 'auto',
      format: 'auto'
    },
    overwrite: true,
    unique_filename: false,
    use_filename: true
  });
};

/**
 * Upload document with specific settings
 * @param {File} file - Document file
 * @param {string} employeeId - Employee ID for folder organization
 * @param {string} documentType - Type of document
 * @returns {Promise<Object>} Upload result
 */
export const uploadDocument = async (file, employeeId, documentType) => {
  return uploadToCloudinary(file, {
    folder: `cqams/documents/${employeeId}/${documentType}`,
    resource_type: 'auto',
    use_filename: true,
    unique_filename: true
  });
};

/**
 * Upload attendance punch image
 * @param {File} file - Image file
 * @param {string} employeeId - Employee ID
 * @param {string} type - 'punch-in' or 'punch-out'
 * @returns {Promise<Object>} Upload result
 */
export const uploadAttendanceImage = async (file, employeeId, type) => {
  const timestamp = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  
  return uploadToCloudinary(file, {
    folder: `cqams/attendance/${employeeId}/${timestamp}/${type}-${Date.now()}`,
    transformation: {
      width: 800,
      height: 600,
      crop: 'limit',
      quality: 'auto',
      format: 'auto'
    },
    public_id: `${type}-${Date.now()}`,
    overwrite: false
  });
};

export default cloudinary;