import { useEffect, useState } from "react";
import "./App.css";
import {
  defaultDropAnimationSideEffects,
  DndContext,
  type DragEndEvent,
  type DragOverEvent,
  DragOverlay,
  type DragStartEvent,
  type DropAnimation,
  type UniqueIdentifier,
} from "@dnd-kit/core";
import { fetchPlaylist, type Song, useSongs } from "./hooks/useSongs";
import { atom, useAtom } from "jotai";
import { arrayMove, SortableContext } from "@dnd-kit/sortable";
import { SortableItem } from "./components/sortable-item";
import SongCard from "./components/song-card";
import { useQuery } from "@tanstack/react-query";

export interface UniSong {
  id: string;
  parentId: string | null;
  songLore: Song;
}

export const songsAtom = atom<UniSong[]>([]);
type Items = Record<UniqueIdentifier, UniqueIdentifier[]>;
const dropAnimation: DropAnimation = {
  sideEffects: defaultDropAnimationSideEffects({
    styles: {
      active: {
        opacity: "0.5",
      },
    },
  }),
};
function App() {
  const [_songs, setSongs] = useAtom(songsAtom);
  const { data, refetch } = useQuery({
    queryKey: ["songs"],
    queryFn: fetchPlaylist,
  });
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);

  const [items, setItems] = useState<Items>({
    current: [],
    results: [],
  });

  const [artist, setArtist] = useState<string>("");
  const [songTitle, setSongTitle] = useState<string>("");
  const [canDrag, setCanDrag] = useState<boolean>(false);

  function handleGuess() {
    if (!data?.randomSong) return;
    // const song = songs.find((x) => x.songLore.track.name === songTitle);
    // Convert user input to lowercase
    const userArtist = artist.toLowerCase();
    const userSongTitle = songTitle.toLowerCase();

    // Get actual artist and song title, convert to lowercase
    const actualArtist = data.randomSong.track.artists[0].name.toLowerCase();
    const actualSongTitle = data.randomSong.track.name.toLowerCase();

    // Remove unwanted substrings like " - 2013 Remastered" from the actual song title
    const cleanActualSongTitle = actualSongTitle
      .replace(/[\s-]*[([{].*[)\]}]/, "")
      .trim();

    // Do the same for the user's song title input (optional, if users might include versions)
    const cleanUserSongTitle = userSongTitle
      .replace(/[\s-]*[([{].*[)\]}]/, "")
      .trim();

    if (
      actualArtist === userArtist ||
      cleanActualSongTitle === cleanUserSongTitle
    ) {
      console.log("correct");
      setCanDrag(true);
      if (items["results"].length === 0) {
        setItems((prev) => ({
          current: [],
          results: [prev["current"][0]],
        }));
      }
    } else {
      console.log(
        "incorrect, correct answer is",
        data?.randomSong.track.artists[0].name,
        data?.randomSong.track.name
      );
    }
  }

  const findContainer = (id: UniqueIdentifier) => {
    if (id in items) {
      return id;
    }

    return Object.keys(items).find((key) => items[key].includes(id.toString()));
  };

  function handleDragStart(event: DragStartEvent) {
    setActiveId(event.active.id);
  }
  function handleDragEnd({ active, over }: DragEndEvent) {
    const activeContainer = findContainer(active.id);

    if (!activeContainer) {
      setActiveId(null);
      return;
    }

    const overId = over?.id;

    if (overId == null) {
      setActiveId(null);
      return;
    }

    const overContainer = findContainer(overId);

    if (overContainer) {
      const activeIndex = items[activeContainer].indexOf(active.id);
      const overIndex = items[overContainer].indexOf(overId);

      if (activeIndex !== overIndex) {
        setItems((items) => ({
          ...items,
          [overContainer]: arrayMove(
            items[overContainer],
            activeIndex,
            overIndex
          ),
        }));
      }
    }

    setActiveId(null);
  }
  function handleDragOver({ over, active, ...rest }: DragOverEvent) {
    const overId = over?.id;

    console.log({ over, active, rest });

    if (overId == null) {
      return;
    }

    const overContainer = findContainer(overId);
    const activeContainer = findContainer(active.id);

    if (!overContainer || !activeContainer) {
      return;
    }
    console.log({ activeContainer, overContainer });

    if (activeContainer !== overContainer) {
      setItems((items) => {
        const activeItems = items[activeContainer];
        const overItems = items[overContainer];
        const overIndex = overItems.indexOf(overId);
        const activeIndex = activeItems.indexOf(active.id);

        let newIndex: number;

        if (overId in items) {
          newIndex = overItems.length + 1;
        } else {
          const isBelowOverItem =
            over &&
            active.rect.current.translated &&
            active.rect.current.translated.top >
              over.rect.top + over.rect.height;

          const modifier = isBelowOverItem ? 1 : 0;

          newIndex =
            overIndex >= 0 ? overIndex + modifier : overItems.length + 1;
        }

        return {
          ...items,
          [activeContainer]: items[activeContainer].filter(
            (item) => item !== active.id
          ),
          [overContainer]: [
            ...items[overContainer].slice(0, newIndex),
            items[activeContainer][activeIndex],
            ...items[overContainer].slice(
              newIndex,
              items[overContainer].length
            ),
          ],
        };
      });
    }
  }

  function handleArtistChange(event: React.ChangeEvent<HTMLInputElement>) {
    setArtist(event.target.value);
  }
  function handleSongNameChange(event: React.ChangeEvent<HTMLInputElement>) {
    setSongTitle(event.target.value);
  }

  function handleClick() {
    refetch();
  }

  useEffect(() => {
    if (!data?.randomSong) return;
    const newSongId = crypto.randomUUID().toString();
    setItems((prev) => ({ ...prev, current: [newSongId] }));
    setSongs((prev) => [
      ...prev,
      { id: newSongId, parentId: null, songLore: data.randomSong },
    ]);
  }, [data?.randomSong, setSongs]);

  return (
    <main className="flex flex-col justify-between h-full">
      <div className="flex flex-col gap-8 items-center justify-center">
        <h1 className="text-5xl animate-bounce flex">
          <div className="hover:animate-spin" style={{ color: "#e81416" }}>
            U
          </div>
          <div className="hover:animate-spin" style={{ color: "#ffa500" }}>
            n
          </div>
          <div className="hover:animate-spin" style={{ color: "#faeb36" }}>
            i
          </div>
          <div className="hover:animate-spin" style={{ color: "#79c314" }}>
            L
          </div>
          <div className="hover:animate-spin" style={{ color: "#487de7" }}>
            i
          </div>
          <div className="hover:animate-spin" style={{ color: "#4b369d" }}>
            n
          </div>
          <div className="hover:animate-spin" style={{ color: "#70369d" }}>
            e
          </div>
        </h1>
        <label>
          Artist
          <input type="text" onChange={handleArtistChange} value={artist} />
        </label>
        <label>
          Song Name
          <input
            type="text"
            onChange={handleSongNameChange}
            value={songTitle}
          />
        </label>
        <button onClick={handleGuess}>Guess</button>
      </div>
      <div className="flex flex-col gap-8 items-center justify-center">
        <button type="button" onClick={handleClick}>
          Get new song
        </button>
      </div>
      <div className="flex flex-col gap-8">
        <DndContext
          onDragEnd={handleDragEnd}
          onDragOver={handleDragOver}
          onDragStart={handleDragStart}
        >
          <div className="flex gap-4 justify-center min-h-[340px]">
            {items["current"].map((item) => (
              <SortableItem id={item.toString()} key={item.toString()}>
                <SongCard id={item.toString()} correctGuess={canDrag} />
              </SortableItem>
            ))}
          </div>
          <div>
            <h3>Before</h3>
            <h2>After</h2>
          </div>
          <div className="flex gap-4 justify-center mb-32 min-h-[340px]">
            <SortableContext items={items["results"]}>
              {items["results"].map((item) => (
                <SortableItem
                  id={item.toString()}
                  disabled
                  key={item.toString()}
                >
                  <SongCard id={item.toString()} correctGuess={canDrag} />
                </SortableItem>
              ))}
            </SortableContext>
          </div>
          <DragOverlay dropAnimation={dropAnimation}>
            {activeId ? (
              <SongCard id={activeId.toString()} correctGuess={canDrag} />
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>
    </main>
  );
}

export default App;
