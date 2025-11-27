import FirstColumn from "./components/FirstColumn/FirstColumn";
import { useEffect, useState, useRef, useContext } from "react";
import { FindProduct } from "../../services/Products/Products";
import SecondColumn from "./components/SecondColumn/SecondColumn";
import { svgPathData } from './SvgForKonva/SvgEditTools'
import './index.css'
import { optionsFont, optionsFontSize, optionsOutlineSize, optionsBorderRadius } from "./OptionsApplication";
import { fetchExempleImage } from "../../services/ExempleImage/Exemples";
import { updateUserInformations } from "../../services/User/User";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useStamps } from "../../contexts/StampsContext";
import { useBox } from "../../contexts/BoxContext";
import NavBar from "../HomePage/components/NavBar/NavBar";
import { UserContext } from "../../contexts/UserContext";
import { Stage, Layer } from 'react-konva';
import React from 'react';
import { StageConfigProvider } from "./components/SecondColumn/components/Konva/StageConfigContext.jsx";

const Aplication = () => {
    const [exporter, setExporter] = useState(null);
    const autoClick = (id) => {
        if (id == null) return;
        requestAnimationFrame(() => setPendingClickProductId(String(id)));
    };
    const [pendingClickProductId, setPendingClickProductId] = useState(null);

    const { stampsKonva, setStampsKonva } = useStamps();
    const { boxData, setBoxData } = useBox()

    const { id } = useParams()

    const [stageQuantity, setStageQuantity] = useState([{ id: 1, products: [], copies: [], texts: [], shapes: [], boxData: [], stampsKonva: [], hasValidateDate: false, formatedDateInitial: '', formatedDateFinal: '', history: [] }])

    if (typeof window !== 'undefined' && !window.__corsImgShim) {
        const NativeImage = window.Image;
        window.Image = function (...args) {
            const img = new NativeImage(...args);
            try { img.crossOrigin = 'anonymous'; } catch { }
            return img;
        };
        window.__corsImgShim = true;
    }

    const [quantityProduct, setQuantityProduct] = useState(0)
    const [valueInputs, setValueInputs] = useState(['']);
    const [visibleModalIndex, setVisibleModalIndex] = useState(null);
    const [matchingProducts, setMatchingProducts] = useState([]);
    const [nameProduct, setNameProduct] = useState('');
    const [imageProduct, setImageProduct] = useState('');



    const [selectedOption, setSelectedOption] = useState('1');


    const [selectedTabloid, setSelectedTabloid] = useState(null);


    const [products, setProducts] = useState([])
    const [shapes, setShapes] = useState([]);
    const [copies, setCopies] = useState([]);
    const [selectedText, setSelectedText] = useState(null);
    const [texts, setTexts] = useState([]);


    const [editingTextIndex, setEditingTextIndex] = useState(null);
    const [tempTextValue, setTempTextValue] = useState("");
    const [inputPosition, setInputPosition] = useState({ x: 0, y: 0 });

    const [history, setHistory] = useState(JSON.parse(localStorage.getItem('history')) || []);
    const [currentHistoryIndex, setCurrentHistoryIndex] = useState(-1);

    const [selectedOptionFont, setSelectedOptionFont] = useState('');

    const [isBold, setIsBold] = useState(false);


    const [selectedShape, setSelectedShape] = useState(null);
    const [selectedElements, setSelectedElements] = useState([]);



    const [backgroundImage, setBackgroundImage] = useState(null);


    const stageRef = useRef(null);
    const imageRef = useRef(null); //Variável state para referência a imagem no konva
    const textRef = useRef(null);
    const transformerRef = useRef(null);
    const shapesRefs = useRef([]);

    const [guides, setGuides] = useState({ vertical: null, horizontal: null });

    const [onModalColor, setOnModalColor] = useState(false)
    const [startColor, setStartColor] = useState("#ff0000"); // Cor inicial
    const [endColor, setEndColor] = useState("#ff0000");

    const [isGradient, setIsGradient] = useState(false); // Estado para alternar entre sólido e gradiente
    const [solidColor, setSolidColor] = useState("#00ff00"); // Cor sólida inicial


    const [isValidate, setIsValidate] = useState(false) // Estado para validar o formulário 
    const [modalOfDates, setModalOfDates] = useState(false)
    const [dateInitial, setDateInitial] = useState("")
    const [dateFinal, setDateFinal] = useState("");
    const [formatedDateInitial, setFormatedDateInitial] = useState('')
    const [formatedDateFinal, setFormatedDateFinal] = useState('')

    const [modalBorderRadius, setModalBorderRadius] = useState(false)
    const [borderRadius, setBorderRadius] = useState(0)

    const [blobImg, setBlobImg] = useState([])

    const { user } = useContext(UserContext)
    const [informationsModal, setInformationsModal] = useState(false)
    const [contentAdress, setContentAdress] = useState(0);
    const [Logo, setLogo] = useState(user ? user.Logo : null)
    const [adress, setAdress] = useState(false)

    const [modalRegisterProduct, setModalRegisterProduct] = useState(false)

    const [stageId, setStageId] = useState(1)

    const [groups, setGroups] = useState([]);



    useEffect(() => {
        setStageQuantity((prevStage) => {
            return prevStage.map((stage) => {
                if (stage?.id === stageId) {
                    return {
                        ...stage,
                        products: products,
                        copies: copies,
                        texts: texts,
                        shapes: shapes,
                        boxData: boxData,
                        stampsKonva: stampsKonva,
                        hasValidateDate: isValidate,
                        formatedDateInitial: formatedDateInitial,
                        formatedDateFinal: formatedDateFinal,
                        history: history
                    }
                }

                return stage
            })
        })

    }, [products, copies, texts, shapes, boxData, stampsKonva, isValidate, formatedDateInitial, formatedDateFinal, history])

    const addNewStage = () => {
        setStageQuantity((prevStages) => {
            const newStage = {
                id: prevStages.length + 1, // Agora pega o tamanho atualizado
                products: [],
                copies: [],
                texts: [],
                shapes: [],
                boxData: [],
                stampsKonva: [],
                hasValidateDate: false,
                formatedDateInitial: '',
                formatedDateFinal: '',
            };
            return [...prevStages, newStage];
        });
        setStageId(stageQuantity.length + 1)
        setProducts([])
        setCopies([])
        setShapes([])
        setTexts([])
        setBoxData([])
        setStampsKonva([])
        setIsValidate(false)
        setFormatedDateInitial('')
        setFormatedDateFinal('')
        setHistory([])
    }

    const prevStage = () => {
        const currentStageId = stageId === 1 ? 1 : stageId - 1
        const currentStage = stageQuantity.find((stage) => stage.id === currentStageId)
        setStageId(currentStageId)
        setProducts(currentStage.products)
        setCopies(currentStage.copies)
        setShapes(currentStage.shapes)
        setTexts(currentStage.texts)
        setBoxData(currentStage.boxData)
        setStampsKonva(currentStage.stampsKonva)
        setIsValidate(currentStage.hasValidateDate)
        setFormatedDateInitial(currentStage.formatedDateInitial)
        setFormatedDateFinal(currentStage.formatedDateFinal)
        setHistory(currentStage.history)

    }

    const nextStage = () => {
        const currentStageId = stageId === stageQuantity.length ? stageQuantity.length : stageId + 1
        const currentStage = stageQuantity.find((stage) => stage.id === currentStageId)
        setStageId(currentStageId)
        setProducts(currentStage.products)
        setCopies(currentStage.copies)
        setShapes(currentStage.shapes)
        setTexts(currentStage.texts)
        setBoxData(currentStage.boxData)
        setStampsKonva(currentStage.stampsKonva)
        setIsValidate(currentStage.hasValidateDate)
        setFormatedDateInitial(currentStage.formatedDateInitial)
        setFormatedDateFinal(currentStage.formatedDateFinal)
        setHistory(currentStage.history)
    }

    useEffect(() => {
    }, [stageQuantity])






    //funções sobre informações do mercados
    const addContentAdress = () => {
        setContentAdress((qtdContent) => parseInt(qtdContent + 1))
    }

    const handleInformationsModal = () => {
        setInformationsModal((prev) => !prev)
    }

    const handleSaveInformations = async (values) => {
        try {
            const addresses = Array.from({ length: contentAdress }).map((_, i) => ({
                Adress: values[`Adress-${i}`] ?? "",
                Telefone: values[`Telefone-${i}`] ?? "",
                Whatsapp: values[`Whatsapp-${i}`] ?? "",
                horaFuncionamento: values[`horaFuncionamento-${i}`] ?? "",
            }));

            const resp = await updateUserInformations({ Logo, addresses, id });

            if (resp?.status >= 200 && resp?.status < 300) {
                setInformationsModal(false);
                window.location.reload();
            } else {
                console.warn("Falha ao salvar:", resp?.status, resp?.data);
            }
        } catch (err) {
            console.error(
                "Erro ao salvar informações:",
                err?.response?.status,
                err?.response?.data || err?.message
            );
        }
    };

    // helper opcional para parse seguro
    const parseArray = (val) => {
        try {
            const v = typeof val === 'string' ? JSON.parse(val) : val;
            return Array.isArray(v) ? v : [];
        } catch {
            return [];
        }
    };

    useEffect(() => {
        // 1) informations
        try {
            const raw = user?.Adress ?? '[]';
            const arr = parseArray(raw);
            setContentAdress(arr.length);
        } catch {
            setContentAdress(0);
        }

        // 2) history do localStorage (NÃO use o nome "history" para evitar window.history)
        const savedStr = localStorage.getItem('history');
        if (savedStr) {
            const saved = parseArray(savedStr);            // vira []
            const last = saved[saved.length - 1] || {};  // último estado salvo

            // shapes/texts/copies com defaults
            setShapes(Array.isArray(last.shapes) ? last.shapes : []);
            setTexts(Array.isArray(last.texts) ? last.texts : []);
            setCopies(Array.isArray(last.copies) ? last.copies : []);

            // products com defaults + hidratar imagem
            const hydrated = (Array.isArray(last.products) ? last.products : []).map((product) => {
                const newImage = new Image();
                newImage.crossOrigin = 'anonymous';
                newImage.src = product.imageSrc || product?.image?.src || '';
                newImage.onload = () => { };
                newImage.onerror = (err) => {
                    console.error(`Erro ao carregar a imagem do produto ${product?.name ?? ''}:`, err);
                };
                return { ...product, image: newImage };
            });

            setProducts(hydrated);
        }

        // 3) quantityProduct
        const qStr = localStorage.getItem('quantityProduct');
        const qNum = qStr ? Number(qStr) : 0;
        if (qNum > 0) setQuantityProduct(qNum);
    }, [user]);



    //Funções sobre produto

    const addContentProduct = (value) => {
        const n = Number(value);
        const qty = Number.isFinite(n) ? n : 0;
        setQuantityProduct(qty);
        localStorage.setItem("quantityProduct", String(qty));
    };

    const addContentProductWithButton = () => {
        setQuantityProduct((prev) => {
            const base = Number(prev);
            const newValue = (Number.isFinite(base) ? base : 0) + 1;
            localStorage.setItem("quantityProduct", String(newValue));
            return newValue;
        });
    };


    const debounceTimeout = useRef(null);

    const handleNameProduct = async (e, index) => {
        const value = e.target.value;

        // Atualiza o valor do input correspondente no array
        const newValueInputs = [...valueInputs];
        newValueInputs[index] = value;
        setValueInputs(newValueInputs);


        if (value.trim().length > 0) {
            setVisibleModalIndex(index);
        } else {
            setVisibleModalIndex(null);
        }

        if (debounceTimeout.current) {
            clearTimeout(debounceTimeout.current);
        }

        debounceTimeout.current = setTimeout(async () => {
            try {
                const response = await FindProduct(value)

                const products = Array.isArray(response) ? response : response;
                setMatchingProducts(products);
            } catch (error) {
                console.error('Erro ao buscar produto:', error);
            }
        }, 500)


    };

    const handleSelectProduct = (product, index) => {

        setNameProduct(product.name); // Atualiza o nome do produto
        setImageProduct(product.img); // Atualiza a URL da imagem
        setMatchingProducts([]); // Limpa as sugestões
        setVisibleModalIndex(null); // Oculta o modal



        const productsPerRow = 4; // Número de produtos por linha
        const spacing = 10; // Espaçamento entre produtos
        const row = Math.floor(index / productsPerRow); // Calcular a linha
        const col = index % productsPerRow; // Calcular a coluna
        let x = col * 150 + spacing; // Calcular a coordenada x
        let y = row * 150 + spacing + 200; // Calcular a coordenada y

        if (selectedOption === '1') {
            x = selectedTabloid?.width ?? 700 / 3;
            y = selectedTabloid?.height ?? 800 / 2;
        }



        // Adiciona o produto diretamente
        const newProduct = {
            id: `${Date.now()}`,
            name: product.name,
            ean: product.ean,
            valor: 0,
            valor2: "0",
            x: x,
            y: y,
            textBold: false,
            // width: 100,
            // height: 100,
            radio: "",
            image: new window.Image(),
            imageSrc: product.img,
        };
        newProduct.image.src = product.img;
        newProduct.image.onload = () => {
            setProducts(prevProducts => {
                const updatedProducts = [...prevProducts, newProduct];
                updatedProducts[index] = newProduct;
                saveToHistory(shapes, updatedProducts.map(product => ({
                    ...product,
                    imageSrc: product.image.src // Salvar a URL da imagem
                })), copies, texts); // Save to history after updating products
                return updatedProducts;
            });
        };

        // Seleciona o novo produto após adicioná-lo


        // setTimeout(() => {
        //     const stage = stageRef.current;
        //     const layer = layerRef.current ?? stage?.findOne?.('#productLayer');
        //     if (!layer) return; // evita erro

        //     const shapeNode = layer.findOne?.(`#${newProduct.id}`) ?? stage?.findOne?.(`#${newProduct.id}`);
        //     if (shapeNode) {
        //         shapeNode.fire('click');
        //         layer?.batchDraw?.();
        //         stage?.batchDraw?.();
        //     }
        // }, 0);

        setPendingClickProductId(newProduct.id);
    }


    const handleChangeRadio = (value, idProduct) => {
        products.filter(products => products.id === idProduct)[0].radio = value;
    }

    const handleProductChange = (e, index, field) => {
        const value = e.target.value;
        setProducts(prevProducts => {
            const updatedProducts = [...prevProducts];
            updatedProducts[index] = {
                ...updatedProducts[index],
                [field]: value
            };
            return updatedProducts;
        });
    };

    const handleRemoveProduct = (index) => {
        setProducts((prevProducts) => prevProducts.filter((_, i) => i !== index));
        setQuantityProduct((prev) => parseInt(prev) - 1)
    };


    useEffect(() => {
        let alive = true;

        const loadExampleImages = async () => {
            try {
                const imgs = await fetchExempleImage();           // <- sua função já existente
                const list = Array.isArray(imgs) ? imgs : [];

                const urls = list
                    .map((item) => {
                        const raw = item?.img ?? "";
                        if (!raw) return null;
                        // se já vier como data URL, usa; senão, prefixa base64
                        return raw.startsWith("data:")
                            ? raw.trim()
                            : `data:image/png;base64,${raw}`;
                    })
                    .filter(Boolean);

                if (!alive) return;
                setBlobImg(urls);

                // expõe para debug no console
                window.__blobImg = urls;
                // console.log("[exemples] qtd:", urls.length, "amostra:", urls[0]?.slice(0, 40));
            } catch (err) {
                console.error("Erro ao carregar exemples:", err);
                if (!alive) return;
                setBlobImg([]);
                window.__blobImg = [];
            }
        };

        loadExampleImages();
        return () => { alive = false; };
    }, []); // roda só no mount



    //Fim funções Produto

    //Função Background
    const handleBackgroundChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const img = new window.Image();
                img.src = reader.result; // Define a imagem carregada como a nova imagem de fundo
                img.onload = () => {
                    setBackgroundImage(img); // Atualiza o estado com a imagem de fundo
                };
            };
            reader.readAsDataURL(file); // Lê a imagem como uma URL
        }
    };

    // funções editTools

    //FUNÇÃO DO BOTÃO DE LOCALIZAÇÃO - SEM FUNÇÃO APARENTE SOMENTE COR DO BOTÃO 
    const handleAdressButton = () => {
        const buttons = document.getElementsByClassName("addressButton");
        if (buttons.length > 0) {
            buttons[0].style.backgroundColor = buttons[0].style.backgroundColor === "red" ? "#ccc" : "red";
        }

        setAdress((prev) => !prev)
    };

    const handleSelectFont = (selectedFont) => {

        setSelectedOptionFont(selectedFont);

        if (!selectedShape) return;

        // 1) Atualiza o texto principal (como já fazia)
        if (selectedShape.attrs.text) {
            selectedShape.fontFamily(selectedFont);

            // 2) Acha o outline pelo id
            const layer = selectedShape.getLayer();
            const outline = layer?.findOne?.(`#${selectedShape.attrs.id}-outline`);

            // 3) Atualiza a fonte do contorno (SE existir)
            if (outline) {
                outline.fontFamily(selectedFont);
            }

            // 4) Redesenha a layer
            layer.batchDraw();
        }
    };


    // const handleOutlineSize = (selectedSize) => {
    //     if (selectedShape) {

    //         setTexts((prevTexts) =>
    //             prevTexts.map((textItem) =>
    //                 textItem.id === selectedShape.attrs.id
    //                     ? {
    //                         ...textItem,
    //                         strokeTam: selectedSize
    //                     }
    //                     : textItem
    //             ))
    //     }
    // }

    const INITIAL_STAGE = { shapes: [], texts: [] };
    const [currentStage, setCurrentStage] = React.useState(INITIAL_STAGE);


    const handleColorChange = (color) => {
        if (!selectedShape) return;

        const node = selectedShape;                 // nó Konva selecionado
        const id = node?.attrs?.id;                 // id que você já usa
        const nodeType = node?.getClassName?.();    // 'Text', 'Rect', 'Star', etc.

        // 1) Atualiza o estado "fonte da verdade" que o Stage lê
        setCurrentStage((prev) => {
            if (!prev) return prev;

            if (nodeType === 'Text') {
                const texts = prev.texts?.map((t) =>
                    t.id === id
                        ? {
                            ...t,
                            fill: color,
                            // por via das dúvidas, desligue gradiente:
                            isGradient: false,
                            fillLinearGradientColorStops: undefined,
                            fillLinearGradientStartPoint: undefined,
                            fillLinearGradientEndPoint: undefined,
                        }
                        : t
                );
                return { ...prev, texts };
            } else {
                const shapes = prev.shapes?.map((s) =>
                    s.id === id
                        ? {
                            ...s,
                            fill: color,
                            isGradient: false,
                            fillLinearGradientColorStops: undefined,
                            fillLinearGradientStartPoint: undefined,
                            fillLinearGradientEndPoint: undefined,
                        }
                        : s
                );
                return { ...prev, shapes };
            }
        });

        // 2) Atualiza o nó Konva atual (efeito visual imediato)
        try {
            node.fill(color);
            node.getLayer()?.batchDraw();
        } catch (_) {
            // silencioso: se o nó não existir, o estado acima ainda garante a atualização
        }
    };


    const handleGradientColorChange = (startColor, endColor) => {
        // Verifica se um texto ou forma está selecionado
        if (selectedText) {
            // Atualiza o texto para ter um gradiente
            selectedText.fillLinearGradientStartPoint({ x: 0, y: 0 });
            selectedText.fillLinearGradientEndPoint({ x: selectedText.width(), y: 0 });
            selectedText.fillLinearGradientColorStops([0, startColor, 1, endColor]);
            selectedText.getLayer().batchDraw(); // Atualiza a camada
        } else if (selectedShape) {
            // Atualiza a forma para ter um gradiente
            selectedShape.fillLinearGradientStartPoint({ x: 0, y: 0 });
            selectedShape.fillLinearGradientEndPoint({ x: selectedShape.width(), y: 0 });
            selectedShape.fillLinearGradientColorStops([0, startColor, 1, endColor]);
            selectedShape.getLayer().batchDraw(); // Atualiza a camada

        }
    };

    const alterShapeForGradientType = (value) => {
        if (selectedShape) {
            // Converte o valor do select para booleano
            const isGradient = value === 'true'

            // Atualiza a propriedade isGradient
            selectedShape.isGradient = isGradient;



            if (isGradient) {
                // Define propriedades de gradiente
                selectedShape.fill('');
                selectedShape.fillLinearGradientColorStops([0, startColor || "red", 1, endColor]);
                selectedShape.fillLinearGradientStartPoint({ x: 0, y: 0 });
                selectedShape.fillLinearGradientEndPoint({ x: selectedShape.width(), y: 0 });
            } else {
                // Define uma cor sólida
                selectedShape.fill('red'); // Atribui a cor sólida
                selectedShape.fillLinearGradientColorStops([]); // Limpa as propriedades do gradiente
                selectedShape.fillLinearGradientStartPoint(undefined);
                selectedShape.fillLinearGradientEndPoint(undefined);
            }

            // Atualiza a camada para refletir as mudanças
            selectedShape.getLayer().batchDraw();
        }
    };

    const alterDirectionGradienta = (type) => {
        selectedShape.fillLinearGradientStartPoint({ x: 0, y: 0 });
        selectedShape.fillLinearGradientEndPoint({ x: selectedShape.width(), y: 0 });
        selectedShape.fillLinearGradientColorStops([0, startColor, 1, endColor]);
        selectedShape.fillRadialGradientStartPoint(undefined) // ponto de início (centro do retângulo)
        selectedShape.fillRadialGradientEndPoint(undefined) // ponto final (também no centro)
        selectedShape.fillRadialGradientStartRadius(undefined) // raio inicial do gradiente
        selectedShape.fillRadialGradientEndRadius(undefined) // raio final, determinando até onde o gradiente se espalha
        selectedShape.fillRadialGradientColorStops(undefined)
        const gradientDirections = {
            rigthToLeft: { start: { x: 100, y: 0 }, end: { x: 0, y: 0 } },
            downToUp: { start: { x: 0, y: 100 }, end: { x: 0, y: 0 } },
            leftToRight: { start: { x: 0, y: 0 }, end: { x: 100, y: 0 } },
            upToDown: { start: { x: 0, y: 0 }, end: { x: 0, y: 100 } },
        };

        const points = gradientDirections[type];
        if (points) {
            selectedShape.fillLinearGradientStartPoint(points.start);
            selectedShape.fillLinearGradientEndPoint(points.end);
            selectedShape.getLayer().batchDraw();
        }
    }

    const circleGradientType = (type) => {

        if (selectedShape) {
            if (selectedShape.fillLinearGradientStartPointX !== undefined) {
                selectedShape.fillLinearGradientStartPointX(null);
                selectedShape.fillLinearGradientStartPointY(null);
                selectedShape.fillLinearGradientColorStops(undefined)
            } else {
                selectedShape.fillLinearGradientStartPointX(undefined);
                selectedShape.fillLinearGradientStartPointY(undefined);
            }

            if (selectedShape.fillLinearGradientEndPointX !== undefined) {
                selectedShape.fillLinearGradientEndPointX(null);
                selectedShape.fillLinearGradientEndPointY(null);
            } else {
                selectedShape.fillLinearGradientEndPointX(undefined);
                selectedShape.fillLinearGradientEndPointY(undefined);
            }

            const gradientDirections = {
                midToExtreme: { start: 0, end: 50 },
                extremesToMid: { start: 50, end: 0 },
            }

            const gradienteDirectiosPath = {
                midToExtreme: { start: 0, end: 110 },
                extremesToMid: { start: 110, end: 0 }
            }



            const points = gradientDirections[type];
            const pointsPath = gradienteDirectiosPath[type];

            if (selectedShape.radius) {
                selectedShape.fillRadialGradientStartPoint({ x: 0, y: 0 })
                selectedShape.fillRadialGradientEndPoint({ x: 0, y: 0 })
                selectedShape.fillRadialGradientStartRadius(points.start)
                selectedShape.fillRadialGradientEndRadius(points.end)
                selectedShape.fillRadialGradientColorStops([
                    0, startColor,
                    1, endColor
                ])
            } else if (selectedShape.numPoints) {
                selectedShape.fillRadialGradientStartPoint({ x: 0, y: 0 })
                selectedShape.fillRadialGradientEndPoint({ x: 0, y: 0 })
                selectedShape.fillRadialGradientStartRadius(points.start)
                selectedShape.fillRadialGradientEndRadius(points.end)
                selectedShape.fillRadialGradientColorStops([
                    0, startColor,
                    1, endColor
                ])
            } else if (selectedShape.attrs.type === 'path') {
                selectedShape.fillRadialGradientStartPoint({ x: 110, y: 110 })
                selectedShape.fillRadialGradientEndPoint({ x: 110, y: 110 })
                selectedShape.fillRadialGradientStartRadius(pointsPath.start)
                selectedShape.fillRadialGradientEndRadius(pointsPath.end)
                selectedShape.fillRadialGradientColorStops([
                    0, startColor,
                    1, endColor
                ])
            } else {
                selectedShape.fillRadialGradientStartPoint({ x: 50, y: 50 })
                selectedShape.fillRadialGradientEndPoint({ x: 50, y: 50 })
                selectedShape.fillRadialGradientStartRadius(points.start)
                selectedShape.fillRadialGradientEndRadius(points.end)
                selectedShape.fillRadialGradientColorStops([
                    0, startColor,
                    1, endColor
                ])
            }
            selectedShape.getLayer().batchDraw();
        }
    };


    // helper: normaliza hex (#RGB e #RGBA curto) para #RRGGBB
    const normalizeHex = (hex) => {
        if (!hex) return "#000000";
        if (/^#([0-9a-fA-F]{4})$/.test(hex)) {
            // #RGBA curto -> usa só RGB duplicado
            const h = hex.slice(1);
            return "#" + h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
        }
        if (/^#([0-9a-fA-F]{3})$/.test(hex)) {
            const h = hex.slice(1);
            return "#" + h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
        }
        return hex;
    };

    const getProductBaseId = (nodeId = "") => {
        if (nodeId.endsWith("-price")) return nodeId.replace(/-price$/, "");
        if (nodeId.endsWith("-name-text")) return nodeId.replace(/-name-text$/, "");
        return null;
    };

    const handleOutlineColorChange = (color) => {
        const optionOutline = document.getElementById("outLineSelect");
        optionOutline?.focus();

        if (!selectedShape) return;
        // garanta que é um Text (não mexe em shapes)
        if (selectedShape.getClassName && selectedShape.getClassName() !== "Text") return;

        const id = selectedShape.attrs?.id;
        const safeColor = normalizeHex(color);

        const productId = getProductBaseId(id);

        if (productId && typeof setProducts === "function") {
            // === PRODUTOS ===
            setProducts((prev) =>
                prev.map((p) =>
                    p.id === productId
                        ? {
                            ...p,
                            outline: safeColor,
                            // se não tiver espessura ainda, define 1 como padrão
                            strokeTam: p.strokeTam > 0 ? p.strokeTam : 1,
                        }
                        : p
                )
            );
        } else {
            // === TEXTOS (como já era) ===
            setTexts((prevTexts) =>
                prevTexts.map((t) =>
                    t.id === id
                        ? {
                            ...t,
                            outline: safeColor,
                            strokeTam: t.strokeTam > 0 ? t.strokeTam : 1,
                        }
                        : t
                )
            );
        }

        // 2) sincroniza o nó Konva atual (feedback imediato e mantém seu disabled em dia)
        try {
            const strokeTam = selectedShape.attrs.strokeTam > 0 ? selectedShape.attrs.strokeTam : 1;
            selectedShape.setAttrs({ outline: safeColor, strokeTam });
            selectedShape.getLayer()?.batchDraw();
        } catch { }
    };

    const handleOutlineSize = (selectedSize) => {
        if (!selectedShape) return;
        if (selectedShape.getClassName && selectedShape.getClassName() !== "Text") return;

        const id = selectedShape.attrs?.id;
        const width = Number(selectedSize) || 0;

        const productId = getProductBaseId(id);

        if (productId && typeof setProducts === "function") {
            // === PRODUTOS ===
            setProducts((prev) =>
                prev.map((p) => (p.id === productId ? { ...p, strokeTam: width } : p))
            );
        } else {
            // === TEXTOS (como já era) ===
            setTexts((prevTexts) =>
                prevTexts.map((t) => (t.id === id ? { ...t, strokeTam: width } : t))
            );
        }

        // 2) sincroniza nó Konva
        try {
            selectedShape.setAttrs({ strokeTam: width });
            selectedShape.getLayer()?.batchDraw();
        } catch { }
    };

    // function textdetailOutline() {
    //     console.log("outline exposta")
    //     function describe('first', () => { second }) (params) {
    //     }
    // };


    // funções do histórico
    function rehydrateProducts(products = []) {
        return products.map((product) => {
            const { imageSrc, ...rest } = product;
            const img = new Image();
            img.crossOrigin = 'anonymous';
            img.src = imageSrc;
            img.onload = () => { };
            img.onerror = (err) => {
                console.error(`Erro ao carregar a imagem do produto ${product?.name ?? ''}:`, err);
            };
            return { ...rest, imageSrc, image: img };
        });
    }

    // import { Outline } from '@react-three/postprocessing';
    // import { BlendFunction, KernelSize } from 'postprocessing'


    // <Outline
    //     selection={[meshRef1, meshRef2]} // selection of objects that will be outlined
    //     selectionLayer={10}// selection layer
    //     blendFunction={BlendFunction.SCREEN} // set this to BlendFunction.ALPHA for dark outlines
    //     patternTexture={null} // a pattern texture
    //     edgeStrength={2.5} // the edge strength
    //     pulseSpeed={0.0} // a pulse speed. A value of zero disables the pulse effect
    //     visibleEdgeColor={0xffffff} // the color of visible edges
    //     hiddenEdgeColor={0x22090a} // the color of hidden edges
    //     width={Resizer.AUTO_SIZE} // render width
    //     height={Resizer.AUTO_SIZE} ()// render height
    //     kernelSize={KernelSize.LARGE} // blur kernel size
    //     blur={false} // whether the outline should be blurred
    //     xRay={true} // indicates whether X-Ray outlines are enabled
    // />



    // NOVO: rehidratar boxes
    function rehydrateBoxes(boxes = []) {
        return boxes.map((box) => {
            const { imageSrc, ...rest } = box;
            const img = new Image();
            img.crossOrigin = 'anonymous';
            img.src = imageSrc;
            img.onload = () => { };
            img.onerror = (err) => {
                console.error(`Erro ao carregar a imagem do box ${box?.id ?? ''}:`, err);
            };
            return { ...rest, imageSrc, image: img };
        });
    }

    // NOVO: rehidratar stamps
    function rehydrateStamps(stamps = []) {
        return stamps.map((stamp) => {
            const { imageSrc, ...rest } = stamp;
            const img = new Image();
            img.crossOrigin = 'anonymous';
            img.src = imageSrc;
            img.onload = () => { };
            img.onerror = (err) => {
                console.error(`Erro ao carregar a imagem do selo ${stamp?.id ?? ''}:`, err);
            };
            return { ...rest, imageSrc, image: img };
        });
    }

    function restoreFromHistory(targetIndex) {
        if (!Array.isArray(history) || targetIndex < 0 || targetIndex >= history.length) return;

        const snapshot = history[targetIndex];
        if (!snapshot) return;

        const {
            shapes = [],
            products = [],
            copies = [],
            texts = [],
            boxData = [],       // <- NOVO
            stampsKonva = [],   // <- NOVO
        } = snapshot;

        const productsWithImages = rehydrateProducts(products);
        const boxesWithImages = rehydrateBoxes(boxData);       // <- NOVO
        const stampsWithImages = rehydrateStamps(stampsKonva);  // <- NOVO

        setShapes(shapes);
        setProducts(productsWithImages);
        setCopies(copies);
        setTexts(texts);
        setBoxData(boxesWithImages);         // <- NOVO
        setStampsKonva(stampsWithImages);    // <- NOVO

        setCurrentHistoryIndex(targetIndex);
    }

    const handlePrev = () => {
        if (currentHistoryIndex > 0) {
            restoreFromHistory(currentHistoryIndex - 1);
        }
    };

    //  const handlePrev = () => {};

    const handleNext = () => {
        if (history.length > 0 && currentHistoryIndex < history.length - 1) {
            restoreFromHistory(currentHistoryIndex + 1);
        }
    };

    const openModalDates = () => {
        setModalOfDates((prev) => !prev)
    }

    const selectedDateInitial = (date) => {
        const [year, month, day] = date.split('-')
        const formatted = `${day}/${month}/${year}`
        setFormatedDateInitial(formatted)
    }
    const selectedDateFinal = (date) => {
        const [year, month, day] = date.split('-')
        const formatted = `${day}/${month}/${year}`
        setFormatedDateFinal(formatted)
    }

    const handleValidate = () => {
        setIsValidate(true)
    }

    useEffect(() => {
        selectedShape?.attrs?.type === "rectangle" && setModalBorderRadius(true);
        if (selectedShape === null || selectedShape?.attrs?.type !== 'rectangle') {
            setModalBorderRadius(false);
        }
    }, [selectedShape]);

    const handleBorderRadius = (value) => {
        selectedShape.attrs.cornerRadius = parseInt(value)
    }

    //fim de funções histórico    

    //função de duplicar imagem
    const duplicateShape = () => {
        if (selectedShape) {
            const newCopy = {
                ...selectedShape.attrs,
                id: `${Date.now()}`, // Gera um novo ID único
                x: selectedShape.attrs.x - 30, // Mantém a posição x original
                y: selectedShape.attrs.y + 30, // Ajusta a posição y para a duplicata
                fill: selectedShape.attrs.fill
            };


            const updatedShapes = [...copies, newCopy];
            setCopies(updatedShapes);
            saveToHistory(shapes, products, updatedShapes, texts);
            autoClick(newCopy.id);

        }
    }

    const handleShadowShape = () => {
        if (selectedShape) {
            selectedShape.shadowColor('black'); // Altera a cor da sombra do shape
            selectedShape.shadowOpacity(1)
            selectedShape.shadowBlur(10); // Altera o desfoque da sombra do shape
            selectedShape.shadowOffsetX(1); // Altera o deslocamento horizontal da sombra do shape
            selectedShape.shadowOffsetY(1); // Altera o deslocamento vertical da sombra do shape
            selectedShape.getLayer().batchDraw();
        } else if (selectedText) {
            selectedShape.shadowColor('black'); // Altera a cor da sombra do shape
            selectedShape.shadowBlur(5); // Altera o desfoque da sombra do shape
            selectedShape.shadowOffsetX(2); // Altera o deslocamento horizontal da sombra do shape
            selectedShape.shadowOffsetY(2); // Altera o deslocamento vertical da sombra do shape
            selectedShape.getLayer().batchDraw();
        }
    }

    const toggleBold = () => {
        selectedShape.attrs.fontStyle === "bold" ? selectedShape.attrs.fontStyle = "normal" : selectedShape.attrs.fontStyle = "bold"
    };

    const handleSelectFontSize = (fontsize) => {
        if (selectedShape) {
            if (selectedShape.attrs.text) {
                selectedShape.fontSize(fontsize);
                selectedShape.getLayer().batchDraw()
            }
        }
    }


    const addTextBox = () => {
        const newText = {
            id: `${Date.now()}`,
            x: 100,
            y: 100,
            text: "Nova caixa de texto",
            fontSize: 48,
            scaleX: 1,
            scaleY: 1,
            strokeTam: 0
        };
        const updatedTexts = [...texts, newText];
        setTexts(updatedTexts);
        saveToHistory(shapes, products, copies, updatedTexts); // Salva o estado atualizado
        autoClick(newText.id);

    };


    // Função para ativar a edição e posicionar o input
    const enableTextEditing = (textId, textX, textY, initialText) => {
        setEditingTextIndex(textId);
        setTempTextValue(initialText);
        setInputPosition({ x: textX, y: textY });
    };

    // Função para capturar o valor do input
    const handleTextChange = (e) => {
        setTempTextValue(e.target.value);
    };

    // Função para salvar o texto editado e ocultar o input
    const saveTextChange = () => {
        setTexts((prevTexts) =>
            prevTexts.map((text) =>
                text.id === editingTextIndex ? { ...text, text: tempTextValue } : text
            )
        );


        setCopies((prevCopies) => prevCopies.map((copie) => copie.id === editingTextIndex ? { ...copies, text: tempTextValue } : copie))
        setEditingTextIndex(null); // Sai do modo de edição
    };

    const modalColor = () => {
        setOnModalColor((prev) => !prev)
        const editTools = document.getElementsByClassName("editTools")
        const colorBar = document.getElementsByClassName("colorBar")
        colorBar[0].style.display = 'none'
        setTimeout(() => {
            colorBar[0].style.display = 'flex'
        }, 100)
        editTools[0].style.display = onModalColor ? "flex" : "none"
    }

    const enableColorPickerSolid = () => {
        const inputColorSolid = document.getElementsByClassName("inputColorSolid")

        inputColorSolid[0].click()
    }

    const enablePickerStartColor = () => {
        const inputStartColor = document.getElementsByClassName("inputStartColor")
        inputStartColor[0].click()
    }
    const enablePickerEndColor = () => {
        const inputEndColor = document.getElementsByClassName("inputEndColor")
        inputEndColor[0].click()
    }





    //Fim funções editTools

    //Funções de deletar algo no Stage

    const handleDeleteSelectedItem = () => {
        if (selectedShape) {
            const idToRemove = selectedShape.id();

            const newProducts = products.filter((product) => product.id !== idToRemove)
            setProducts(newProducts)


            const newCopies = copies.filter((copie) => copie.id !== idToRemove)
            setCopies(newCopies)



            const newShapes = shapes.filter((shape) => shape.id !== idToRemove)
            setShapes(newShapes)


            const newTexts = texts.filter((texts) => texts.id !== idToRemove)
            setTexts(newTexts)

            const newStamps = stampsKonva.filter((stamps) => stamps.id !== idToRemove)
            setStampsKonva(newStamps)

            const nodeType = selectedShape?.attrs?.type;

            if (!idToRemove) return;

            // ---------- APENAS BOX ----------

            const newBox = boxData.filter((b) => b.id !== idToRemove);
            setBoxData(newBox);

            selectedShape.attrs.type === 'validate' && setIsValidate(false)
            selectedShape.attrs.type === 'adress' && setAdress(false)




            setSelectedShape(null);
            setSelectedText(null); // Desselecionar após deletar
            saveToHistory(newShapes, newProducts, newCopies, newTexts, newBox)


        }


    };
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "Delete") {
                handleDeleteSelectedItem();
            }

            if (e.ctrlKey && e.key === "z") {
                e.preventDefault();
                handlePrev();
            }

            if (e.ctrlKey && e.key === "y") {
                e.preventDefault();
                handleNext();
            }

            if (e.ctrlKey && e.key === "v") {
                e.preventDefault();
                duplicateShape();
            }
        };



        window.addEventListener("keydown", handleKeyDown);

        // Cleanup ao desmontar o componente
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [selectedShape, products, shapes, copies, texts]);

    // useEffect(() => {
    //     const handleKeyDown = (e) => {

    //         if (e.ctrlKey && e.key === "z") {
    //             handlePrev();
    //         }
    //     };

    //     window.addEventListener("keydown", handleKeyDown);
    //     return () => {
    //         window.removeEventListener("keydown", handleKeyDown);
    //     };
    // }, []);


    //funções de Shapes

    const addShape = (shapeType) => {
        let newShape;
        if (shapeType === "rectangle") {
            newShape = {
                type: shapeType,
                id: `${Date.now()}`,
                x: Math.random() * 200, // Posição aleatória para exemplo
                y: Math.random() * 200,
                width: 100,
                height: 100,
                fill: 'red', // Cor do shape
                isGradient: false,
                fillLinearGradientColorStops: [0, startColor, 1, endColor],
                fillLinearGradientStartPoint: { x: 0, y: 0 },
                fillLinearGradientEndPoint: { x: 100, y: 0 },
            };
        } else if (shapeType == 'circle') {
            newShape = {
                type: shapeType,
                id: `${Date.now()}`,
                x: Math.random() * 200, // Posição aleatória para exemplo
                y: Math.random() * 200,
                width: 100,
                height: 100,
                radius: 50, // Para círculo
                fill: 'red', // Cor do shape
                isGradient: false,
                fillLinearGradientColorStops: [0, startColor, 1, endColor],
                fillLinearGradientStartPoint: { x: 0, y: 0 },
                fillLinearGradientEndPoint: { x: 100, y: 0 },
            };
        } else if (shapeType === 'star') {
            newShape = {
                type: shapeType,
                id: `${Date.now()}`,
                x: Math.random() * 200, // Posição aleatória para exemplo
                y: Math.random() * 200,
                numPoints: 15,  // Número de pontas da estrela
                innerRadius: 45,  // Raio interno
                outerRadius: 50,  // Raio externo
                fill: "red",  // Cor de preenchimento
                stroke: "black",  // Cor da borda
                strokeWidth: 0,  // Largura da borda
                isGradient: false,
                fillLinearGradientColorStops: [0, startColor, 1, endColor],
                fillLinearGradientStartPoint: { x: 0, y: 0 },
                fillLinearGradientEndPoint: { x: 100, y: 0 },
                strokeTam: 0
            };
        } else if (shapeType === 'path') {

            newShape = {
                type: shapeType,
                id: `${Date.now()}`,
                x: Math.random() * 200, // Posição aleatória para exemplo
                y: Math.random() * 200,
                width: 100,
                height: 100,
                data: svgPathData,
                fill: 'red', // Cor do interior do caminho
                isGradient: false,
                fillLinearGradientColorStops: [0, startColor, 1, endColor],
                fillLinearGradientStartPoint: { x: 0, y: 0 },
                fillLinearGradientEndPoint: { x: 100, y: 0 },
            }
        }
        const updatedShapes = [...shapes, newShape];
        setShapes(updatedShapes);
        saveToHistory(updatedShapes, products, copies, texts);
        autoClick(newShape.id);
    };


    const saveToHistory = (newShapes, newProducts, newCopies, newTexts) => {
        try {
            const newHistoryEntry = {
                shapes: JSON.parse(JSON.stringify(newShapes)),
                // products: JSON.parse(JSON.stringify(newProducts)),
                copies: JSON.parse(JSON.stringify(newCopies)),
                texts: JSON.parse(JSON.stringify(newTexts)),
            };

            const updatedHistory = [
                ...history.slice(0, currentHistoryIndex + 1),
                newHistoryEntry,
            ];

            setHistory(updatedHistory);
            setCurrentHistoryIndex(updatedHistory.length - 1);

            localStorage.setItem("history", JSON.stringify(updatedHistory));
        } catch (e) {
            console.error("saveToHistory failed:", e);
        }
    };


    const desabilitarBackground = () => {
        setSelectedShape(null)
        setSelectedText(null)
    }



    const handleMouseEnter = (e) => {
        const container = e.target.getStage().container();
        container.style.cursor = "grab"
    };

    const handleMouseLeave = (e) => {
        const container = e.target.getStage().container();
        container.style.cursor = "default";
    }


    // const handleSelect = (e) => {
    //     setSelectedShape(e.target);
    //     setSolidColor(e.target.attrs.fill)
    //     setStartColor(e.target.attrs.fillLinearGradientColorStops? e.target.attrs.fillLinearGradientColorStops[1] : "red")
    //     setIsGradient(e.target.isGradient)
    //     setBorderRadius(e.target.attrs.cornerRadius)

    //     if(selectedText !== null){
    //         setSelectedText(null)
    //     }
    // };
    // useEffect(() => {
    //     if (selectedShape && transformerRef.current) {
    //       transformerRef.current.nodes([selectedShape]);
    //       transformerRef.current.getLayer().batchDraw();
    //     }
    // }, [selectedShape]);


    useEffect(() => {
        if (transformerRef.current && selectedElements.length > 0) {
            transformerRef.current.nodes(
                selectedElements.map((el) => shapesRefs.current[el.id])
            );
            transformerRef.current.getLayer().batchDraw();
        } else if (selectedShape && transformerRef.current) {
            transformerRef.current.nodes([selectedShape]);
            transformerRef.current.getLayer().batchDraw();
        }
    }, [selectedElements, selectedShape]);

    const groupRefs = useRef([]);
    const [groupActive, setGroupActive] = useState(false)

    const groupRef = useRef(null);

    const handleTransform = () => {
        const group = groupRef.current;
        const transformer = transformerRef.current;

        if (group && transformer) {
            transformer.nodes([group]);
            transformer.getLayer().batchDraw();
        }
    };



    const handleTransformGroup = (selectedIndex) => {
        const group = groupRefs.current[selectedIndex];
        const transformer = transformerRef.current;
        setGroupActive(true);
        setSelectedShape(null)
        setSelectedElements([])


        if (group && transformer) {
            transformer.nodes([group]);
            transformer.getLayer().batchDraw();
        }

    };





    const handleSelect = (e, element) => {
        setGroupActive(false)
        if (e.evt?.shiftKey || e.evt?.ctrlKey) {
            setSelectedElements((prev) =>
                prev.find((el) => el.id === element.id)
                    ? prev.filter((el) => el.id !== element.id)
                    : [...prev, element]
            );

            setSelectedShape(null)


        } else {
            setSelectedElements([])
            setGroupActive(false)
            setSelectedShape(e.target)
            setSolidColor(e.target.attrs.fill)
            setStartColor(e.target.attrs.fillLinearGradientColorStops ? e.target.attrs.fillLinearGradientColorStops[1] : "red")
            setIsGradient(e.target.isGradient)
            setBorderRadius(e.target.attrs.cornerRadius)
            setSelectedOptionFont(e.target.attrs.font)



            if (selectedText !== null) {
                setSelectedText(null)
            }
        }
    };

    const handleDeselect = () => {
        setSelectedElements([]);
        setGroupActive(false);
        const transformer = transformerRef.current;
        if (transformer) {
            transformer.nodes([]); // Remove a seleção
            transformer.getLayer().batchDraw();
        }
    };



    const handleSelectText = (e) => {
        if (selectedShape !== null) {
            setSelectedShape(null)
        }
        setSelectedText(e.target);
    };

    const handleDragMove = (e, type) => {
        const rect = e.target;
        const stageWidth = 800;
        const stageHeight = 800;

        const rectX = rect.x();
        const rectY = rect.y();
        const rectWidth = rect.width();
        const rectHeight = rect.height();

        const centerX = rectX + rectWidth / 2;
        const centerY = rectY + rectHeight / 2;

        // Posição de centro do stage
        const stageCenterX = stageWidth / 2;
        const stageCenterY = stageHeight / 2;

        // Detecta se o centro do retângulo está perto do centro do Stage
        const snapTolerance = 10;
        const verticalGuide = Math.abs(centerX - stageCenterX) < snapTolerance ? stageCenterX : null;
        const horizontalGuide = Math.abs(centerY - stageCenterY) < snapTolerance ? stageCenterY : null;

        // Alinhamento entre retângulos
        const nearbyShapes = shapes.filter(shape => shape.id !== rect.id());
        const alignmentTolerance = 20; // Tolerância para alinhamento


        // Inicializa novas posições como as atuais
        let newX = rectX;
        let newY = rectY;

        // Verifica alinhamento vertical e horizontal com outros retângulos
        nearbyShapes.forEach(shape => {
            const distanceX = Math.abs(rectX - shape.x);
            const distanceY = Math.abs(rectY - shape.y);

            if (distanceX < alignmentTolerance) {
                newX = shape.x; // Alinha na mesma posição X
            }

            if (distanceY < alignmentTolerance) {
                newY = shape.y; // Alinha na mesma posição Y
            }
        });

        // Aplica alinhamento ao centro
        if (verticalGuide) {
            newX = verticalGuide - rectWidth / 2; // Alinha ao centro vertical
        }
        if (horizontalGuide) {
            newY = horizontalGuide - rectHeight / 2; // Alinha ao centro horizontal
        }

        rect.x(newX);
        rect.y(newY);

        // Mostra as guias de alinhamento
        setGuides({
            vertical: verticalGuide,
            horizontal: horizontalGuide,
        });

        // Atualiza a posição do retângulo
        if (type === "shape") {
            const updatedShapes = shapes.map((shape) =>
                shape.id === rect.id() ? { ...shape, x: newX, y: newY } : shape
            );

            setShapes(updatedShapes);
        } else if (type === "product") {
            const updatedProducts = products.map((product) =>
                product.id === rect.id() ? { ...product, x: newX, y: newY } : product
            );

            setProducts(updatedProducts);
        }
    };

    const handleDragEnd = (id, e, type) => {
        // Remove as guias quando o arrasto termina
        setGuides({ vertical: null, horizontal: null });
        const updatePosition = (items) =>
            items.map((item) => (item.id === id ? { ...item, x: e.target.x(), y: e.target.y() } : item));

        let updatedShapes = shapes;
        let updatedProducts = products;
        let updatedCopies = copies;
        let updatedTexts = texts;
        if (type === 'shape') {
            updatedShapes = updatePosition(shapes);
            setShapes(updatedShapes);
        } else if (type === 'product') {
            updatedProducts = updatePosition(products);
            setProducts(updatedProducts);
        } else if (type === 'copy') {
            updatedCopies = updatePosition(copies);
            setCopies(updatedCopies);
        } else if (type === 'texts') {
            updatedTexts = updatePosition(texts)
            setTexts(updatedTexts);
        }

        saveToHistory(updatedShapes, updatedProducts, updatedCopies, updatedTexts);

    };

    const handleTransformEndAndSaveToHistory = (type) => {

        const transformHandlers = {
            shape: () => {
                const newShapes = shapes.map((shape) => {
                    if (shape.id === selectedShape.attrs.id) {

                        return {
                            ...shape,
                            scaleX: selectedShape.attrs.scaleX,
                            scaleY: selectedShape.attrs.scaleY,
                        }
                    }

                    return shape;
                })


                setShapes(newShapes)
                saveToHistory(newShapes, products, copies, texts)
            },

            product: () => {
                const newProducts = products.map((product) => {
                    if (product.id === selectedShape.attrs.id) {
                        return {
                            ...product,
                            scaleX: selectedShape.attrs.scaleX,
                            scaleY: selectedShape.attrs.scaleY,
                        }
                    }

                    return product;
                })


                setProducts(newProducts)
                saveToHistory(shapes, newProducts, copies, texts)
            },

            copy: () => {
                const newCopies = copies.map((copy) => {
                    if (copy.id === selectedShape.attrs.id) {
                        return {
                            ...copy,
                            scaleX: selectedShape.attrs.scaleX,
                            scaleY: selectedShape.attrs.scaleY,
                        }
                    }

                    return copy;
                })



                setCopies(newCopies)
                saveToHistory(shapes, products, newCopies, texts)
            }

        }

        const handler = transformHandlers[type];
        if (handler) {
            handler()
        }
    }






    //Função para baixar 
    //  helpers locais 
    async function saveBlobToDisk(blob, filename = 'Tabloide.png') {
        try {
            if (window.showSaveFilePicker) {
                const handle = await window.showSaveFilePicker({
                    suggestedName: filename,
                    types: [{ description: 'PNG Image', accept: { 'image/png': ['.png'] } }],
                });
                const writable = await handle.createWritable();
                await writable.write(blob);
                await writable.close();
                return;
            }
        } catch (e) {
            if (e && e.name === 'AbortError') return; // usuário cancelou
            console.warn('showSaveFilePicker falhou, usando fallback:', e);
        }

        // Fallback: download
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
    }

    //Função para baixar (MANTEVE O MESMO NOME)
    const exportImage = () => {
        window.dispatchEvent(new CustomEvent('SG_EXPORT', {
            detail: { filename: 'Tabloide.png', pixelRatio: 3 }
        }));
    };

    // BOTAO DE LIMPAR TODA AGINA 
    const handleClearCurrentPage = () => {
        const currentId = stageId;

        if (!window.confirm('Apagar todos os elementos desta página?')) return;

        setProducts([]);
        setCopies([]);
        setShapes([]);
        setTexts([]);
        setBoxData([]);
        setStampsKonva([]);

        setSelectedShape(null);
        setSelectedText(null);
        setIsValidate(false);
        setAdress(false);
        setFormatedDateInitial('');
        setFormatedDateFinal('');

        try {
            transformerRef?.current?.nodes?.([]);
            transformerRef?.current?.getLayer?.()?.batchDraw?.();
        } catch { }
        if (shapesRefs?.current) shapesRefs.current = {};

        setStageQuantity(prev =>
            prev.map(s =>
                s.id === currentId
                    ? {
                        ...s,
                        products: [],
                        copies: [],
                        shapes: [],
                        texts: [],
                        boxData: [],
                        stampsKonva: [],
                        hasValidateDate: false,
                        formatedDateInitial: '',
                        formatedDateFinal: '',
                        history: [],
                    }
                    : s
            )
        );

        // se quiser permitir "Desfazer" logo após limpar, mantenha:
        saveToHistory([], [], [], [], []);

        stageRef?.current?.batchDraw?.();
    };

    // // TABLOID SECTION UTILIZANDO SOMENTE BOTAO ESCOLHER LAYOUT 

    // const [stageSize, setStageSize] = React.useState({ width: 1080, height: 1440 });
    // const [backgroundUrl, setBackgroundUrl] = React.useState(null);

    // // quando o usuário escolhe um "variant" no modal
    // // NÃO ESTÁ FUNCIONANDO, MEXER MAIS TARDE NISSO

    // // const onApplyLayoutVariant = (variant) => {
    // //     // se você servir via backend/CDN, ajuste essa URL
    // //     const url = `/${variant.imageKey}`;
    // //     setBackgroundUrl(url);
    // //     setStageSize({ width: variant.widthPx, height: variant.heightPx });
    // // };

    // // quando escolher formato manual (ex.: via <select>)
    // const onApplyManualFormat = ({ width, height }) => {
    //     setStageSize({ width, height });
    // };

    // const [pickedLayout, setPickedLayout] = useState({
    //     bgUrl: null,
    //     width: 600,
    //     height: 800,
    // });

    // function handleLayoutPicked({ url, widthPx, heightPx }) {
    //     setPickedLayout({
    //         bgUrl: url,
    //         width: Number(widthPx) || 600,
    //         height: Number(heightPx) || 800,
    //     });
    // }


    return (
        <div>
            <NavBar />
            <main className="application">
                <FirstColumn
                    onClearCurrentPage={handleClearCurrentPage}
                    setStageQuantity={setStageQuantity}
                    stageQuantity={stageQuantity}
                    addContentProduct={addContentProduct}
                    addContentProductWithButton={addContentProductWithButton}
                    quantityProduct={quantityProduct}
                    handleNameProduct={handleNameProduct}
                    handleSelectProduct={handleSelectProduct}
                    handleProductChange={handleProductChange}
                    handleBackgroundChange={handleBackgroundChange}
                    setVisibleModalIndex={setVisibleModalIndex}
                    visibleModalIndex={visibleModalIndex}
                    matchingProducts={matchingProducts}
                    nameProduct={nameProduct}
                    imageProduct={imageProduct}
                    selectedOption={selectedOption}
                    setSelectedOption={setSelectedOption}
                    selectedTabloid={selectedTabloid}
                    setSelectedTabloid={setSelectedTabloid}
                    handleRemoveProduct={handleRemoveProduct}
                    products={products}
                    handleChangeRadio={handleChangeRadio}
                    handleInformationsModal={handleInformationsModal}
                    addContentAdress={addContentAdress}
                    contentAdress={contentAdress}
                    informationsModal={informationsModal}
                    handleSaveInformations={handleSaveInformations}
                    setLogo={setLogo}
                    Logo={Logo}
                    user={user}
                    setModalRegisterProduct={setModalRegisterProduct}
                    modalRegisterProduct={modalRegisterProduct}
                />

                <SecondColumn
                    onClearCurrentPage={handleClearCurrentPage}
                    setStageQuantity={setStageQuantity}
                    stageQuantity={stageQuantity}
                    handleTransformEndAndSaveToHistory={handleTransformEndAndSaveToHistory}
                    saveToHistory={saveToHistory}
                    groupRefs={groupRefs}
                    handleTransformGroup={handleTransformGroup}
                    groupActive={groupActive}
                    groupRef={groupRef}
                    handleTransform={handleTransform}
                    optionsFont={optionsFont}
                    handleSelectFont={handleSelectFont}
                    handleColorChange={handleColorChange}
                    duplicateShape={duplicateShape}
                    selectedShape={selectedShape}
                    addShape={addShape}
                    isBold={isBold}
                    toggleBold={toggleBold}
                    history={history}
                    currentHistoryIndex={currentHistoryIndex}
                    handlePrev={handlePrev}
                    handleNext={handleNext}
                    addTextBox={addTextBox}
                    optionsFontSize={optionsFontSize}
                    optionsOutlineSize={optionsOutlineSize}
                    handleSelectFontSize={handleSelectFontSize}
                    handleOutlineColorChange={handleOutlineColorChange}
                    handleOutlineSize={handleOutlineSize}
                    handleShadowShape={handleShadowShape}
                    modalColor={modalColor}
                    onModalColor={onModalColor}
                    setIsGradient={setIsGradient}
                    isGradient={isGradient}
                    setSolidColor={setSolidColor}
                    solidColor={solidColor}
                    handleGradientColorChange={handleGradientColorChange}
                    startColor={startColor}
                    setStartColor={setStartColor}
                    setEndColor={setEndColor}
                    endColor={endColor}
                    enableColorPickerSolid={enableColorPickerSolid}
                    enablePickerStartColor={enablePickerStartColor}
                    enablePickerEndColor={enablePickerEndColor}
                    circleGradientType={circleGradientType}
                    setDateInitial={setDateInitial}
                    selectedDateInitial={selectedDateInitial}
                    dateInitial={dateInitial}
                    formatedDateInitial={formatedDateInitial}
                    setDateFinal={setDateFinal}
                    dateFinal={dateFinal}
                    selectedDateFinal={selectedDateFinal}
                    formatedDateFinal={formatedDateFinal}
                    openModalDates={openModalDates}
                    modalOfDates={modalOfDates}
                    modalBorderRadius={modalBorderRadius}
                    optionsBorderRadius={optionsBorderRadius}
                    handleBorderRadius={handleBorderRadius}
                    setBorderRadius={setBorderRadius}
                    borderRadius={borderRadius}
                    user={user}
                    handleAdressButton={handleAdressButton}
                    alterShapeForGradientType={alterShapeForGradientType}
                    alterDirectionGradienta={alterDirectionGradienta}


                    selectedTabloid={selectedTabloid}
                    setSelectedShape={setSelectedShape}
                    setSelectedText={setSelectedText}
                    selectedText={selectedText}
                    backgroundImage={backgroundImage}
                    desabilitarBackground={desabilitarBackground}
                    handleMouseEnter={handleMouseEnter}
                    handleMouseLeave={handleMouseLeave}
                    setShapes={setShapes}
                    shapes={shapes}
                    handleSelect={handleSelect}
                    handleDragMove={handleDragMove}
                    handleDragEnd={handleDragEnd}
                    transformerRef={transformerRef}
                    guides={guides}
                    copies={copies}
                    products={products}
                    imageRef={imageRef}
                    textRef={textRef}
                    handleSelectText={handleSelectText}
                    texts={texts}
                    enableTextEditing={enableTextEditing}
                    tempTextValue={tempTextValue}
                    editingTextIndex={editingTextIndex}
                    handleTextChange={handleTextChange}
                    saveTextChange={saveTextChange}
                    inputPosition={inputPosition}
                    isValidate={isValidate}
                    handleValidate={handleValidate}
                    setTexts={setTexts}
                    adress={adress}
                    shapesRefs={shapesRefs}
                    handleDeselect={handleDeselect}
                    selectedElements={selectedElements}
                    blobImg={blobImg}
                    addNewStage={addNewStage}
                    stageId={stageId}
                    prevStage={prevStage}
                    nextStage={nextStage}
                    registerExporter={setExporter}                 // ✅ registra o exporter do Stage
                    exportImage={exportImage}   // ✅ nova prop
                    pendingClickProductId={pendingClickProductId}
                    onClickHandled={() => setPendingClickProductId(null)}
                />
            </main>
        </div>

    );

}

export default Aplication;