import multer from "multer";

const storage = multer.diskStorage({
  destination: function(request, file, callback) {
    callback(null, 'uploads/');
  },
  filename: function(request, file, callback) {
    callback(null, Date.now().toString() + "_" + file.originalname.replace(/\s/g,''));
  }
});

exports.upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 500
  },
});