import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Parse a contact string and return a structured link.
 * Detects WhatsApp numbers, phone numbers, and Instagram handles.
 */
export function parseContact(contact: string): { type: 'whatsapp' | 'phone' | 'instagram' | 'text'; label: string; href: string } {
  if (!contact) return { type: 'text', label: '-', href: '#' };

  const trimmed = contact.trim();

  // Instagram handle detection
  if (trimmed.startsWith('@') || trimmed.toLowerCase().includes('instagram') || trimmed.toLowerCase().includes('ig:')) {
    const handle = trimmed.replace(/^@/, '').replace(/^(ig:|instagram[:\s]*)/i, '').trim().replace(/^@/, '');
    return {
      type: 'instagram',
      label: `@${handle}`,
      href: `https://instagram.com/${handle}`
    };
  }

  // Phone/WhatsApp number detection
  const phoneMatch = trimmed.match(/[\d\s+\-()]{8,}/);
  if (phoneMatch) {
    let digits = phoneMatch[0].replace(/[^\d+]/g, '');
    // Normalize Indonesian numbers
    if (digits.startsWith('0')) {
      digits = '62' + digits.slice(1);
    } else if (digits.startsWith('+')) {
      digits = digits.slice(1);
    }
    return {
      type: 'whatsapp',
      label: trimmed,
      href: `https://wa.me/${digits}`
    };
  }

  return { type: 'text', label: trimmed, href: '#' };
}

/**
 * Format a timestamp string into a readable Indonesian date.
 */
export function formatDate(timestamp: string): string {
  if (!timestamp) return '';
  try {
    const date = new Date(timestamp);
    if (isNaN(date.getTime())) return timestamp;
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  } catch {
    return timestamp;
  }
}

/**
 * Truncate text to a specified length.
 */
export function truncateText(text: string, maxLength: number = 150): string {
  if (!text || text.length <= maxLength) return text;
  return text.slice(0, maxLength).trimEnd() + '...';
}
