import { songsAtom } from "@/App";
import { Droppable } from "./droppable";
import SongCard from "./song-card";
import { useAtomValue } from "jotai";

export function DroppableSong({ dropZoneId }: { dropZoneId: string }) {
  const songs = useAtomValue(songsAtom);
  const song = songs.find((x) => x.parentId === dropZoneId);

  return (
    <Droppable id={dropZoneId.toString()}>
      {song && <SongCard id={song.id} />}

      {!song && (
        <div className="flex w-80 h-80 justify-center items-center border-2 border-dashed border-slate-800">
          Drop Here
        </div>
      )}
    </Droppable>
  );
}
