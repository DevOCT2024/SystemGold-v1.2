import { Image } from 'react-konva';
import useImage from 'use-image';

export function BoxDataLayer({ box, handleSelect, shapesRefs }) {
  const isString = typeof box?.image === 'string';
  const url = isString ? box.image : '';          // chama o hook sempre
  const [loadedImg] = useImage(url, 'anonymous'); // força CORS

  const img = isString ? loadedImg : box.image;   // se já for HTMLImageElement, usa direto

  return (
    <Image
      id={box.id}          // precisa existir pra bater com selectedShape.id()
      type="box"           // checar no delete
      image={img || undefined}
      x={box.x}
      y={box.y}
      width={box.width}
      height={box.height}
      draggable
      ref={(node) => (shapesRefs.current[box.id] = node)}
      onClick={(e) => handleSelect(e, box)}
      onTap={(e) => handleSelect(e, box)}
    />
  );
}
