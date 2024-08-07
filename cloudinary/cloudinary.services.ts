import { UploadApiOptions, upload } from "cloudinary-react-native";
import cloudinary from "./cloudinary.config";
import { CLOUDINARY_UNSIGNED_PRESET } from "./cloudinary.constants";

const uploadImage = async ({ fnToRn, folderName, imagePath }: { imagePath: string, folderName: string, fnToRn: (path: string) => void }) => {
    const options: UploadApiOptions = {
        upload_preset: CLOUDINARY_UNSIGNED_PRESET,
        unsigned: true,
        folder: folderName
    }

    await upload(cloudinary, {
        file: imagePath, options: options, callback: (error: any, response: any) => {
            if (response) fnToRn(response?.secure_url);
        }
    });
}

const CloudinaryServices = {
    uploadImage
}

export default CloudinaryServices;