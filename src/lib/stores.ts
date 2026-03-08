import { writable, derived, get } from 'svelte/store';
import { fetchTechnicians, normalizeArea, type Technician } from './sheets';

// ---------- Core stores ----------
export const technicians = writable<Technician[]>([]);
export const searchQuery = writable<string>('');
export const selectedArea = writable<string>('');
export const selectedRole = writable<string>('');
export const loading = writable<boolean>(true);
export const error = writable<string>('');

// ---------- Derived: filtered technicians ----------
export const filteredTechnicians = derived(
  [technicians, searchQuery, selectedArea, selectedRole],
  ([$technicians, $searchQuery, $selectedArea, $selectedRole]) => {
    let result = $technicians;

    // Filter by search query (searches name, area, contact, review)
    if ($searchQuery.trim()) {
      const q = $searchQuery.toLowerCase().trim();
      result = result.filter(
        (tech) =>
          tech.technicianName.toLowerCase().includes(q) ||
          tech.area.toLowerCase().includes(q) ||
          tech.contact.toLowerCase().includes(q) ||
          tech.review.toLowerCase().includes(q) ||
          tech.username.toLowerCase().includes(q)
      );
    }

    // Filter by area
    if ($selectedArea) {
      result = result.filter((tech) =>
        tech.area.toLowerCase().includes($selectedArea.toLowerCase())
      );
    }

    // Filter by role
    if ($selectedRole) {
      result = result.filter((tech) => tech.role === $selectedRole);
    }

    return result;
  }
);

// ---------- Derived: statistics ----------
export const stats = derived(technicians, ($technicians) => {
  const uniqueAreas = new Set<string>();
  $technicians.forEach((tech) => {
    if (tech.area) {
      tech.area.split(/[,;&\/]+/).forEach((a) => {
        const normalized = normalizeArea(a);
        if (normalized) uniqueAreas.add(normalized);
      });
    }
  });

  const reviewCount = $technicians.filter((t) => t.review && t.review.trim().length > 0).length;

  // Calculate year range
  let minYear = 9999;
  let maxYear = 0;
  $technicians.forEach((tech) => {
    if (tech.timestamp) {
      try {
        const year = new Date(tech.timestamp).getFullYear();
        if (!isNaN(year)) {
          if (year < minYear) minYear = year;
          if (year > maxYear) maxYear = year;
        }
      } catch {
        // ignore
      }
    }
  });

  const yearRange = maxYear > 0 ? (minYear === maxYear ? `${maxYear}` : `${minYear}-${maxYear}`) : '-';

  return {
    totalTechnicians: $technicians.length,
    totalReviews: reviewCount,
    totalAreas: uniqueAreas.size,
    yearRange
  };
});

// ---------- Derived: unique filter options ----------
export const uniqueAreas = derived(technicians, ($technicians) => {
  const areas = new Set<string>();
  $technicians.forEach((tech) => {
    if (tech.area) {
      tech.area.split(/[,;&\/]+/).forEach((a) => {
        const trimmed = a.trim();
        if (trimmed) areas.add(trimmed);
      });
    }
  });
  return Array.from(areas).sort((a, b) => a.localeCompare(b, 'id'));
});

export const uniqueRoles = derived(technicians, ($technicians) => {
  const roles = new Set<string>();
  $technicians.forEach((tech) => {
    if (tech.role) roles.add(tech.role);
  });
  return Array.from(roles).sort();
});

// ---------- Data initialization ----------
let refreshInterval: ReturnType<typeof setInterval> | null = null;

export async function initData(): Promise<void> {
  loading.set(true);
  error.set('');

  try {
    const data = await fetchTechnicians();
    technicians.set(data);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Gagal memuat data teknisi';
    error.set(message);
    console.error('Failed to load technicians:', err);
  } finally {
    loading.set(false);
  }

  // Auto-refresh every 5 minutes
  if (refreshInterval) clearInterval(refreshInterval);
  refreshInterval = setInterval(async () => {
    try {
      const data = await fetchTechnicians();
      technicians.set(data);
    } catch (err) {
      console.error('Auto-refresh failed:', err);
    }
  }, 5 * 60 * 1000);
}

/** Reset all filters to default state. */
export function resetFilters(): void {
  searchQuery.set('');
  selectedArea.set('');
  selectedRole.set('');
}

/** Cleanup interval on destroy. */
export function destroyStores(): void {
  if (refreshInterval) {
    clearInterval(refreshInterval);
    refreshInterval = null;
  }
}
