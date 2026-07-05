import cloudinary from "../config/cloudinary.js";

const UploadToCloudinary = async (filepath) => {
  try {
    const result = await cloudinary.uploader.upload(filepath, {
      folder: "Blog",
    });

    return {
      url: result.secure_url,
      public_id: result.public_id,
    };
  } catch (error) {
    throw new Error(error.message);
  }
};

export default UploadToCloudinary;
