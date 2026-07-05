import { Router } from 'express';
import { upload } from '../middleware/upload.js';
import { protect } from '../middleware/auth.js';
import { uploadToCloudinary } from '../utils/cloudinary.js';

const router = Router();

router.post('/', protect, upload.single('file'), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file provided' });
    }

    const result = await uploadToCloudinary(req.file.buffer, {
      public_id: `${Date.now()}-${req.file.originalname.replace(/\s/g, '_')}`,
    });

    res.json({
      success: true,
      file: {
        url: result.secure_url,
        publicId: result.public_id,
        format: result.format,
        bytes: result.bytes,
      },
    });
  } catch (err) {
    next(err);
  }
});

export default router;
