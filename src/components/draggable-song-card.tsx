import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import SongCard from "./song-card";

interface Props {
  id: string;
  canDrag: boolean;
}

export default function DraggableSongCard({ id, canDrag }: Props) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id,
    disabled: !canDrag,
  });
  const style = {
    // Outputs `translate3d(x, y, 0)`
    transform: CSS.Translate.toString(transform),
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <SongCard id={id} correctGuess={canDrag} />
    </div>
  );
}
