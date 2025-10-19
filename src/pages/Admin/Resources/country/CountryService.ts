export interface Country {
  id?: number;
  name: string;
  country_code: string;
  currency: string;
}

export async function getCountries(): Promise<Country[]> {
  const res = await fetch("/api/country");
  if (!res.ok) throw new Error("Failed to fetch countries");
  return res.json();
}

export async function addCountry(country: Country) {
  const res = await fetch("/api/country", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(country),
  });
  if (!res.ok) throw new Error((await res.json()).message || "Failed to add country");
  return res.json();
}

export async function updateCountry(id: number, country: Country) {
  if (!id) throw new Error("Invalid country id");
  const res = await fetch(`/api/country/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: country.name, country_code: country.country_code, currency: country.currency }),
  });
  if (!res.ok) throw new Error((await res.json()).message || "Failed to update country");
  return res.json();
}

export async function deleteCountry(id: number) {
  if (!id) throw new Error("Invalid country id");
  const res = await fetch(`/api/country/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error((await res.json()).message || "Failed to delete country");
  return res.json();
}
