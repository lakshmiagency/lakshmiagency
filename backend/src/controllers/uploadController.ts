import { Request, Response } from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import path from 'path';

// Set up Multer memory storage
const storage = multer.memoryStorage();
export const uploadMiddleware = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // Limit to 5MB
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|webp|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
      cb(null, true);
    } else {
      cb(new Error('Only images (JPEG, JPG, PNG, WEBP, GIF) are allowed.'));
    }
  }
});

// Configure Cloudinary if credentials are provided
const isCloudinaryConfigured = 
  process.env.CLOUDINARY_CLOUD_NAME && 
  process.env.CLOUDINARY_API_KEY && 
  process.env.CLOUDINARY_API_SECRET;

if (isCloudinaryConfigured) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });
  console.log('Cloudinary initialized for image uploads.');
} else {
  console.log('Cloudinary credentials missing. Using local storage for uploads.');
}

export const uploadImage = async (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded.' });
  }

  try {
    if (isCloudinaryConfigured) {
      // Upload to Cloudinary using a stream
      const uploadStream = () => {
        return new Promise<string>((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: 'lakshmi_agency' },
            (error, result) => {
              if (error) return reject(error);
              resolve(result?.secure_url || '');
            }
          );
          stream.end(req.file!.buffer);
        });
      };

      const imageUrl = await uploadStream();
      return res.json({ url: imageUrl, storage: 'cloudinary' });
    } else {
      // Fallback: Save locally
      const uploadDir = path.join(__dirname, '../../public/uploads');
      
      // Ensure folder exists
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      // Generate unique name
      const fileExt = path.extname(req.file.originalname).toLowerCase();
      const fileName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${fileExt}`;
      const filePath = path.join(uploadDir, fileName);

      // Write buffer to file
      fs.writeFileSync(filePath, req.file.buffer);

      // Return local URL path
      // The Express server should serve 'public' directory statically as '/'
      const localUrl = `/uploads/${fileName}`;
      return res.json({ url: localUrl, storage: 'local' });
    }
  } catch (error: any) {
    console.error('Upload error:', error);
    res.status(500).json({ message: 'Image upload failed.', error: error.message });
  }
};
