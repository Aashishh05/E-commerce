import cloudinary from "../config/cloudinary.js";
import streamifier from "streamifier";

const UploadToCloudinary = (buffer, folder = "E-commerce") => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder },
      (error, result) => {
        if (error) return reject(error);

        resolve({
          url: result.secure_url,
          public_id: result.public_id,
        });
      },
    );

    streamifier.createReadStream(buffer).pipe(stream);
  });
};

export default UploadToCloudinary;
