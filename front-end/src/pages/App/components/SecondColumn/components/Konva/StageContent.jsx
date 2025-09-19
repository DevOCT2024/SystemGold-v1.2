import React, { useEffect, useRef, useState } from "react";
import {
    Stage,
    Layer,
    Group,
    Rect,
    Text,
    Line,
    Transformer,
    Image as KonvaImage, Circle, Star, Path
} from 'react-konva';

import iconWhats from "../../../../../../sources/icons konva/whats.png";
import iconTel from "../../../../../../sources/icons konva/tel.png";
import { useParams } from "react-router-dom";
import { useStamps } from "../../../../../../contexts/StampsContext";
import { useBox } from "../../../../../../contexts/BoxContext";
import { getClubImage } from "../../../../../../services/User/User";
import { Button } from "../../../../../../components/button/button";
import { ArrowLeft, ArrowRight, Plus } from "lucide-react";
import { handleClearCurrentPage } from "../../../../aplication"
import useImage from 'use-image';
import { useStageConfig } from "./StageConfigContext";


import { ProductLayer } from "./ProductLayer";
import { ShapesLayer } from "./ShapesLayer";
import { CopiesLayer } from "./CopiesLayer";
import { TextsLayer } from "./TextsLayer";
import { BoxDataLayer } from "./BoxDataLayer";
import { ValidadeDateLayer } from "./ValidateDateLayer";
import { InformationsLayer } from "./InformationsLayer";
import { StampsLayer } from "./StampsLayer";

