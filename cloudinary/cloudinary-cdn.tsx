import { CLOUDINARY_CLOUD_NAME, CLOUDINARY_UNSIGNED_PRESET } from "./cloudinary.constants"

// Constants (replace with your actual values or import from your config)

/**
 * Uploads an image to Cloudinary using the CDN API directly
 * @param params Upload parameters including image path, folder name, and callback
 */
export const uploadImage = async ({
  imagePath,
  folderName,
  fnToRn,
}: {
  imagePath: string
  folderName: string
  fnToRn: (path: string) => void
}) => {
  try {
    // Create form data for the upload
    const formData = new FormData()

    // Get the filename from the path
    const uriParts = imagePath.split("/")
    const fileName = uriParts[uriParts.length - 1]

    // Determine the file type
    const fileType = fileName.split(".").pop()?.toLowerCase() || "jpeg"
    const mimeType = `image/${fileType === "jpg" ? "jpeg" : fileType}`

    // Append the image to the form data
    // @ts-ignore - TypeScript doesn't fully support the Expo/React Native FormData implementation
    formData.append("file", {
      uri: imagePath,
      name: fileName,
      type: mimeType,
    })

    // Add the upload preset (for unsigned uploads)
    formData.append("upload_preset", CLOUDINARY_UNSIGNED_PRESET)

    // Add the folder name if provided
    if (folderName) {
      formData.append("folder", folderName)
    }

    const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, {
      method: "POST",
      body: formData,
      headers: {
        Accept: "application/json",
        "Content-Type": "multipart/form-data",
      },
    })

    // Parse the response
    const data = await response.json()

    if (response.ok) {
      console.log("Upload successful:", data.secure_url)
      // Call the callback with the secure URL
      fnToRn(data.secure_url)
      return data.secure_url
    } else {
      console.error("Upload failed:", data)
      throw new Error(data.error?.message || "Failed to upload image")
    }
  } catch (error) {
    console.error("Error uploading to Cloudinary:", error)
    throw error
  }
}

/**
 * Example of how to initialize and use the upload function
 * This replaces your Cloudinary instance initialization
 */
export const initCloudinaryUpload = () => {
  // No initialization needed for direct CDN uploads
  // Just return the upload function
  return {
    uploadImage,
  }
}
