import { Image } from "react-konva";

export function StampsLayer({
    stamp,
    shapesRefs,
    handleSelect
}) {
    return (
        <Image
            id={stamp.id}
            image={stamp.image}
            x={stamp.x}
            y={stamp.y}
            width={stamp.width}
            height={stamp.height}
            draggable
            ref={(node) => (shapesRefs.current[stamp.id] = node)}
            onClick={(e) => handleSelect(e, stamp)}
            onTap={(e) => handleSelect(e, stamp)}
        />

    )
}