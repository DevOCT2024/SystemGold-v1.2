import { Circle, Path, Rect, Star } from "react-konva";

export function ShapesLayer({ 
    shape,
    handleSelect,
    handleDragMove,
    handleDragEnd,
    shapesRefs,
    handleTransformEndAndSaveToHistory,
    handleMouseEnter,
    handleMouseLeave,
 }) {
    let shapeElement = null;

    if (shape.type === "rectangle") {
        shapeElement = (
            <Rect
                key={shape.id}
                id={shape.id}
                cornerRadius={1}
                x={shape.x}
                y={shape.y}
                width={shape.width}
                height={shape.height}
                isGradient={shape.isGradient}
                fill={shape.isGradient ? undefined : shape.fill}
                fillLinearGradientStartPoint={shape.isGradient ? shape.fillLinearGradientStartPoint : undefined}
                fillLinearGradientEndPoint={shape.isGradient ? shape.fillLinearGradientEndPoint : undefined}
                fillLinearGradientColorStops={shape.isGradient ? shape.fillLinearGradientColorStops : undefined}
                fillRadialGradientStartRadius={0}
                fillRadialGradientEndRadius={50}
                strokeTam={0}
                ref={(node) => (shapesRefs.current[shape.id] = node)}
                {...shape}
                draggable
                onClick={(e) => handleSelect(e, shape)}
                onTap={(e) => handleSelect(e, shape)}
                onDragMove={(e) => handleDragMove(e, "shape")}
                onDragEnd={(e) => handleDragEnd(shape.id, e, "shape")}
                onTransformEnd={() => handleTransformEndAndSaveToHistory("shape")}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            />
        );
    } else if (shape.type === "circle") {
        shapeElement = (
            <Circle
                key={shape.id}
                x={shape.x}
                y={shape.y}
                {...shape}
                radius={shape.radius}
                draggable
                isGradient={shape.isGradient}
                fill={shape.isGradient ? undefined : shape.fill}
                fillLinearGradientStartPoint={shape.isGradient ? shape.fillLinearGradientStartPoint : undefined}
                fillLinearGradientEndPoint={shape.isGradient ? shape.fillLinearGradientEndPoint : undefined}
                fillLinearGradientColorStops={shape.isGradient ? shape.fillLinearGradientColorStops : undefined}
                onClick={(e) => handleSelect(e, shape)}
                onTap={(e) => handleSelect(e, shape)}
                ref={(node) => (shapesRefs.current[shape.id] = node)}
                onDragMove={(e) => handleDragMove(e, "shape")}
                onDragEnd={(e) => handleDragEnd(shape.id, e, "shape")}
                onTransformEnd={() => handleTransformEndAndSaveToHistory("shape")}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            />
        );
    } else if (shape.type === "star") {
        shapeElement = (
            <Star
                key={shape.id}
                x={shape.x}
                y={shape.y}
                isGradient={shape.isGradient}
                fill={shape.isGradient ? undefined : shape.fill}
                fillLinearGradientStartPoint={shape.isGradient ? shape.fillLinearGradientStartPoint : undefined}
                fillLinearGradientEndPoint={shape.isGradient ? shape.fillLinearGradientEndPoint : undefined}
                fillLinearGradientColorStops={shape.isGradient ? shape.fillLinearGradientColorStops : undefined}
                {...shape}
                draggable
                numPoints={shape.numPoints}
                innerRadius={shape.innerRadius}
                outerRadius={shape.outerRadius}
                stroke="red"
                strokeWidth={2}
                onClick={(e) => handleSelect(e, shape)}
                onTap={(e) => handleSelect(e, shape)}
                ref={(node) => (shapesRefs.current[shape.id] = node)}
                onDragMove={(e) => handleDragMove(e, "shape")}
                onDragEnd={(e) => handleDragEnd(shape.id, e, "shape")}
                onTransformEnd={() => handleTransformEndAndSaveToHistory("shape")}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            />
        );
    } else if (shape.type === "path") {
        shapeElement = (
            <Path
                key={shape.id}
                type="path"
                x={shape.x}
                y={shape.y}
                {...shape}
                fill={shape.isGradient ? undefined : shape.fill}
                fillLinearGradientStartPoint={shape.isGradient ? shape.fillLinearGradientStartPoint : undefined}
                fillLinearGradientEndPoint={shape.isGradient ? shape.fillLinearGradientEndPoint : undefined}
                fillLinearGradientColorStops={shape.isGradient ? shape.fillLinearGradientColorStops : undefined}
                draggable
                ref={(node) => (shapesRefs.current[shape.id] = node)}
                onClick={(e) => handleSelect(e, shape)}
                onTap={(e) => handleSelect(e, shape)}
                onDragMove={(e) => handleDragMove(e, "shape")}
                onDragEnd={(e) => handleDragEnd(shape.id, e, "shape")}
                onTransformEnd={() => handleTransformEndAndSaveToHistory("shape")}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            />
        );
    }

    return <>{shapeElement}</>;
}
