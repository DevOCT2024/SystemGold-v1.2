import { useEffect } from "react";
import { Circle, Image, Path, Rect, Star, Text } from "react-konva";

export function CopiesLayer({
    copy,
    handleSelect,
    handleDragMove,
    handleDragEnd,
    shapesRefs,
    handleTransformEndAndSaveToHistory,
    handleMouseEnter,
    handleMouseLeave,
    enableTextEditing,
}) {
    let copyElement = null;

    if (copy.image) {
        copyElement = (
            <Image
                key={copy.id}
                id={copy.id}
                image={copy.image}
                {...copy}
                draggable
                onClick={(e) => handleSelect(e, copy)}
                onTap={(e) => handleSelect(e, copy)}
                ref={(node) => (shapesRefs.current[copy.id] = node)}
                onDragMove={(e) => handleDragMove(e, "copy")}
                onDragEnd={(e) => handleDragEnd(copy.id, e, 'copy')}
                onTransformEnd={() => handleTransformEndAndSaveToHistory("copy")}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            />
        );
    } else if (copy.radius) {
        copyElement = (
            <Circle
                key={copy.id}
                id={copy.id}
                x={copy.x}
                y={copy.y}
                radius={copy.radius}
                isGradient={copy.isGradient}
                fill={copy.isGradient ? undefined : copy.fill}
                fillLinearGradientStartPoint={copy.isGradient ? copy.fillLinearGradientStartPoint : undefined}
                fillLinearGradientEndPoint={copy.isGradient ? copy.fillLinearGradientEndPoint : undefined}
                fillLinearGradientColorStops={copy.isGradient ? copy.fillLinearGradientColorStops : undefined}
                {...copy}
                draggable
                onClick={(e) => handleSelect(e, copy)}
                onTap={(e) => handleSelect(e, copy)}
                ref={(node) => (shapesRefs.current[copy.id] = node)}
                onDragMove={(e) => handleDragMove(e, "copy")}
                onDragEnd={(e) => handleDragEnd(copy.id, e, 'copy')}
                onTransformEnd={() => handleTransformEndAndSaveToHistory("copy")}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            />
        );
    } else if (copy.text) {
        copyElement = (
            <Text
                key={copy.id}
                id={copy.id}
                x={copy.x}
                y={copy.y}
                text={copy.text}
                fontSize={24}
                fill={copy.fill}
                {...copy}
                type={'copy'}
                draggable
                onDblClick={() => enableTextEditing(copy.id, copy.x, copy.y, copy.text)}
                onClick={(e) => handleSelect(e, copy)}
                onTap={(e) => handleSelect(e, copy)}
                ref={(node) => (shapesRefs.current[copy.id] = node)}
                onDragMove={(e) => handleDragMove(e, "copy")}
                onDragEnd={(e) => handleDragEnd(copy.id, e, 'copy')}
                onTransformEnd={() => handleTransformEndAndSaveToHistory("copy")}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            />
        );
    } else if (copy.data) {
        copyElement = (
            <Path
                key={copy.id}
                id={copy.id}
                data={copy.data}
                x={copy.x}
                y={copy.y}
                fill={copy.isGradient ? undefined : copy.fill}
                fillLinearGradientStartPoint={copy.isGradient ? copy.fillLinearGradientStartPoint : undefined}
                fillLinearGradientEndPoint={copy.isGradient ? copy.fillLinearGradientEndPoint : undefined}
                fillLinearGradientColorStops={copy.isGradient ? copy.fillLinearGradientColorStops : undefined}
                {...copy}
                draggable
                onClick={(e) => handleSelect(e, copy)}
                onTap={(e) => handleSelect(e, copy)}
                ref={(node) => (shapesRefs.current[copy.id] = node)}
                onDragMove={(e) => handleDragMove(e, "copy")}
                onDragEnd={(e) => handleDragEnd(copy.id, e, 'copy')}
                onTransformEnd={() => handleTransformEndAndSaveToHistory("copy")}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            />
        );
    } else if (copy.type === 'star') {
        copyElement = (
            <Star
                key={copy.id}
                id={copy.id}
                x={copy.x}
                y={copy.y}
                numPoints={copy.numPoints}
                innerRadius={copy.innerRadius}
                outerRadius={copy.outerRadius}
                isGradient={copy.isGradient}
                fill={copy.isGradient ? undefined : copy.fill}
                fillLinearGradientStartPoint={copy.isGradient ? copy.fillLinearGradientStartPoint : undefined}
                fillLinearGradientEndPoint={copy.isGradient ? copy.fillLinearGradientEndPoint : undefined}
                fillLinearGradientColorStops={copy.isGradient ? copy.fillLinearGradientColorStops : undefined}
                stroke="black"
                strokeWidth={2}
                {...copy}
                draggable
                onClick={(e) => handleSelect(e, copy)}
                onTap={(e) => handleSelect(e, copy)}
                ref={(node) => (shapesRefs.current[copy.id] = node)}
                onDragMove={(e) => handleDragMove(e, "copy")}
                onDragEnd={(e) => handleDragEnd(copy.id, e, 'copy')}
                onTransformEnd={() => handleTransformEndAndSaveToHistory("copy")}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            />
        );
    } else {
        copyElement = (
            <Rect
                key={copy.id}
                id={copy.id}
                x={copy.x}
                y={copy.y}
                width={copy.width}
                height={copy.height}
                isGradient={copy.isGradient}
                fill={copy.isGradient ? undefined : copy.fill}
                fillLinearGradientStartPoint={copy.isGradient ? copy.fillLinearGradientStartPoint : undefined}
                fillLinearGradientEndPoint={copy.isGradient ? copy.fillLinearGradientEndPoint : undefined}
                fillLinearGradientColorStops={copy.isGradient ? copy.fillLinearGradientColorStops : undefined}
                {...copy}
                draggable
                onClick={(e) => handleSelect(e, copy)}
                onTap={(e) => handleSelect(e, copy)}
                ref={(node) => (shapesRefs.current[copy.id] = node)}
                onDragMove={(e) => handleDragMove(e, "copy")}
                onDragEnd={(e) => handleDragEnd(copy.id, e, 'copy')}
                onTransformEnd={() => handleTransformEndAndSaveToHistory("copy")}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            />
        );
    }

    return <>{copyElement}</>;
}