import cloudinary from "../config/cloudinary.js";

const deleteCloudinaryImage = async (publicId) => {
  return await cloudinary.uploader.destroy(publicId);
};

export default deleteCloudinaryImage;
