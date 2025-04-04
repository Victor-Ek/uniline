import { songsAtom } from "@/App";
import { useDroppable } from "@dnd-kit/core";
import { useAtomValue } from "jotai";

interface Props {
  id: string;
  children: React.ReactNode;
}

export function Droppable({ id, children }: Props) {
  const songs = useAtomValue(songsAtom);
  const { isOver, setNodeRef } = useDroppable({
    id,
    disabled: songs.some((x) => x.parentId === id),
  });
  const style = {
    opacity: isOver ? 1 : 0.5,
  };

  return (
    <div ref={setNodeRef} style={style} className="flex w-80 h-80">
      {children}
    </div>
  );
}
