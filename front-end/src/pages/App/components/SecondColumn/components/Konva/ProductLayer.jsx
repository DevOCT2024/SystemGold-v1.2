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

        //  IMPORTANTE: não chama setState aqui!
        onDragMove={(e) => {
          // Apenas redesenha a layer para suavidade
          e.target.getLayer()?.batchDraw();
        }}

        // Commit da posição no fim do drag (seu handler já lê do evento)
        onDragEnd={(e) => handleDragEnd(product.id, e, "product")}

        onTransformEnd={() => handleTransformEndAndSaveToHistory("product")}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}

        // sobrescreve quaisquer x/y/width/height de {...rest} com valores seguros
        x={bx}
        y={by}
        width={bw}
        height={bh}
        {...(() => {
          // removemos 'image' de rest para não sobrescrever acima
          const { image: _legacyImage, ...rest } = product || {};
          return rest;
        })()}
      />

      {/* Nome do produto */}
      <Group id={product.id + "name"} draggable>
        <Text
          key={product.id}
          text={product?.name ?? ""}
          fontFamily="Microsoft"
          onDblClick={() =>
            enableTextEditing(product.id, bx + 200, by + 200, product.name)
          }
          fontSize={16}
          x={bx + 100}   // usa bx/by seguros
          y={by + 25}
          fill="black"
          onClick={handleSelect}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
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

            // Seleciona o GRUPO do preço para exibir as alças do Transformer
            onClick={(e) => {
              e.cancelBubble = true;
              const grp = groupRefs.current[index];
              if (grp) handleSelect({ target: grp });
            }}
            onTap={(e) => {
              e.cancelBubble = true;
              const grp = groupRefs.current[index];
              if (grp) handleSelect({ target: grp });
            }}

            // Converte scale -> fontSize, corrige "pulo" e evita o "R$" ser comido
            onTransformEnd={() => {
              const grp = groupRefs.current[index];
              if (!grp) return;

              // bbox "visual" antes de resetar scale
              const before = grp.getClientRect();

              // fator de escala usado pelo usuário
              const sx = Math.abs(grp.scaleX()) || 1;
              const sy = Math.abs(grp.scaleY()) || 1;
              const factor = Math.min(Math.max(Math.max(sx, sy), 0.5), 4);

              const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

              // pega os Texts pelos IDs ORIGINAIS
              const valueNode = grp.findOne(
                (n) => n.getClassName?.() === 'Text' && n.id?.() === product.id + '- $'
              );
              const currencyNode = grp.findOne(
                (n) => n.getClassName?.() === 'Text' && n.id?.() === product.id + '- price'
              );

              if (valueNode?.fontSize) valueNode.fontSize(clamp(valueNode.fontSize() * factor, 8, 300));
              if (currencyNode?.fontSize) currencyNode.fontSize(clamp(currencyNode.fontSize() * factor, 6, 260));

              // Re-layout horizontal: "R$" à esquerda, valor ao lado com gap
              if (currencyNode && valueNode) {
                const gap = 6;
                // mantemos a margem esquerda aproximada
                const baseX = Math.min(currencyNode.x(), valueNode.x());
                currencyNode.x(baseX);
                valueNode.x(currencyNode.x() + currencyNode.width() + gap);
              }

              // zera o scale p/ manter o texto nítido
              grp.scale({ x: 1, y: 1 });

              // bbox após ajustes
              const after = grp.getClientRect();

              // fixa o topo-esquerdo visual para não "pular"
              grp.x(grp.x() + (before.x - after.x));
              grp.y(grp.y() + (before.y - after.y));

              grp.getLayer()?.batchDraw();
              handleTransformEndAndSaveToHistory?.('price');
            }}
          >
            <Text
              id={product.id + "- $"}
              text={product?.valor ?? ""}
              fontSize={28}
              x={bx + 117}      // usa bx/by seguros
              y={by + 40}
              fontFamily="Microsoft Bold"
              letterSpacing={-1}
              fill="black"
            />
            <Text
              id={product.id + "- price"}
              text={"R$"}
              fontSize={14}
              x={bx + 100}
              y={by + 50}
              fontFamily="Microsoft Bold"
              fill="black"
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
