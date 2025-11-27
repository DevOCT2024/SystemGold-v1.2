import { Group, Image as KonvaImage, Line, Rect, Text } from "react-konva";
import useImage from "use-image";

// helper simples p/ garantir número
const num = (v, fb = 0) => {
  const x = typeof v === "string" ? parseFloat(v) : v;
  return Number.isFinite(x) ? x : fb;
};

export function ProductLayer({
  product,
  index,
  handleSelect,
  /* handleDragMove,  // <- NÃO vamos mais usar para não dar setState no drag */
  handleDragEnd,
  shapesRefs,
  handleTransformEndAndSaveToHistory,
  handleMouseEnter,
  handleMouseLeave,
  enableTextEditing,
  groupRefs,
  handleTransformGroup,
  logo
}) {
  const productUrl =
    product?.img
    || (typeof product?.image === "string" ? product.image : product?.image?.src)
    || product?.originalUrl
    || "";

  const [imgEl] = useImage(productUrl, "anonymous");
  const imageForKonva = product?.__konvaImage ?? imgEl ?? null;
  const konvaKey = product?.id + (product?.__konvaImage ? "-cutout" : "");

  const [logoImg] = useImage(typeof logo === "string" ? logo : "", "anonymous");

  // evita passar 'image' nula e garante números válidos
  const imgReady = !!product?.image;
  const bx = num(product?.x, 0);
  const by = num(product?.y, 0);
  const bw = num(product?.width, 80);
  const bh = num(product?.height, 80);

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
      <KonvaImage
        id={product.id}
        type="product"
        key={konvaKey}
        image={imgReady ? product.image : undefined}  // não passa null
        listening={imgReady}                           // só seleciona quando pronto
        draggable
        ref={(node) => (shapesRefs.current[product.id] = node)}
        onClick={(e) => handleSelect(e, product)}
        onTap={(e) => handleSelect(e, product)}

        onDragMove={(e) => {
          e.target.getLayer()?.batchDraw();
        }}
        onDragEnd={(e) => handleDragEnd(product.id, e, "product")}
        onTransformEnd={() => handleTransformEndAndSaveToHistory("product")}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}

        x={bx}
        y={by}
        width={bw}
        height={bh}
        {...(() => {
          const { image: _legacyImage, ...rest } = product || {};
          return rest
        })()}
      />

      {/* Nome do produto */}
      <Group id={product.id + "name"} draggable>
        {/* CONTORNO DO NOME */}
        <Text
          key={`${product.id}-name-outline`}
          id={`${product.id}-name-text-outline`}
          text={product?.name ?? ""}
          fontFamily={Text.fontFamily || "Microsoft"}
          fontSize={Text.fontSize || 24}
          x={bx + 100}
          y={by + 25}
          fill="transparent"
          stroke={product?.outline ?? "transparent"}      // cor do contorno
          strokeWidth={(product?.strokeTam ?? 0) * 2}    // contorno mais forte pra fora
          strokeScaleEnabled={false}
          lineJoin="round"
          listening={false}                               // não interfere em clique
        />

        {/* TEXTO PRINCIPAL DO NOME */}
        <Text
          key={product.id}
          id={`${product.id}-name-text`}
          text={product?.name ?? ""}
          fontFamily={Text.fontFamily || "Microsoft"}
          onDblClick={() =>
            enableTextEditing(product.id, bx + 200, by + 200, product.name)
          }
          fontSize={Text.fontSize || 24}
          x={bx + 100}   // usa bx/by seguros
          y={by + 25}
          fill={Text.fill ?? "#000000"}
          onClick={handleSelect}  
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}   

         
          outline={product?.outline ?? null}
          strokeTam={product?.strokeTam ?? 0}

         
          stroke="transparent"
          strokeWidth={0}
          strokeScaleEnabled={false}
          lineJoin="round"

          // rotação e escala acompanham contorno
          onTransform={(e) => syncOutlineTransform(e.target)}
          onTransformEnd={(e) => syncOutlineTransform(e.target)}
        />
      </Group>


      {[
         // --- Sem rádio ---
  product.radio === "" && (
    <Group
      key={`grp-${product.id}-empty`}
      ref={(node) => (groupRefs.current[index] = node)}
      id={`${product.id}-grp`}
      draggable
      onClick={(e) => {
        e.cancelBubble = true;
        const grp = groupRefs.current[index];
        const priceNode = grp?.findOne?.(`#${product.id}-price`);
        handleSelect({ target: priceNode || grp });
      }}
      onTap={(e) => {
        e.cancelBubble = true;
        const grp = groupRefs.current[index];
        const priceNode = grp?.findOne?.(`#${product.id}-price`);
        handleSelect({ target: priceNode || grp });
      }}
    >
      {/* CONTORNO DO PREÇO */}
      <Text
        id={`${product.id}-price-outline`}
        text={`R$ ${product?.valor ?? ""}`}
        fontSize={24}
        x={bx + 100}
        y={by + 40}
        fontFamily="Microsoft"
        letterSpacing={-1}
        fill="transparent"
        stroke={product?.outline ?? "transparent"}
        strokeWidth={(product?.strokeTam ?? 0) * 2}
        strokeScaleEnabled={false}
        lineJoin="round"
        listening={false}               
      />

    

      {/* PREÇO PRINCIPAL ("R$ 12,34.00") */}
      <Text
        id={`${product.id}-price`}
        text={`R$ ${product?.valor ?? ""}`}
        fontSize={24}
        x={bx + 100}
        y={by + 40}
        fontFamily="Microsoft"
        letterSpacing={-1}
        onClick={handleSelect}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}

        fill="black"                     // cor do texto
        stroke="transparent"             // sem stroke aqui
        strokeWidth={0}
        strokeScaleEnabled={false}
        lineJoin="round"

        // mantém esses attrs pro resto da app
        outline={product?.outline ?? null}
        strokeTam={product?.strokeTam ?? 0}

        // contorno acompanha rotação/escala
        onTransform={(e) => syncOutlineTransform(e.target)}
        onTransformEnd={(e) => syncOutlineTransform(e.target)}
      />
    </Group>


        ),

        // --- "de, por" ---
        product.radio === "de, por" && (
          <Group
            key={`grp-${product.id}-depor`}
            onTap={() => { handleTransformGroup(index); }}
            x={bx + 80}
            y={by + 25}
            ref={(node) => (groupRefs.current[index] = node)}
            onClick={() => handleTransformGroup(index)}
            draggable
          >
            <Text
              text={"R$" + (product?.valor ?? "")}
              fontSize={16}
              letterSpacing={-1}
              fill="black"
              fontFamily="Microsoft Bold"
            />
            <Text
              text={`R$`}
              fontSize={14}
              y={28}
              fill="red"
              fontFamily="Microsoft Bold"
            />
            <Text
              text={product?.valor2 ?? ""}
              fontSize={28}
              y={20}
              x={18}
              fill="red"
              letterSpacing={-1}
              fontFamily="Microsoft Bold"
            />
            <Group draggable>
              <Line
                points={product?.valor === 0 ? [0, 18, 30, -5] : [20, 18, 50, -5]}
                stroke={"black"}
                strokeWidth={2}
              />
              <Line
                points={product?.valor === 0 ? [30, 18, 0, -5] : [50, 18, 20, -5]}
                stroke={"black"}
                strokeWidth={2}
              />
            </Group>
          </Group>
        ),

        // --- Clube: até 4 dígitos ---
        product.radio === "Clube" && (product.valor2 || "").split("").length <= 4 && (
          <Group
            key={`grp-${product.id}-clube-<=4`}
            id={`${product.id}-clube-le4`}
            ref={(node) => (groupRefs.current[index] = node)}
            onClick={() => { handleTransformGroup(index); }}
            onTap={() => { handleTransformGroup(index); }}
            x={bx + 73}
            y={by + 20}
            draggable
          >
            <Text
              text={`R$` + (product?.valor ?? "")}
              fontFamily="Microsoft Bold"
              fontSize={16}
              letterSpacing={-1}
              x={10}
              y={7}
              fill="black"
            />

            <Rect
              width={156}
              height={42}
              y={30}
              cornerRadius={20}
              fillRadialGradientColorStops={[
                0, "yellow",
                0.7, "rgba(255, 200, 0, 0.9)",
                1, "rgba(255, 140, 0, 1)"
              ]}
              fillRadialGradientStartPoint={{ x: 78, y: 21 }}
              fillRadialGradientEndPoint={{ x: 78, y: 21 }}
              fillRadialGradientStartRadius={0}
              fillRadialGradientEndRadius={80}
              stroke="rgba(255, 140, 0, 0.8)"
              strokeWidth={2}
            />

            <KonvaImage image={logoImg || null} width={50} height={20} x={90} y={40} />

            <Text
              text={product.valor2 ?? ""}
              fontSize={28}
              x={26}
              y={40}
              fill="red"
              letterSpacing={-1}
              fontFamily="Microsoft Bold"
            />
            <Text
              text={`R$`}
              fontSize={14}
              x={10}
              y={49}
              fill="red"
              letterSpacing={-1}
              fontFamily="Microsoft Bold"
            />
          </Group>
        ),

        // --- Clube: 5 dígitos ---
        product.radio === "Clube" && (product.valor2 || "").split("").length === 5 && (
          <Group
            key={`grp-${product.id}-clube-==5`}
            id={`${product.id}-clube-eq5`}
            ref={(node) => (groupRefs.current[index] = node)}
            onClick={() => { handleTransformGroup(index); }}
            onTap={() => { handleTransformGroup(index); }}
            x={bx + 73}
            y={by + 20}
            draggable
          >
            <Text
              text={`R$` + (product?.valor ?? "")}
              fontFamily="Microsoft Bold"
              fontSize={16}
              letterSpacing={-1}
              x={10}
              y={7}
              fill="black"
            />

            <Rect
              width={166.5}
              height={42}
              y={30}
              cornerRadius={20}
              fillRadialGradientColorStops={[
                0, "yellow",
                0.7, "rgba(255, 200, 0, 0.9)",
                1, "rgba(255, 140, 0, 1)"
              ]}
              fillRadialGradientStartPoint={{ x: 78, y: 21 }}
              fillRadialGradientEndPoint={{ x: 78, y: 21 }}
              fillRadialGradientStartRadius={0}
              fillRadialGradientEndRadius={80}
              stroke="rgba(255, 140, 0, 0.8)"
              strokeWidth={2}
            />

            <KonvaImage image={logoImg || null} width={50} height={38} x={105} y={33} />

            <Text
              text={product.valor2 ?? ""}
              fontSize={28}
              x={26}
              y={40}
              fill="red"
              letterSpacing={-1}
              fontFamily="Microsoft Bold"
            />
            <Text
              text={`R$`}
              fontSize={14}
              x={10}
              y={49}
              fill="red"
              letterSpacing={-1}
              fontFamily="Microsoft Bold"
            />
          </Group>
        ),

        // --- Clube: 6 dígitos ---
        product.radio === "Clube" && (product.valor2 || "").split("").length === 6 && (
          <Group
            key={`grp-${product.id}-clube-==6`}
            id={`${product.id}-clube-eq6`}
            ref={(node) => (groupRefs.current[index] = node)}
            onClick={() => { handleTransformGroup(index); }}
            onTap={() => { handleTransformGroup(index); }}
            x={bx + 73}
            y={by + 20}
            draggable
          >
            <Text
              text={`R$` + (product?.valor ?? "")}
              fontFamily="Microsoft Bold"
              fontSize={16}
              letterSpacing={-1}
              x={10}
              y={7}
              fill="black"
            />

            <Rect
              width={182.5}
              height={42}
              y={30}
              cornerRadius={20}
              fillRadialGradientColorStops={[
                0, "yellow",
                0.7, "rgba(255, 200, 0, 0.9)",
                1, "rgba(255, 140, 0, 1)"
              ]}
              fillRadialGradientStartPoint={{ x: 78, y: 21 }}
              fillRadialGradientEndPoint={{ x: 78, y: 21 }}
              fillRadialGradientStartRadius={0}
              fillRadialGradientEndRadius={80}
              stroke="rgba(255, 140, 0, 0.8)"
              strokeWidth={2}
            />

            <KonvaImage image={logoImg || null} width={50} height={20} x={115} y={40} />

            <Text
              text={product.valor2 ?? ""}
              fontSize={28}
              x={26}
              y={40}
              fill="red"
              letterSpacing={-1}
              fontFamily="Microsoft Bold"
            />
            <Text
              text={`R$`}
              fontSize={14}
              x={10}
              y={49}
              fill="red"
              letterSpacing={-1}
              fontFamily="Microsoft Bold"
            />
          </Group>
        )
      ]}
    </>
  );
}
