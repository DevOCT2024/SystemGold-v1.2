import { Text } from "react-konva";

export function TextsLayer({
  text,
  handleSelect,
  handleDragEnd,
  enableTextEditing,
  shapesRefs,
}) {
  // Base comum para os dois textos (preenchimento e contorno)
  const baseProps = {
    text: text.text,
    x: text.x,
    y: text.y,
    fontFamily: text.fontFamily || "Microsoft",
    fontSize: text.fontSize || 24,
    align: text.align,
    width: text.width,
    lineHeight: text.lineHeight,
    padding: text.padding,
  };

  // Mantém o contorno seguindo rotação/escala/posição do texto principal
  const syncOutlineTransform = (node) => {
    if (!node) return;
    const layer = node.getLayer();
    if (!layer) return;

    const outline = layer.findOne(`#${node.id()}-outline`);
    if (!outline) return;

    outline.position(node.position());
    outline.rotation(node.rotation());
    outline.scaleX(node.scaleX());
    outline.scaleY(node.scaleY());
    outline.offsetX(node.offsetX());
    outline.offsetY(node.offsetY());
    outline.skewX(node.skewX());
    outline.skewY(node.skewY());

    layer.batchDraw();
  };

  return (
    <>

<Text
{...baseProps}
id={`${text.id}-outline`}
fill="transparent"
stroke={text.outline ?? "transparent"}
strokeWidth={(text.strokeTam ?? 0) * 2}   
strokeScaleEnabled={false}
lineJoin="round"
listening={false}                         
draggable={false}
/>

 
<Text
{...baseProps}
id={text.id}
fill={text.fill ?? "#000000"}
stroke="transparent"
strokeWidth={0}
strokeScaleEnabled={false}
lineJoin="round"
draggable 
 
onDragMove={(e) => {
  syncOutlineTransform(e.target);
}}

onDragEnd={(e) => {
  handleDragEnd(text.id, e, "texts");
  syncOutlineTransform(e.target);
}}
onTransform={(e) => {
  syncOutlineTransform(e.target);
}}
onTransformEnd={(e) => {
  syncOutlineTransform(e.target);
}}
onDblClick={() => enableTextEditing(text.id, text.x, text.y, text.text)}
onClick={(e) => handleSelect(e, { ...text, type: "text" })}
onTap={(e) => handleSelect(e, { ...text, type: "text" })}
ref={(node) => (shapesRefs.current[text.id] = node)}
/>
</>
);
}
