import cloudinary from "../config/cloudinary.js";

const uploadCloudinaryImage = (buffer, foldername) => {
  return new Promise((resolve, reject) => {
    console.log("========== CLOUDINARY UPLOAD ==========");
    console.log("Buffer size:", buffer?.length);
    console.log("Folder:", foldername);

    if (!buffer) {
      return reject(new Error("Image buffer is missing"));
    }

    if (!foldername) {
      return reject(new Error("Cloudinary folder is missing"));
    }

    const stream = cloudinary.uploader.upload_stream(
      {
        folder: foldername,
        resource_type: "image",
      },
      (error, result) => {
        console.log("========== CLOUDINARY RESPONSE ==========");

        if (error) {
          console.error("Cloudinary error:", error);
          return reject(error);
        }

        console.log("Cloudinary result:", result);
        console.log("Public ID:", result.public_id);
        console.log("Secure URL:", result.secure_url);
        console.log("Folder:", result.asset_folder);

        resolve(result);
      }
    );

    stream.on("error", (error) => {
      console.error("Upload stream error:", error);
      reject(error);
    });

    stream.on("finish", () => {
      console.log("Cloudinary upload stream finished");
    });

    console.log("Upload stream created");

    stream.end(buffer);
  });
};

export default uploadCloudinaryImage;