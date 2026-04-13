import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import {
  addBikeImage,
  createBike,
  deleteBike,
  deleteBikeImage,
  getBike,
  listBikes,
  updateBike,
} from '../controllers/bikeController.js';
import { protect } from '../middleware/auth.js';

const router = Router();
const isDevelopment = process.env.NODE_ENV === 'development';

const uploadsDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = isDevelopment
  ? multer.diskStorage({
      destination: function (req, file, cb) {
        cb(null, uploadsDir);
      },
      filename: function (req, file, cb) {
        const ext = path.extname(file.originalname);
        const base = path.basename(file.originalname, ext).replace(/\s+/g, '-');
        cb(null, `${Date.now()}-${base}${ext}`);
      },
    })
  : multer.memoryStorage();

const upload = multer({
  storage,
  limits: { fileSize: 8 * 1024 * 1024 },
});

router.get('/', listBikes);
router.get('/:id', getBike);
router.post('/', protect, createBike);
router.put('/:id', protect, updateBike);
router.delete('/:id', protect, deleteBike);
router.post('/:id/images', protect, upload.single('file'), addBikeImage);
router.delete('/:id/images/:imagePath(*)', protect, deleteBikeImage);

export default router;
