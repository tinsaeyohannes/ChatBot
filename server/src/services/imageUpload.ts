import cloudinary, { UploadApiOptions } from 'cloudinary';

const { CLOUD_NAME, API_KEY, API_SECRET } = process.env;

cloudinary.v2.config({
  cloud_name: CLOUD_NAME,
  api_key: API_KEY,
  api_secret: API_SECRET,
  secure: true,
});

const uploadPicture = (image: string /* userId: string */) => {
  //image = > base64
  const opts1 = {
    overwrite: true,
    invalidate: true,
    resource_type: 'auto',
    folder: `chatbot/temp`,
    transformation: [{ width: 400, height: 400, crop: 'limit' }],
  };

  return new Promise((resolve, reject) => {
    cloudinary.v2.uploader.upload(
      image,
      opts1 as UploadApiOptions,
      (error, result) => {
        if (result && result.secure_url) {
          const publicId = result.public_id; // Retrieve the public ID of the uploaded image
          const secureUrl = result.secure_url; // Retrieve the secure URL of the uploaded image

          console.log(secureUrl);
          // console.log(publicId);

          return resolve({ secureUrl, publicId });
        }

        // console.log(error?.message);
        return reject({ message: error?.message });
      },
    );
  });
};

export { uploadPicture };
