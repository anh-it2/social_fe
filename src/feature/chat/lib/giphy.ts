const API = "https://api.giphy.com/v1/gifs";
const KEY = process.env.NEXT_PUBLIC_GIPHY_API_KEY ?? "";

export interface GiphyGif {
  id: string;
  title: string;
  previewUrl: string;
  fullUrl: string;
  width: number;
  height: number;
}

interface RawGif {
  id: string;
  title: string;
  images: {
    fixed_height: { url: string; width: string; height: string };
    original: { url: string };
  };
}

function mapGif(g: RawGif): GiphyGif {
  return {
    id: g.id,
    title: g.title,
    previewUrl: g.images.fixed_height.url,
    fullUrl: g.images.original.url,
    width: Number(g.images.fixed_height.width),
    height: Number(g.images.fixed_height.height),
  };
}

export async function fetchTrendingGifs(limit = 24): Promise<GiphyGif[]> {
  if (!KEY) return [];
  const res = await fetch(
    `${API}/trending?api_key=${KEY}&limit=${limit}&rating=pg-13`,
  );
  if (!res.ok) throw new Error("Giphy trending failed");
  const json = (await res.json()) as { data: RawGif[] };
  return json.data.map(mapGif);
}

export async function searchGifs(
  query: string,
  limit = 24,
): Promise<GiphyGif[]> {
  if (!KEY || !query.trim()) return [];
  const res = await fetch(
    `${API}/search?api_key=${KEY}&q=${encodeURIComponent(query)}&limit=${limit}&rating=pg-13`,
  );
  if (!res.ok) throw new Error("Giphy search failed");
  const json = (await res.json()) as { data: RawGif[] };
  return json.data.map(mapGif);
}

export const HAS_GIPHY_KEY = Boolean(KEY);
