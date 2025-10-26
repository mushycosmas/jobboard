export interface Country {
  id?: number;
  name: string;
  country_code: string;
  currency: string;
}

export interface Region {
  id?: number;
  region_name: string;
  country_id: number;
}

// Countries
export async function getCountries(): Promise<Country[]> {
  const res = await fetch("/api/country");
  if (!res.ok) throw new Error("Failed to fetch countries");
  return res.json();
}

// Regions
export async function getRegionsByCountry(countryId: number): Promise<Region[]> {
  const res = await fetch(`/api/regions?country_id=${countryId}`);
  if (!res.ok) throw new Error("Failed to fetch regions");
  return res.json();
}

export async function addRegion(region: Region) {
  const res = await fetch("/api/regions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(region),
  });
  if (!res.ok) throw new Error((await res.json()).message || "Failed to add region");
  return res.json();
}

export async function updateRegion(id: number, region: Region) {
  const res = await fetch(`/api/regions/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(region),
  });
  if (!res.ok) throw new Error((await res.json()).message || "Failed to update region");
  return res.json();
}

export async function deleteRegion(id: number) {
  const res = await fetch(`/api/regions/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error((await res.json()).message || "Failed to delete region");
  return res.json();
}
