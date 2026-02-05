const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME as string | undefined;
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET as string | undefined;
const CLOUDINARY_BASE_URL = import.meta.env.VITE_VITE_CLOUDINARY_BASE_URL as string | undefined;

export interface CloudinaryUploadResponse {
  secure_url: string;
  [key: string]: unknown;
}

/**
 * Uploads an image file to Cloudinary using unsigned upload.
 * Requires VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET in .env.
 * Create an unsigned upload preset in Cloudinary Dashboard: Settings > Upload > Upload presets.
 */
export async function uploadImageToCloudinary(file: File): Promise<CloudinaryUploadResponse> {
  if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_UPLOAD_PRESET) {
    throw new Error(
      "Cloudinary is not configured. Set VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET in .env"
    );
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

  // const url = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;
  const url = `${CLOUDINARY_BASE_URL}${CLOUDINARY_CLOUD_NAME}/image/upload`;
  const response = await fetch(url, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const err = (await response.json().catch(() => ({}))) as { error?: { message?: string } };
    throw new Error(err?.error?.message ?? `Upload failed (${response.status})`);
  }

  const data = (await response.json()) as CloudinaryUploadResponse;
  if (!data.secure_url) {
    throw new Error("Invalid response: missing secure_url");
  }
  return data;
}
