import { Text } from "react-konva";

export function ValidadeDateLayer({
    handleSelect,
    formatedDateInitial,
    formatedDateFinal
 }) {
    return (
        <Text
            id={Date.now()}
            type="validate"
            text={`Promoção valida de ${formatedDateInitial} até ${formatedDateFinal} ou enquanto durar o estoque`}
            fontSize={16}
            fontFamily="Viga"
            draggable
            x={100}
            y={100}
            fill="black"
            // onDblClick={() => enableTextEditing(selectedShape.id, selectedShape.x, selectedShape.y,  selectedShape.text)}
            onClick={(e) => handleSelect(e, e.target)}
            onTap={(e) => handleSelect(e, e.target)}
        // ref={(node) => (shapesRefs.current[copy.id] = node)}
        />

    )
}