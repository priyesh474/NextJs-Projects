import { mkdir, writeFile } from "fs/promises";
import path from "path";

export async function POST(req) {
  const data = await req.formData();
  const file = data.get("file");

  if (!file) {
    return Response.json({ error: "No file uploaded" }, { status: 400 });
  }

  // Basic validation (avoid writing unexpected payloads)
  const allowed = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);
  if (!allowed.has(file.type)) {
    return Response.json(
      { error: "Only image files are allowed (jpg, png, webp, gif)" },
      { status: 400 }
    );
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const safeName = String(file.name || "upload")
    .replace(/[^a-zA-Z0-9.\-_]/g, "_")
    .slice(0, 80);

  const fileName = `${Date.now()}-${safeName}`;
  const uploadDir = path.join(process.cwd(), "public/uploads/blog-images");
  const uploadPath = path.join(uploadDir, fileName);

  await mkdir(uploadDir, { recursive: true });

  await writeFile(uploadPath, buffer);

  return Response.json({
    imageUrl: `/uploads/blog-images/${fileName}`,
  });
}
