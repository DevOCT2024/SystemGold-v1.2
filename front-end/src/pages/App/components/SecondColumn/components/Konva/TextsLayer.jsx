import { Text } from "react-konva";

export function TextsLayer({
    text,
    handleSelect,
    handleDragEnd,
    enableTextEditing,
    shapesRefs
}) {
    return (
        <>
            {/* Contorno do texto */}
            <Text
                text={text.text}
                fontSize={text.fontSize || 24}
                fontFamily="Arial"
                x={text.x}
                y={text.y}
                fill="transparent" // Deixa o interior transparente
                stroke={text.outline} // Define a cor do contorno
                strokeWidth={text.strokeTam} // Ajusta o strokeWidth com base no fontSize
                scaleX={text.scaleX || 1}  // Aplica a escala X
                scaleY={text.scaleY || 1}  // Aplica a escala Y
                onClick={handleSelect}
                {...text}

            />


            {/* Texto original por cima */}
            <Text
                text={text.text}
                onDragEnd={(e) => handleDragEnd(text.id, e, 'texts')}
                fontSize={text.fontSize || 24}
                {...text}
                draggable
                x={text.x}
                y={text.y}
                stroke={null}
                fill="black"
                onDblClick={() => enableTextEditing(text.id, text.x, text.y, text.text)}
                onClick={(e) => handleSelect(e, text)}
                onTap={(e) => handleSelect(e, text)}
                ref={(node) => (shapesRefs.current[text.id] = node)}
                fontFamily="Microsoft"
            />
        </>
    )
}