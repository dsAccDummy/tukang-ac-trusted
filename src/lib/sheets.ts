import Papa from 'papaparse';

export interface Technician {
  id: string;
  timestamp: string;
  username: string;
  role: string;
  technicianName: string;
  area: string;
  contact: string;
  review: string;
  testimonial: string;
}

const SPREADSHEET_ID = '1r1UwrOVKUyTTwMkSYNKr6HR29QfKVpdd1Aewcr7WGI0';
const GID = '1858246520';
const CSV_URL = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/export?format=csv&gid=${GID}`;

/**
 * Fetch technician data from the public Google Spreadsheet.
 * Uses CSV export with papaparse for parsing.
 */
export async function fetchTechnicians(): Promise<Technician[]> {
  try {
    const response = await fetch(CSV_URL);

    if (!response.ok) {
      throw new Error(`Failed to fetch spreadsheet: ${response.status} ${response.statusText}`);
    }

    const csvText = await response.text();

    return new Promise((resolve, reject) => {
      Papa.parse(csvText, {
        header: false,
        skipEmptyLines: true,
        complete: (results) => {
          const rows = results.data as string[][];

          // Skip header rows (row 1 = header, row 2 = sub-header); data starts at row 3
          const dataRows = rows.slice(2);

          const technicians: Technician[] = dataRows
            .map((row, index) => ({
              id: `tech-${index}`,
              timestamp: (row[0] || '').trim(),
              username: (row[3] || '').trim(),
              role: (row[4] || '').trim(),
              technicianName: (row[5] || '').trim(),
              area: (row[6] || '').trim(),
              contact: (row[7] || '').trim(),
              review: (row[8] || '').trim(),
              testimonial: (row[9] || '').trim()
            }))
            .filter((tech) => tech.technicianName.length > 0);

          resolve(technicians);
        },
        error: (error: Error) => {
          reject(new Error(`CSV parsing failed: ${error.message}`));
        }
      });
    });
  } catch (error) {
    console.error('Error fetching technicians:', error);
    throw error;
  }
}

/**
 * Normalize an area name: trim, collapse whitespace, and convert to Title Case.
 * This ensures "bekasi", "Bekasi", "BEKASI" all become "Bekasi".
 */
export function normalizeArea(raw: string): string {
  const trimmed = raw.trim().replace(/\s+/g, ' ');
  if (!trimmed) return '';
  return trimmed
    .toLowerCase()
    .replace(/(?:^|\s)\S/g, (match) => match.toUpperCase());
}

/**
 * Extract unique areas from technician data, normalized and sorted alphabetically.
 */
export function getUniqueAreas(technicians: Technician[]): string[] {
  const areas = new Set<string>();
  technicians.forEach((tech) => {
    if (tech.area) {
      const parts = tech.area.split(/[,;&\/]+/).map((a) => normalizeArea(a)).filter(Boolean);
      parts.forEach((part) => areas.add(part));
    }
  });
  return Array.from(areas).sort((a, b) => a.localeCompare(b, 'id'));
}

/**
 * Extract unique roles from technician data.
 */
export function getUniqueRoles(technicians: Technician[]): string[] {
  const roles = new Set<string>();
  technicians.forEach((tech) => {
    if (tech.role) roles.add(tech.role);
  });
  return Array.from(roles).sort();
}
