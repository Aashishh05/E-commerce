import cloudinary from "../config/cloudinary.js";

const uploadCloudinaryImage = (buffer, foldername) => {
  return new Promise((resolve, reject) => {
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
        if (error) {
          console.error("Cloudinary error:", error);
          return reject(error);
        }

        resolve(result);
      },
    );

    stream.on("error", (error) => {
      console.error("Upload stream error:", error);
      reject(error);
    });

    stream.on("finish", () => {
      console.log("Cloudinary upload stream finished");
    });

    stream.end(buffer);
  });
};

export default uploadCloudinaryImage;
