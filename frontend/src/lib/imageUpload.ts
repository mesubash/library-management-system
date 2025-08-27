// Simple placeholder image utilities for books and profiles
// No actual upload functionality - just returns placeholder URLs

export interface PlaceholderConfig {
  width: number;
  height: number;
  backgroundColor: string;
  textColor: string;
  text: string;
}

// Generate placeholder image URLs for different types
export function getPlaceholderImage(
  type: "profile" | "book-cover",
  identifier?: string
): string {
  if (type === "book-cover") {
    // Different book cover placeholders
    const bookPlaceholders = [
      "https://via.placeholder.com/400x600/1e40af/ffffff?text=📚+Book",
      "https://via.placeholder.com/400x600/7c3aed/ffffff?text=📖+Novel",
      "https://via.placeholder.com/400x600/dc2626/ffffff?text=📕+Guide",
      "https://via.placeholder.com/400x600/059669/ffffff?text=📗+Manual",
      "https://via.placeholder.com/400x600/ea580c/ffffff?text=📘+Story",
      "https://via.placeholder.com/400x600/0891b2/ffffff?text=📙+Text",
    ];

    // Use identifier to consistently return same placeholder for same book
    const index = identifier
      ? Math.abs(
          identifier.split("").reduce((a, b) => a + b.charCodeAt(0), 0)
        ) % bookPlaceholders.length
      : Math.floor(Math.random() * bookPlaceholders.length);

    return bookPlaceholders[index];
  } else {
    // Profile placeholder
    const initials = identifier?.slice(0, 2).toUpperCase() || "U";
    return `https://via.placeholder.com/300x300/4f46e5/ffffff?text=${initials}`;
  }
}

// Legacy function for backward compatibility
export async function uploadImageToR2(
  file: File,
  userId: string,
  uploadType: "profile" | "book-cover" = "profile"
): Promise<{ url?: string; error?: string }> {
  // Simply return a placeholder - no actual upload
  const placeholderUrl = getPlaceholderImage(uploadType, userId);
  return { url: placeholderUrl };
}
