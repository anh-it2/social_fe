"use client";

import { Button, Empty, Image as AntImage, Input, Spin } from "antd";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import {
  fetchTrendingGifs,
  HAS_GIPHY_KEY,
  searchGifs,
  type GiphyGif,
} from "../../lib/giphy";

interface GifPickerProps {
  onPick: (url: string) => void;
}

export function GifPicker({ onPick }: GifPickerProps) {
  const t = useTranslations("Chat.gifPicker");
  const [query, setQuery] = useState("");
  const [gifs, setGifs] = useState<GiphyGif[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!HAS_GIPHY_KEY) {
      setError(t("errorMissingKey"));
      return;
    }
    let cancelled = false;
    setLoading(true);

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      try {
        const data = query.trim()
          ? await searchGifs(query)
          : await fetchTrendingGifs();
        if (!cancelled) setGifs(data);
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Failed");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }, 300);

    return () => {
      cancelled = true;
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query, t]);

  return (
    <div className="flex w-[340px] flex-col gap-3 p-3">
      <Input
        placeholder={t("placeholder")}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        allowClear
        autoFocus
      />
      <div className="h-[320px] overflow-y-auto">
        {error ? (
          <Empty description={error} />
        ) : loading ? (
          <div className="flex h-full items-center justify-center">
            <Spin />
          </div>
        ) : gifs.length === 0 ? (
          <Empty description={t("noResults")} />
        ) : (
          <div className="grid grid-cols-2 gap-2">
            {gifs.map((g) => (
              <Button
                key={g.id}
                type="text"
                onClick={() => onPick(g.fullUrl)}
                className="!h-[120px] !w-full !overflow-hidden !rounded-lg !p-0 !bg-[var(--color-bg-tertiary)]"
              >
                <AntImage
                  src={g.previewUrl}
                  alt={g.title}
                  preview={false}
                  loading="lazy"
                  classNames={{
                    root: "!block !h-full !w-full",
                    image: "!block !h-[120px] !w-full !object-cover",
                  }}
                />
              </Button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
