import { useAtomValue } from "jotai";
import { Card, CardContent, CardHeader } from "./ui/card";
import { songsAtom } from "@/App";
import * as spotify from "spotify-web-sdk";

interface Props {
  id: string;
  correctGuess: boolean;
}

export default function SongCard({ id, correctGuess }: Props) {
  const songs = useAtomValue(songsAtom);

  const song = songs.find((x) => x.id === id);

  if (!song) {
    return "no song";
  }

  const { album, id: trackId } = song.songLore.track;
  const imgUrl = album.images[0].url;

  // const playTrack = async () => {
  //   console.log("on click");
  //   const result = await spotify.getTrack(trackId);
  //   console.log({ result });
  //   await spotify.startUserPlayback({ uris: [result.uri] });
  //   const audioAnalysis = await spotify.getAudioAnalysisForTrack(trackId);
  //   console.log({ audioAnalysis });
  // };

  const imgClassName = !imgUrl ? "w-48 h-48 " : "w-48 h-48 bg-gray-300 ";
  const finalClassName = `${imgClassName} ${correctGuess ? "" : "blur"}`;
  return (
    <Card>
      <CardHeader>
        {/* <CardTitle>{title}</CardTitle>
        <CardDescription>{artist}</CardDescription> */}
      </CardHeader>
      <CardContent className="flex flex-col gap-5 items-center">
        <img className={finalClassName} src={imgUrl} alt="Some picture" />
        <audio controls>
          <source src={song.songLore.track.preview_url} type="audio/mpeg" />
          Your browser does not support the audio element.
        </audio>
      </CardContent>
    </Card>
  );
}
