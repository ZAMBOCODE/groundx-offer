/* imageCompress.ts — Samy 2026-06-02.
 *
 * DevPanel image overrides are stored as base64 data-URIs in localStorage
 * (and saved to the AETHER backend as part of the "look"). Raw uploads were
 * ~500KB+ each, so a handful blew the browser's ~5MB localStorage quota — new
 * images then silently failed to persist ("ich drück speichern, geht nicht").
 *
 * We downscale + re-encode every uploaded image to a sane max dimension and
 * WebP quality, which brings each one down to ~80-200KB. Existing oversized
 * overrides get the same treatment via a one-time migration on load.
 */

const DEFAULT_MAX_DIM = 1600;
const DEFAULT_QUALITY = 0.82;

/** Downscale + compress a data-URL. Resolves the original on any failure. */
export function downscaleDataUrl(
  src: string,
  maxDim = DEFAULT_MAX_DIM,
  quality = DEFAULT_QUALITY,
): Promise<string> {
  return new Promise((resolve) => {
    if (typeof document === "undefined" || !src.startsWith("data:image")) {
      resolve(src);
      return;
    }
    const img = new Image();
    img.onload = () => {
      try {
        let { width, height } = img;
        const longest = Math.max(width, height);
        if (longest > maxDim) {
          const s = maxDim / longest;
          width = Math.round(width * s);
          height = Math.round(height * s);
        }
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve(src);
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        const webp = canvas.toDataURL("image/webp", quality);
        const out = webp.startsWith("data:image/webp")
          ? webp
          : canvas.toDataURL("image/jpeg", quality);
        // Keep whichever is actually smaller (tiny images may grow when re-encoded).
        resolve(out.length < src.length ? out : src);
      } catch {
        resolve(src);
      }
    };
    img.onerror = () => resolve(src);
    img.src = src;
  });
}

/** Read a File and return a downscaled+compressed data-URL. */
export async function fileToCompressedDataUrl(
  file: File,
  maxDim = DEFAULT_MAX_DIM,
  quality = DEFAULT_QUALITY,
): Promise<string> {
  const dataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error("read failed"));
    reader.readAsDataURL(file);
  });
  return downscaleDataUrl(dataUrl, maxDim, quality);
}

/** Approx byte size of a data-URL string (1 char ≈ 1 byte for base64 ASCII). */
export function dataUrlBytes(s: string): number {
  return s.length;
}
