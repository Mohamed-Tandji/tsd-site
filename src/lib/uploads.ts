import "server-only";
import { randomUUID } from "node:crypto";
import { mkdir, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

// Dossier persistant des images téléversées (volume Docker en production)
export const UPLOAD_DIR = path.resolve(process.env.UPLOAD_DIR || path.join(process.cwd(), "uploads"));
export const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;
export const MEDIA_NAME = /^[a-f0-9-]{36}\.(jpg|png|webp)$/;

const FORMATS = { jpeg: "jpg", png: "png", webp: "webp" } as const;
const MAX_SIDE = 2400;

export class UploadError extends Error {}

// Vérifie le contenu réel (pas seulement l'extension), retire les métadonnées (EXIF, GPS),
// réduit les très grandes images et enregistre sous un nom aléatoire. Retourne l'URL /media/…
export async function saveImage(file: File) {
  if (file.size === 0) throw new UploadError("Fichier vide.");
  if (file.size > MAX_UPLOAD_BYTES) throw new UploadError("Image trop lourde (5 Mo maximum).");

  const input = Buffer.from(await file.arrayBuffer());
  let format: keyof typeof FORMATS;
  try {
    const meta = await sharp(input).metadata();
    if (!meta.format || !(meta.format in FORMATS)) throw new Error();
    format = meta.format as keyof typeof FORMATS;
  } catch {
    throw new UploadError("Format non accepté : JPG, PNG ou WebP uniquement.");
  }

  const image = sharp(input).rotate().resize({ width: MAX_SIDE, height: MAX_SIDE, fit: "inside", withoutEnlargement: true });
  const output =
    format === "jpeg" ? await image.jpeg({ quality: 85, mozjpeg: true }).toBuffer()
    : format === "png" ? await image.png({ compressionLevel: 9 }).toBuffer()
    : await image.webp({ quality: 85 }).toBuffer();

  const name = `${randomUUID()}.${FORMATS[format]}`;
  await mkdir(UPLOAD_DIR, { recursive: true });
  await writeFile(path.join(UPLOAD_DIR, name), output);
  return `/media/${name}`;
}

// Supprime un fichier téléversé (ignore les images fournies avec le site, hors /media)
export async function deleteUpload(url: string | null | undefined) {
  const name = url?.startsWith("/media/") ? url.slice("/media/".length) : null;
  if (!name || !MEDIA_NAME.test(name)) return;
  await unlink(path.join(UPLOAD_DIR, name)).catch(() => {});
}

// Champ fichier d'un formulaire : null si aucun fichier choisi
export function fileFrom(formData: FormData, name: string) {
  const value = formData.get(name);
  return value instanceof File && value.size > 0 ? value : null;
}
