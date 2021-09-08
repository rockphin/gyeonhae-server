import Multer from 'multer';

const imageMulter = Multer({
  storage: Multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024,
    files: 1,
  },
  fileFilter: (req, file, cb) => {
    cb(null, ['image/png', 'image/jpg', 'image/jpeg'].includes(file.mimetype));
  },
});

export { imageMulter };
