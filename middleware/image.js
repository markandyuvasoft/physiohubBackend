import multer from "multer";

const imageUpload = multer.diskStorage({
    
  destination: "public/upload",
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpg|jpeg|png|pdf|mp4|mov|avi/;

  const mimeType = allowedTypes.test(file.mimetype);

  if (mimeType) {
    return cb(null, true);
  
} else {
    return cb(
      new Error(
        "Invalid file type. Only .png, .jpg, .jpeg, .pdf, .mp4, .mov, .avi are allowed."
      )
    );
  }
};

export const upload = multer({
  storage: imageUpload,
  fileFilter: fileFilter,
});
