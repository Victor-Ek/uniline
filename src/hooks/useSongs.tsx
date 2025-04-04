import { getAccessToken, Token } from "@/getToken";
import { getPreviewUrls } from "@/request-preview-url";
import { useSuspenseQuery } from "@tanstack/react-query";

let token: Token | null = null;
export interface Song {
  added_at: string;
  added_by: {
    external_urls: { spotify: string };
    href: string;
    id: string;
    type: string;
    uri: string;
  };
  is_local: boolean;
  primary_color: string | null;
  track: {
    album: {
      album_type: string;
      artists: {
        external_urls: { spotify: string };
        href: string;
        id: string;
        name: string;
        type: string;
        uri: string;
      }[];
      available_markets: string[];
      external_urls: { spotify: string };
      href: string;
      id: string;
      images: { height: number; url: string; width: number }[];
      name: string;
      release_date: string;
      release_date_precision: string;
      total_tracks: number;
      type: string;
      uri: string;
    };
    artists: {
      external_urls: { spotify: string };
      href: string;
      id: string;
      name: string;
      type: string;
      uri: string;
    }[];
    available_markets: string[];
    disc_number: number;
    duration_ms: number;
    episode: boolean;
    explicit: boolean;
    external_ids: { isrc: string };
    external_urls: { spotify: string };
    href: string;
    id: string;
    is_local: boolean;
    name: string;
    popularity: number;
    preview_url: string;
    track: boolean;
    track_number: number;
    type: string;
    uri: string;
  };
  video_thumbnail: { url: string | null };
}

export const fetchPlaylist = async () => {
  if (token === null) token = await getAccessToken();

  const result = await fetch(
    "https://api.spotify.com/v1/playlists/2OFfgjs6kj0eA6FNayhAAJ?market=SE",
    {
      headers: {
        Authorization: `Bearer ${token.access_token}`,
      },
    }
  );
  const data = await result.json();

  const randomSong = data.tracks.items[
    Math.floor(Math.random() * data.tracks.items.length)
  ] as Song;
  console.log({ data, randomSong });
  if (!randomSong) {
    throw new Error("randomSong");
  }

  const urlId = randomSong.track.id;
  const url = `/track/${urlId}`;
  const previewUrl = (await getPreviewUrls(url))[0];

  if (!previewUrl) {
    throw new Error("previewUrl");
  }
  randomSong.track.preview_url = previewUrl;
  return { randomSong };
};

export const useSongs = () => {
  const { data } = useSuspenseQuery({
    queryKey: ["songs"],
    queryFn: fetchPlaylist,
  });

  return data;
};
