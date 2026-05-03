import { promises as fs } from "fs";
import path from "path";
import { NextResponse } from "next/server";

const uploadsDir = path.join(process.cwd(), "public", "uploads");
const maxFiles = 9;
const maxSizeBytes = 5 * 1024 * 1024;
const cloudinaryCloudName = process.env.CLOUDINARY_CLOUD_NAME?.trim();
const cloudinaryUploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET?.trim();
const cloudinaryFolder = process.env.CLOUDINARY_FOLDER?.trim() || "zazzo";

function sanitizeBaseName(name: string) {
  return name
    .replace(/\.[^/.]+$/, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
}

function extensionFrom(file: File) {
  const byName = file.name.split(".").pop()?.toLowerCase();
  if (byName) {
    return byName;
  }

  const byType = file.type.split("/").pop()?.toLowerCase();
  return byType || "jpg";
}

function validateFiles(files: File[]) {
  if (!files.length) {
    throw new Error("No files received.");
  }

  if (files.length > maxFiles) {
    throw new Error("You can upload up to 9 images at a time.");
  }

  files.forEach((file) => {
    if (!file.type.startsWith("image/")) {
      throw new Error("Only image files are allowed.");
    }

    if (file.size > maxSizeBytes) {
      throw new Error("Each image must be 5MB or smaller.");
    }
  });
}

async function uploadToCloudinary(files: File[]) {
  if (!cloudinaryCloudName || !cloudinaryUploadPreset) {
    throw new Error("Cloudinary is not configured.");
  }

  const urls = await Promise.all(
    files.map(async (file) => {
      const payload = new FormData();
      payload.append("file", file);
      payload.append("upload_preset", cloudinaryUploadPreset);
      payload.append("folder", cloudinaryFolder);

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudinaryCloudName}/image/upload`,
        {
          method: "POST",
          body: payload
        }
      );

      const data = (await response.json()) as { secure_url?: string; error?: { message?: string } };
      if (!response.ok || !data.secure_url) {
        throw new Error(data.error?.message || "Cloud image upload failed.");
      }

      return data.secure_url;
    })
  );

  return urls;
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const files = formData
      .getAll("files")
      .filter((entry): entry is File => entry instanceof File);

    validateFiles(files);

    if (cloudinaryCloudName && cloudinaryUploadPreset) {
      const urls = await uploadToCloudinary(files);
      return NextResponse.json({ urls });
    }

    if (process.env.VERCEL) {
      throw new Error(
        "Direct file upload is disabled on deployed serverless hosting. Set CLOUDINARY_CLOUD_NAME and CLOUDINARY_UPLOAD_PRESET to enable production uploads."
      );
    }

    await fs.mkdir(uploadsDir, { recursive: true });

    const uploadedUrls = await Promise.all(
      files.map(async (file, index) => {
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const baseName = sanitizeBaseName(file.name) || `image-${index + 1}`;
        const filename = `${Date.now()}-${index}-${baseName}.${extensionFrom(file)}`;
        const filepath = path.join(uploadsDir, filename);

        await fs.writeFile(filepath, buffer);
        return `/uploads/${filename}`;
      })
    );

    return NextResponse.json({ urls: uploadedUrls });
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Upload failed." },
      { status: 400 }
    );
  }
}
