import { AdvancedImage } from "cloudinary-react-native";
import cloudinary from "./cloudinary.config";
import { ImageStyle } from "expo-image";


function CloudinaryImage({ styles, }: { styles: ImageStyle | ImageStyle[], img?: string }) {
    let img = cloudinary.image('sample')

    return (
        <AdvancedImage cldImg={img} style={styles} />
    )
}

export default CloudinaryImage;

// The uploaded image is assigned a randomly generated public ID, which is returned as part of the response object.The image is immediately available for download through a CDN:

// cloudinary.image().generate("generatedPublicId")

// http://res.cloudinary.com/<your cloud>/image/upload/generatedPublicId.jpg