import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { diskStorage } from 'multer';
import { join } from 'path';

export const multerConfig: MulterOptions = {
  limits: {
    fieldSize: 10 * 1024 * 1024,
  },
  storage: diskStorage({
    destination: join(__dirname, '..', 'public'),
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const originalName = file.originalname.replace(/\s+/g, '-');
      cb(null, uniqueSuffix + '-' + originalName + '-test');
    },
  }),
};