export const StageContent = ({
    // ===== props já existentes =====
    setStageQuantity,
    stageQuantity,
    handleTransformEndAndSaveToHistory,
    groupRefs,
    handleTransformGroup,
    groupActive,
    selectedElements,
    handleDeselect,
    shapesRefs,
    selectedTabloid,
    setSelectedShape,
    setSelectedText,
    backgroundImage,
    desabilitarBackground,
    handleMouseEnter,
    handleMouseLeave,
    handleSelect,
    handleDragMove,
    handleDragEnd,
    selectedShape,
    transformerRef,
    guides,
    enableTextEditing,
    tempTextValue,
    editingTextIndex,
    handleTextChange,
    saveTextChange,
    inputPosition,
    user,
    adress,
    addNewStage,
    stageId,
    prevStage,
    nextStage,
    registerExporter,
    // ===== novas props para o “auto-clique” no produto =====
    pendingClickProductId,          // string/number do produto a ser “clicado”
    onClickHandled,
    onClearCurrentPage,
    stageSize,
    bgUrl,

    backgroundUrl,
}) => {

    const trRef = React.useRef(null); // ALTERAR TAMANHO DO TEXTO PRICE


    const { id } = useParams();
    const [logo, setLogo] = useState(null);
    const { stampsKonva } = useStamps();
    const { boxData } = useBox();
    const [konvaScale, setKonvaScale] = useState(1);
    const [positionKonva, setPositionKonva] = useState({ x: 0, y: 0 });

    // stage atual
    const currentStage = stageQuantity.find((stage) => stage?.id === stageId);

    // refs do Konva (UMA vez neste arquivo)
    const stageRef = useRef(null);
    const productLayerRef = useRef(null);
    // ===== Helpers de exportação =====
    // ===== Helpers de exportação (NÃO mexem na escala do stage) =====
    const downloadDataUrl = (dataURL, filename = 'Tabloide.png') => {
        const link = document.createElement('a');
        link.href = dataURL;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const exportPNG = ({
        filename = 'Tabloide.png',
        pixelRatio = 3,             // qualidade (3x). Aumente se quiser ainda mais
        mimeType = 'image/png',     // pode usar 'image/jpeg'
        quality,                    // 0..1 (só para jpeg/webp)
    } = {}) => {
        const stage = stageRef.current;
        if (!stage) return null;
        const dataURL = stage.toDataURL({ pixelRatio, mimeType, quality });
        downloadDataUrl(dataURL, filename);
        return dataURL;
    };

    useEffect(() => {
        if (typeof registerExporter === 'function') {
            registerExporter({
                exportPNG,
                toDataURL: (opts = {}) => {
                    const stage = stageRef.current;
                    if (!stage) return null;
                    return stage.toDataURL({
                        pixelRatio: opts.pixelRatio ?? 1,
                        mimeType: opts.mimeType ?? 'image/png',
                        quality: opts.quality,
                    });
                },
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [registerExporter]);


    const handleWheel = (e) => {
        e.evt.preventDefault();

        const scaleBy = 1.1;
        const stage = e.target.getStage();
        const oldScale = stage.scaleX();

        const mousePointTo = {
            x: stage.getPointerPosition().x / oldScale - stage.x() / oldScale,
            y: stage.getPointerPosition().y / oldScale - stage.y() / oldScale,
        };

        const newScale = e.evt.deltaY < 0 ? oldScale * scaleBy : oldScale / scaleBy;

        setKonvaScale(newScale);
        setPositionKonva({
            x: -(mousePointTo.x - stage.getPointerPosition().x / newScale) * newScale,
            y: -(mousePointTo.y - stage.getPointerPosition().y / newScale) * newScale,
        });
    };

    // (REMOVIDO) — havia um StageContent “dentro” do arquivo com outro stageRef; isso causava conflitos

    const [logoWhats, setLogoWhats] = useState(null);
    const [logoTel, setLogoTel] = useState(null);
    const [textSize, setTextSize] = useState({ width: 0, height: 0 });
    const textRefAdress = useRef();

    // cuidado: JSON.parse pode quebrar; se preferir, proteja com try/catch
    const informations = user?.Adress ?? null;

    useEffect(() => {
        if (textRefAdress.current) {
            const width = textRefAdress.current.getTextWidth();
            const height = textRefAdress.current.getTextHeight();
            setTextSize({ width, height });
        }
    }, [textRefAdress.current]);

    useEffect(() => {
        const imgWhats = () => {
            const img = new window.Image();
            img.src = iconWhats;
            img.onload = () => {
                setLogoWhats(img);
            };
        };
        const imgTel = () => {
            const img = new window.Image();
            img.src = iconTel;
            img.onload = () => {
                setLogoTel(img);
            };
        };

        imgWhats();
        imgTel();
    }, []);

    useEffect(() => {
        let alive = true;
        const fetchImg = async () => {
            try {
                const imgRes = await getClubImage(id);     // axios response
                const url = imgRes?.data || '';            // <- string URL
                if (!url || !alive) return;

                const img = new window.Image();
                img.crossOrigin = 'anonymous';
                img.src = url;
                img.onload = () => {
                    if (!alive) return;
                    setLogo(img);
                    stageRef.current?.batchDraw();
                };
            } catch (e) {
                console.error(e);
            }
        };
        fetchImg();
        return () => { alive = false; };
    }, [id]);


    const deleteKonvaStage = (konvaStageId) => {
        setStageQuantity((prevStage) => {
            return prevStage.filter((stage) => stage?.id !== konvaStageId);
        });

        prevStage();
    };

    // ===== efeito: ao receber um pendingClickProductId, procura o node e dispara 'click' =====
    useEffect(() => {
        if (!pendingClickProductId) return;

        let cancelled = false;

        const tryClick = (tries = 24) => {
            if (cancelled) return;

            const stage = stageRef.current;
            const layer =
                productLayerRef.current ?? stage?.findOne?.("#productLayer");

            // tenta por id — importante: o shape do produto precisa ter id={`${product.id}`}
            const node =
                layer?.findOne?.(`#${pendingClickProductId}`) ??
                stage?.findOne?.(`#${pendingClickProductId}`);

            if (node) {
                node.fire("click");
                layer?.batchDraw?.();
                stage?.batchDraw?.();
                onClickHandled?.();
                return;
            }

            if (tries > 0) {
                requestAnimationFrame(() => tryClick(tries - 1));
            } else {
                console.warn(`Shape #${pendingClickProductId} não encontrado`);
                onClickHandled?.();
            }
        };

        tryClick();
        return () => {
            cancelled = true;
        };
    }, [pendingClickProductId, onClickHandled]);

    // --> TABLOIDES SECTION <--
    const [bgUrlState, setBgUrlState] = useState(null);
    const containerRef = useRef(null);
    const [bgFamily, setBgFamily] = useState(null);
    // escuta o evento vindo do FirstColumn <-
    useEffect(() => {
        const onSetBg = (e) => {
            const url = e?.detail?.url ?? null;
            setBgUrlState(url);
            console.log("[StageContent] BG set via event:", url);
        };
        window.addEventListener("SG_SET_BG", onSetBg);
        return () => window.removeEventListener("SG_SET_BG", onSetBg);
    }, []);

    const [bg, bgStatus] = useImage(bgUrlState ?? "", "anonymous");



    return (
        <div ref={containerRef}>

            <div
                className="konva-content"
                style={{ position: "relative", marginRight: "40px", marginTop: "30%" }}
            >
                {/* ⬅️ Input HTML fica FORA da Stage (sobreposição) */}
                {editingTextIndex !== null && (
                    <input
                        className="changeText"
                        type="text"
                        value={tempTextValue}
                        onChange={handleTextChange}
                        onBlur={saveTextChange}
                        autoFocus
                        style={{
                            position: "absolute",
                            top: inputPosition.y,
                            left: inputPosition.x,
                            width: 200,
                            border: 0,
                            fontSize: "22px",
                            padding: "4px",
                            background: "#fff",
                            outline: "none",
                            borderRadius: 0,
                            zIndex: 1000,
                        }}
                    />
                )}

                {/* ✅ ÚNICA Stage no tamanho EXATO do select (sem scale extra) */}
                <Stage
                    className="Stage"
                    ref={stageRef}
                    style={{ border: "1px solid", backgroundColor: "white" }}
                    width={selectedTabloid?.width ?? 600}
                    height={selectedTabloid?.height ?? 800}
                    scaleX={konvaScale}   // zoom seu (se quiser 1:1, mantenha em 1)
                    scaleY={konvaScale}
                    x={positionKonva.x}
                    y={positionKonva.y}
                    onWheel={handleWheel}
                    onMouseDown={(e) => {
                        if (e.target === e.target.getStage()) {
                            setSelectedShape(null);
                            setSelectedText(null);
                            handleDeselect();
                        }
                    }}
                >
                    {/* 🔒 BACKGROUND TRAVADO como primeira layer */}
                    <Layer listening={false}>
                        {bg && (() => {
                            const stageW = selectedTabloid?.width ?? 600;   // largura atual do canvas
                            const stageH = selectedTabloid?.height ?? 800;  // altura atual do canvas

                            const imgW = bg.width;   // tamanho real da imagem carregada
                            const imgH = bg.height;

                            // object-fit: 'cover' → preenche tudo sem distorcer (pode cortar bordas).
                            // se quiser ver a imagem inteira (com faixas), troque para 'contain'
                            const mode = 'cover';
                            const scale = mode === 'cover'
                                ? Math.max(stageW / imgW, stageH / imgH)
                                : Math.min(stageW / imgW, stageH / imgH);

                            const drawW = imgW * scale;
                            const drawH = imgH * scale;
                            const offsetX = (stageW - drawW) / 2;
                            const offsetY = (stageH - drawH) / 2;

                            return (
                                <KonvaImage
                                    image={bg}
                                    x={offsetX}
                                    y={offsetY}
                                    width={drawW}
                                    height={drawH}
                                    listening={false}
                                />
                            );
                        })()}
                    </Layer>

                    {/* Guias */}
                    <Layer>
                        {!!guides?.vertical && (
                            <Line
                                points={[guides.vertical, 0, guides.vertical, window.innerHeight]}
                                stroke="red"
                                strokeWidth={1}
                                dash={[4, 6]}
                            />
                        )}
                        {!!guides?.horizontal && (
                            <Line
                                points={[0, guides.horizontal, window.innerWidth, guides.horizontal]}
                                stroke="red"
                                strokeWidth={1}
                                dash={[4, 6]}
                            />
                        )}
                    </Layer>

                    {/* Suas layers inalteradas */}
                    <Layer id="shapesLayer">
                        {currentStage?.shapes?.map((shape) => (
                            <ShapesLayer
                                key={shape.id}
                                shape={shape}
                                handleSelect={handleSelect}
                                handleDragMove={handleDragMove}
                                handleDragEnd={handleDragEnd}
                                shapesRefs={shapesRefs}
                                handleTransformEndAndSaveToHistory={handleTransformEndAndSaveToHistory}
                                handleMouseEnter={handleMouseEnter}
                                handleMouseLeave={handleMouseLeave}
                            />
                        ))}
                    </Layer>

                    <Layer id="copiesLayer">
                        {currentStage?.copies?.map((copy) => (
                            <CopiesLayer
                                key={copy.id}
                                copy={copy}
                                handleSelect={handleSelect}
                                handleDragMove={handleDragMove}
                                handleDragEnd={handleDragEnd}
                                shapesRefs={shapesRefs}
                                handleTransformEndAndSaveToHistory={handleTransformEndAndSaveToHistory}
                                handleMouseEnter={handleMouseEnter}
                                handleMouseLeave={handleMouseLeave}
                            />
                        ))}
                    </Layer>

                    <Layer>
                        {currentStage?.boxData?.map((box) => (
                            <BoxDataLayer
                                key={box.id}
                                box={box}
                                handleSelect={handleSelect}
                                shapesRefs={shapesRefs}
                                handleMouseEnter={handleMouseEnter}
                                handleMouseLeave={handleMouseLeave}
                            />
                        ))}
                    </Layer>

                    <Layer id="productLayer" ref={productLayerRef} x={-400}
                        y={-400}>
                        {currentStage?.products?.map((product, index) => (
                            <ProductLayer
                                key={product.id}
                                product={product}
                                index={index}
                                handleSelect={handleSelect}
                                handleDragMove={handleDragMove}
                                handleDragEnd={handleDragEnd}
                                shapesRefs={shapesRefs}
                                handleTransformEndAndSaveToHistory={handleTransformEndAndSaveToHistory}
                                handleMouseEnter={handleMouseEnter}
                                handleMouseLeave={handleMouseLeave}
                                enableTextEditing={enableTextEditing}
                                groupRefs={groupRefs}
                                handleTransformGroup={handleTransformGroup}
                                logo={logo}
                                x={positionKonva.x}
                                y={positionKonva.y}

                            />

                        ))}
                        <Transformer
                            ref={trRef}
                            rotateEnabled={false}
                            enabledAnchors={[
                                'top-left', 'top-right', 'bottom-left', 'bottom-right',
                                'middle-left', 'middle-right', 'top-center', 'bottom-center'
                            ]}
                        />
                    </Layer>

                    <Layer id="textLayer">
                        {currentStage?.texts?.map((text) => (
                            <TextsLayer
                                key={text.id}
                                text={text}
                                handleSelect={handleSelect}
                                handleDragEnd={handleDragEnd}
                                enableTextEditing={enableTextEditing}
                                shapesRefs={shapesRefs}
                            />
                        ))}
                    </Layer>

                    <Layer>
                        {currentStage?.hasValidateDate && (
                            <ValidadeDateLayer
                                handleSelect={handleSelect}
                                formatedDateInitial={currentStage.formatedDateInitial}
                                formatedDateFinal={currentStage.formatedDateFinal}
                            />
                        )}
                    </Layer>

                    <Layer>
                        <InformationsLayer
                            informations={informations}
                            adress={adress}
                            handleSelect={handleSelect}
                            logoTel={logoTel}
                            logoWhats={logoWhats}
                        />
                    </Layer>

                    <Layer>
                        {currentStage?.stampsKonva?.map((stamp) => (
                            <StampsLayer
                                key={stamp.id}
                                stamp={stamp}
                                handleSelect={handleSelect}
                                shapesRefs={shapesRefs}
                            />
                        ))}

                        {selectedShape && (
                            <Transformer
                                ref={transformerRef}
                                rotateEnabled={true}
                                enabledAnchors={[
                                    "top-left",
                                    "top-right",
                                    "top-center",
                                    "bottom-left",
                                    "bottom-right",
                                    "bottom-center",
                                    "middle-left",
                                    "middle-right",
                                ]}
                                boundBoxFunc={(oldBox, newBox) => {
                                    if (newBox.width < 20 || newBox.height < 20) return oldBox;
                                    return newBox;
                                }}
                            />
                        )}

                        {selectedElements.length > 0 && (
                            <Transformer
                                ref={transformerRef}
                                boundBoxFunc={(oldBox, newBox) => {
                                    if (newBox.width < 20 || newBox.height < 20) return oldBox;
                                    return newBox;
                                }}
                            />
                        )}
                    </Layer>
                </Stage>
            </div>

            {/* Botões fora da Stage */}
            <div style={{ display: "flex", gap: "10px" }}>
                {/* ... seus botões exatamente como estavam ... */}
                <Button onClick={onClearCurrentPage} style={{ width: "20%", marginTop: "10px" }}>
                    Limpar Página
                </Button>

                <Button
                    onClick={() => {
                        setKonvaScale(1);
                        setPositionKonva({ x: 0, y: 0 });
                    }}
                    style={{ width: "20%", marginTop: "10px" }}
                >
                    Voltar Padrão
                </Button>

                {stageQuantity.length > 1 && (
                    <Button
                        style={{ width: "10%", marginTop: "10px" }}
                        onClick={() => prevStage()}
                        disabled={currentStage?.id === 1}
                    >
                        <ArrowLeft />
                    </Button>
                )}

                <Button
                    onClick={() => {
                        addNewStage();
                    }}
                    style={{ width: "10%", marginTop: "10px" }}
                >
                    <Plus />
                </Button>

                {stageQuantity.length > 1 && (
                    <Button
                        style={{ width: "10%", marginTop: "10px" }}
                        onClick={() => nextStage()}
                        disabled={currentStage?.id === stageQuantity.length}
                    >
                        <ArrowRight />
                    </Button>
                )}

                {stageQuantity.length > 1 && (
                    <Button
                        style={{ width: "10%", marginTop: "10px" }}
                        onClick={() => deleteKonvaStage(currentStage?.id)}
                        disabled={currentStage?.id === 1}
                    >
                        Apagar Página
                    </Button>
                )}
            </div>
        </div>
    );


};
