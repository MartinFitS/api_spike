const cloudinary = require('./cloudinary');

async function uploadImage(imagePath, folder) {
  const result = await cloudinary.uploader.upload(imagePath, {
    folder: `myApp/${folder}`,
  });
  return result.secure_url; 
}

module.exports = {uploadImage}