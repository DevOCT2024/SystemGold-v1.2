import { Text } from "react-konva";

export function TextsLayer({
    text,
    handleSelect,
    handleDragEnd,
    enableTextEditing,
    shapesRefs,
}) {
    return (
        <>
            {/* Contorno - SÓ visual, não interativo, mas funciona normalmente */}
            <Text
                {...text}                       // spread ANTES
                id={`${text.id}-outline`}       // id distinto (evita confusão)
                fill="transparent"              // interior transparente
                stroke={text.outline}           // cor do contorno
                strokeWidth={text.strokeTam || 0} // espessura (0 = sem contorno)
                lineJoin="round"                // cantos arredondados (melhora estética)
                strokeScaleEnabled={false}      // stroke não deforma com escala/zoom
                draggable={false}
                listening={false}               // não rouba clique
            />


            {/* Texto principal - interativo */}
            <Text
                {...text}                                  // spread ANTES
                fill={text.fill ?? "#000000"}              // cor do texto (por último)
                fontSize={text.fontSize || 24}
                fontFamily={text.fontFamily || "Microsoft"}
                x={text.x}
                y={text.y}
                draggable
                stroke={null}
                onDragEnd={(e) => handleDragEnd(text.id, e, "texts")}
                onDblClick={() => enableTextEditing(text.id, text.x, text.y, text.text)}
                onClick={(e) => handleSelect(e, { ...text, type: "text" })} // 3) força type
                onTap={(e) => handleSelect(e, { ...text, type: "text" })}
                ref={(node) => (shapesRefs.current[text.id] = node)}         // ref SÓ no principal
            />
        </>
    );
}
