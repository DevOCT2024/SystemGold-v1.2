import { Button } from "../../../../components/button/button";
import Input from "../../../../components/inputs/Input";
import { Select } from "../../../../components/select/Select";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-regular-svg-icons";

import axios from 'axios';

import "./index.css"
import Modal from "../../../../components/modal/modal";
import { Form, Formik } from "formik";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import { registerNewProduct } from "../../../../services/Products/Products";
import { useState, useCallback, useRef, useEffect } from "react";

import { selectedOption } from "./components/SelectOptions";
import { SelectTabloid } from "./components/SelectTabloid";
import { useParams } from "react-router-dom";

const FirstColumn = ({
    setModalRegisterProduct,
    modalRegisterProduct,

    handleChangeRadio,

    handleInformationsModal,
    addContentAdress,
    contentAdress,
    informationsModal,
    handleSaveInformations,
    setLogo,
    Logo,
    user,


    setSelectedTabloid,
    selectedTabloid,
    addContentProduct,
    addContentProductWithButton,
    quantityProduct,
    handleNameProduct,
    visibleModalIndex,
    setVisibleModalIndex,
    matchingProducts = [],
    handleBackgroundChange,
    handleProductChange,
    handleSelectProduct,
    handleRemoveProduct,
    products = [],
}) => {


    const { id } = useParams();
    const [newProductImage, setNewProductImage] = useState(null)
    const [loadingProductImg, setLoadingProductImg] = useState(true);

    const informations = (() => {
        const addr = user?.Adress;
        if (addr == null) return [];
        if (typeof addr === 'string') {
            try { return JSON.parse(addr); } catch { return []; }
        }
        return addr; // já é objeto/array
    })();

    const [cropperProductImage, setCropperProductImage] = useState(null)
    const [productImage, setProductImage] = useState(null)

    const cropperRef = useRef(null);
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);



    useEffect(() => {
        const fetchLogo = async () => {
            const response = await axios.get(`http://localhost:5532/api/ClubImage/${id}`);
            setLogo(response.data)
        }
        fetchLogo()

    }, [id])

    const loadKonvaImage = (src) =>
        new Promise((resolve, reject) => {
            const img = new window.Image();
            img.crossOrigin = 'anonymous'; // ajuda quando a origem é externa
            img.onload = () => resolve(img);
            img.onerror = (e) => reject(e);
            img.src = src;
        });

    // helpers
    const removeBgFromFile = async (file) => {
        const form = new FormData();
        form.append("file", file, file.name || "image.png");
        const res = await fetch("http://localhost:5532/bg/remove", { method: "POST", body: form });
        if (!res.ok) throw new Error("bg/remove (file) " + res.status);
        const blob = await res.blob();
        return URL.createObjectURL(blob);
    };

    const removeBgFromUrl = async (src) => {
        const res = await fetch("http://localhost:5532/bg/remove", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ url: src }),
        });
        if (!res.ok) throw new Error("bg/remove (url) " + res.status);
        const blob = await res.blob();
        return URL.createObjectURL(blob);
    };

    // seleção do produto sugerido (versão simples, sem remover fundo)
    const handleSelectProductWithBg = async (product, index) => {
        try {
            setLoadingProductImg(true);
            const src = product?.img || product?.image?.src || product?.originalUrl;
            if (!src) { handleSelectProduct(product, index); return; }

            let cutoutUrl;
            if (/^data:|^blob:/i.test(src)) {
                const b = await (await fetch(src)).blob();
                const f = new File([b], 'img.png', { type: b.type || 'image/png' });
                cutoutUrl = await removeBgFromFile(f);       // <-- envia como ARQUIVO
            } else {
                cutoutUrl = await removeBgFromUrl(src);      // <-- URL pública normal
            }
            const konvaImg = await loadKonvaImage(cutoutUrl);

            const baseW = 120;
            const ratio = konvaImg.width / Math.max(1, konvaImg.height);
            const normW = baseW, normH = Math.round(baseW / ratio);

            handleSelectProduct({
                ...product,
                img: cutoutUrl,
                image: { src: cutoutUrl },
                originalUrl: src,
                cutoutSrc: cutoutUrl,
                __konvaImage: konvaImg,
                width: normW, height: normH, scaleX: 1, scaleY: 1,
            }, index);
        } catch (err) {
            console.error("Falha ao recortar; usando original:", err);
            handleSelectProduct(product, index);
        } finally {
            setLoadingProductImg(false);
            setVisibleModalIndex(null);
        }
    };


    const handleImageUpload = async (e, type) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setLoading(true);
        try {
            const cutoutUrl = await removeBgFromFile(file);
            if (type === "logoImage" || type === "logoClubeImage") setImage(cutoutUrl);
            else { setProductImage(null); setCropperProductImage(cutoutUrl); }
        } catch (err) {
            console.error("remove-bg (upload) falhou, usando original:", err);
            const fallback = URL.createObjectURL(file);
            if (type === "logoImage" || type === "logoClubeImage") setImage(fallback);
            else { setProductImage(null); setCropperProductImage(fallback); }
        } finally { setLoading(false); }
    };


    // --- Crop (restaurado) ---
    const handleCrop = (value) => {
        if (!cropperRef?.current) return;

        const cropper = cropperRef.current.cropper;

        if (value === "logoImage" || value === "logoClubeImage") {
            const out = cropper.getCroppedCanvas().toDataURL("image/png");
            setLogo(out);
            setImage(null);
            return;
        }

        if (value === "productImage") {
            const srcCanvas = cropper.getCroppedCanvas();

            // normalização de tamanho inicial no canvas
            const baseW = 120;
            const ratio = srcCanvas.width / Math.max(1, srcCanvas.height);
            const w = baseW;
            const h = Math.round(baseW / ratio);

            const out = document.createElement("canvas");
            out.width = w; out.height = h;
            out.getContext("2d").drawImage(srcCanvas, 0, 0, w, h);

            const outUrl = out.toDataURL("image/png");
            setProductImage(outUrl);
            setCropperProductImage(null);
        }
    };

    const options = [
        { value: '1', label: '1' },
        { value: "2", label: '2' }
    ];

    const handleSubmit = ({ productName }) => {
        try {
            const formData = new FormData();
            formData.append("name", productName || "");
            if (productImage) formData.append("file", productImage);
            registerNewProduct(formData);
        } catch (error) {
            console.error(error);
        }
    };


    return (
        <main className="firstColumnApp">

            <h1 style={{ margin: 0, color: "rgba(124, 17, 20, 0.404)" }}>É muito fácil, vamos lá!</h1>

            <p className="steps" style={{ marginBottom: 0 }}>1ºpasso</p>

            <section className="uploadYourData">

                <Button onClick={handleInformationsModal}>Carregue aqui os dados principais da sua loja</Button>
                <p style={{ margin: 0, fontFamily: 'arial', fontSize: '14.2px' }}>Endereços, telefones e logomarca</p>

            </section>

            {informationsModal && (
                <Modal styleModalContent={{ width: '65%', height: '60%' }} onClose={handleInformationsModal} content={
                    <Formik
                        initialValues={{
                            Logo: null,
                            ...Array.from({ length: contentAdress }).reduce((acc, _, index) => ({
                                ...acc,
                                [`Adress-${index}`]: informations && informations[index] ? informations[index].Adress : "",
                                [`Telefone-${index}`]: informations && informations[index] ? informations[index].Telefone : "",
                                [`Whatsapp-${index}`]: informations && informations[index] ? informations[index].Whatsapp : "",
                                [`horaFuncionamento-${index}`]: informations && informations[index] ? informations[index].horaFuncionamento : ""
                            }), {})
                        }}
                        onSubmit={handleSaveInformations}
                    >
                        <Form style={{ display: 'flex', flexDirection: 'column', alignItems: 'start', width: '85%', gap: '10px', height: '100%', width: '100%', overflow: 'auto' }}>
                            <h1 style={{ color: '#D3D3D3', marginBottom: 0 }}>Campos não obrigatórios</h1>
                            <div className="logos">

                                <div className="inputInformationsGroup" >
                                    <p>Logo</p>
                                    <input id="logoInput" name={"Logo"} onChange={(e) => handleImageUpload(e, "logoImage")} type={"file"} placeholder={"Logo de seu mercado"} hidden />
                                    <label htmlFor="logoInput" className="upload-button" style={{ fontFamily: 'Segoe UI', fontSize: '13px' }}>
                                        Carregar a Logo
                                    </label>
                                </div>



                                <div className="inputInformationsGroup">
                                    <p>Logo do seu clube</p>
                                    <input id="logoClubInput" name={"Logo"} onChange={(e) => { handleImageUpload(e, "logoClubeImage"); }} type={"file"} placeholder={"Logo de seu mercado"} hidden />
                                    <label htmlFor="logoClubInput" className="upload-button" style={{ fontFamily: 'Segoe UI', fontSize: '13px' }}>
                                        Carregar a Logo
                                    </label>
                                </div>


                                {image && (
                                    <Modal styleModalContent={{ width: "50%", height: "50%", }} content={
                                        <div style={{ marginTop: "20px", width: "100%", display: "flex", alignItems: 'center', justifyContent: 'center', flexDirection: "column" }}>
                                            <Cropper
                                                src={image}
                                                ref={cropperRef}
                                                style={{ height: 400, width: "50%" }}
                                                aspectRatio={50 / 40}
                                                guides={false}
                                                cropBoxResizable={true}
                                                zoomable={true}
                                                dragMode="move"
                                            />
                                            <button type="button" onClick={() => handleCrop("logoClubeImage")} style={{ marginTop: "10px" }}>
                                                Cortar Imagem
                                            </button>
                                        </div>
                                    } />
                                )}

                                {loading && <p>Removendo fundo da imagem...</p>}

                                {Logo && !loading && (
                                    <img src={Logo} alt="" style={{ width: 150, height: 120 }} />
                                )}

                            </div>

                            {Array.from({ length: contentAdress }, (_, index) => (
                                <div key={index} id={`adress-${index}`} className="adressTelAndDates">

                                    <div className="inputInformationsGroup" style={{ width: '34%' }}>

                                        <p>Endereço:</p>
                                        <Input style={{ border: '1px solid gray', width: '100%' }} name={`Adress-${index}`} type={"text"} placeholder={"Endereço de seu mercado"} />

                                    </div>


                                    <div className="inputInformationsGroup" style={{ width: '10%' }}>

                                        <p>Telefone:</p>
                                        <Input style={{ border: '1px solid gray', width: '100%' }} name={`Telefone-${index}`} type={"text"} placeholder={"Telefone de seu mercado"} />

                                    </div>

                                    <div className="inputInformationsGroup" style={{ width: '10%' }}>

                                        <p>Whatsapp:</p>
                                        <Input style={{ border: '1px solid gray', width: '100%' }} name={`Whatsapp-${index}`} type={"text"} placeholder={"Whatsapp de seu mercado"} />

                                    </div>


                                    <div className="inputInformationsGroup" style={{ width: '34%' }}>

                                        <p>Horário de funcionamento:</p>
                                        <Input style={{ border: '1px solid gray', width: '100%' }} name={`horaFuncionamento-${index}`} type={"text"} placeholder={"Horário de funcionamento de seu mercado"} />

                                    </div>
                                </div>
                            ))}


                            <div style={{ width: '20%' }}>
                                <Button type={"button"} onClick={(e) => addContentAdress()}>+ Endereços</Button>
                            </div>


                            <div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Button type={"onSubmit"} style={{ width: '20%' }}>Salvar</Button>
                            </div>

                        </Form>
                    </Formik>
                }></Modal>
            )}

            <p className="steps" >2ºpasso</p>

            <section className="layoutOptions">

                <div className="selectandChoyceLayout">


                    <h3 style={{ margin: 0 }}>Qual formato de seu tablóide/Post?</h3>

                    <div className="selectAndButton">

                        <div className="selectFormatTabloid">
                            <Select
                                FirstOption={"Escolha seu Formato"}
                                options={SelectTabloid}
                                onChange={(e) => { setSelectedTabloid(JSON.parse(e.target.value)); }}

                                name="selectTabloid"
                            />
                        </div>

                        <Button>Escolher Layout</Button>

                    </div>

                </div>

                <div className="division">
                    <hr />
                    <p>OU</p>
                    <hr />
                </div>


                <article className="buttonsLayout">


                    <div className="loadLayoutSaved">

                        <Button>Carregar Layouts Salvos</Button>
                        <p style={{ fontFamily: 'arial' }}>Escolha aqui um layout</p>
                        <p style={{ fontFamily: 'arial' }}>Que foi salvo anteirormente!</p>

                    </div>

                    <div className="uploadYourLayout">

                        <input type="file" id="file-upload" onChange={handleBackgroundChange} name="" hidden />
                        <label htmlFor="file-upload" className="upload-button" style={{ fontFamily: 'Segoe UI', fontSize: '13px' }}>
                            Carregar Layout
                        </label>
                        <p style={{ fontFamily: 'arial' }}>Carregue aqui seu</p>
                        <p style={{ fontFamily: 'arial' }} >Layout personalizado!</p>

                    </div>


                </article>




            </section>

            <p className="steps" >3ºpasso</p>

            <section className="addProductContent">




                <div className="addContent">
                    <Select
                        FirstOption={"Escolha a quantidade de produtos"}
                        options={selectedOption}
                        onChange={(e) => addContentProduct(e.target.value)}
                        value={quantityProduct}
                        name="qtdDeProdutos"
                    />
                    <div className="textAreaFromAddProductContent">
                        <p style={{ fontFamily: 'arial', fontSize: '11.2px' }}>Adicione seus produtos manualmente.</p>

                    </div>
                </div>

                {/* <div className="uploadExcel">
                <Button>Subir Planilha</Button>
                <div className="textAreaFromAddProductContent">
                    <p style={{ fontFamily:'arial', fontSize: '11.2px'}}>Ou carregue uma planilha com descrições e preços. <a href=""> BAIXAR PLANILHA DE EXEMPLO.</a></p> 
                </div>
            </div> */}


            </section>
            <section className="productArea">
                {Array.from({ length: quantityProduct }, (_, index) => (


                    <div key={index} id={`product-${index}`} className="productItem">


                        <div className="productButton">

                            <input type="text" onChange={(e) => handleNameProduct(e, index)} style={{ width: '70%' }} placeholder="Digite o nome/ean do produto" />
                            <Button onClick={() => handleRemoveProduct(index)} style={{ width: '30px', height: '30px', borderRadius: '50%', backgroundColor: 'transparent' }}><FontAwesomeIcon style={{ color: 'black' }} icon={faTrashCan} /></Button>


                            {visibleModalIndex === index && (
                                <div className="modal">
                                    <div className="modal-content" style={{ width: '50%', height: "55%" }}>
                                        <Button style={{ position: "absolute", top: '5px', width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', left: '5px', borderRadius: '50%', padding: '0' }} onClick={() => setVisibleModalIndex(null)}><p>x</p></Button>
                                        <div className="productSuggestions">

                                            {matchingProducts[0]?.message === "Nenhum produto encontrado" ? (
                                                <>
                                                    <div>
                                                        Produto não encontrado em nosso banco de imagens
                                                        <Button onClick={() => setModalRegisterProduct(true)}>Carregue a imagem aqui</Button>
                                                    </div>

                                                    {modalRegisterProduct && (
                                                        <Modal styleModalContent={{ width: '50%', height: "55%" }} content={
                                                            <div style={{ width: "100%", height: "100%" }}>

                                                                <h1 style={{ textAlign: "start", marginLeft: "10px" }}>Cadastro de Produtos</h1>


                                                                <Formik
                                                                    initialValues={{
                                                                        productName: '',
                                                                        ean: '',
                                                                        img: '',
                                                                        url: '',
                                                                    }}
                                                                    onSubmit={handleSubmit}
                                                                >

                                                                    <Form style={{ color: 'black', display: 'flex', flexDirection: 'column', alignItems: "center", justifyContent: 'center', gap: '10px', padding: '10px' }}>

                                                                        <div style={{ display: 'flex', width: '100%', gap: '3px', }}>

                                                                            <label style={{ display: 'flex', flexDirection: "column", textAlign: 'start', width: "70%", color: 'black' }}>
                                                                                Nome:
                                                                                <Input name={"productName"} style={{ border: '1px solid gray' }} />
                                                                            </label>

                                                                            <label style={{ display: 'flex', flexDirection: "column", textAlign: 'start', width: "30%", color: 'black' }}>
                                                                                Código EAN:
                                                                                <Input name={"ean"} style={{ border: '1px solid gray' }} />
                                                                            </label>

                                                                        </div>

                                                                        <div style={{ display: "flex", width: "100%", gap: '20px' }}>
                                                                            <div style={{ width: "70%" }}>
                                                                                <label style={{ display: 'flex', flexDirection: "column", textAlign: 'start', width: "70%", fontSize: '18pt', color: 'black' }}>
                                                                                    Carregar Imagem
                                                                                    <input name={"img"} type="file" onChange={(e) => { handleImageUpload(e, "productImage") }} />
                                                                                </label>

                                                                                {cropperProductImage && (
                                                                                    <Modal styleModalContent={{ width: "50%", height: "50%", }} content={
                                                                                        <div style={{ marginTop: "20px", width: "100%", display: "flex", alignItems: 'center', justifyContent: 'center', flexDirection: "column" }}>
                                                                                            <Cropper
                                                                                                src={cropperProductImage}
                                                                                                ref={cropperRef}
                                                                                                style={{ height: 400, width: "50%" }}
                                                                                                aspectRatio={1}
                                                                                                autoCrop={true}
                                                                                                guides={true}
                                                                                                cropBoxResizable={true}
                                                                                                zoomable={true}
                                                                                                dragMode="move"
                                                                                            />
                                                                                            <button type="button" onClick={() => handleCrop("productImage")} style={{ marginTop: "10px" }}>
                                                                                                Cortar Imagem
                                                                                            </button>
                                                                                        </div>
                                                                                    } onClose={() => setCropperProductImage(null)} />
                                                                                )}

                                                                                <label style={{ display: 'flex', flexDirection: "column", textAlign: 'start', width: "100%", fontSize: '18pt', color: 'black' }} >
                                                                                    ou Carregar URL
                                                                                    <Input name={"url"} style={{ border: '1px solid gray' }} />
                                                                                </label>
                                                                            </div>

                                                                            <div style={{ border: '1px solid gray', width: '250px', height: '200px', borderRadius: "20px", display: 'flex', alignItems: "center", justifyContent: "center" }}>
                                                                                <img src={productImage} style={{ width: "250px", objectFit: "fill", border: "1px solid black" }} />
                                                                            </div>
                                                                        </div>

                                                                        <div style={{ width: '100%' }} >
                                                                            <Button type={"button"} style={{ width: '10%' }} >+ Produto</Button>
                                                                        </div>

                                                                        <div style={{ width: '100%', display: 'flex', justifyContent: 'end' }} >
                                                                            <Button type={"submit"} style={{ width: '20%', fontSize: '16pt' }} > Salvar </Button>
                                                                        </div>


                                                                    </Form>
                                                                </Formik>
                                                            </div>
                                                        } onClose={() => setModalRegisterProduct(false)} />
                                                    )}
                                                </>
                                            ) : <ul>

                                                {matchingProducts.map((product, idx) => (
                                                    <li key={idx} onClick={() => handleSelectProductWithBg(product, index)}>

                                                        {/* <li key={idx} onClick={() => handleSelectProduct(product, index)}> */}

                                                        {loadingProductImg && <div className="loader"></div>}

                                                        {product.img ? (
                                                            <img
                                                                crossOrigin="anonymous"
                                                                onLoad={() => setLoadingProductImg(false)}
                                                                src={product.img}
                                                                alt={product.name}
                                                            />
                                                        ) : (
                                                            <div style={{ width: 100, height: 100, background: '#f3f3f3' }} />
                                                        )}

                                                        <div>
                                                            <p>{product.name}</p>
                                                            {/* EAN foi removido no back */}
                                                            {/* <p>EAN: {product.ean}</p> */}
                                                            <p>Valor: {product.price}</p>
                                                        </div>
                                                    </li>
                                                ))}

                                            </ul>}
                                        </div>
                                    </div>
                                </div>
                            )}


                        </div>


                        {products[index] && (
                            <div className="detailsProduct">
                                <img
                                    src={
                                        products[index].cutoutSrc
                                        || products[index]?.image?.src
                                        || products[index]?.img
                                        || products[index]?.originalUrl   // <— fallback no reload
                                    }
                                    alt={products[index].name}
                                    style={{ width: 120, height: 'auto', objectFit: 'contain' }}
                                />

                                <div className="inputOfProductsDetails">
                                    <input
                                        type="text"
                                        style={{ height: '15px', width: '100%', fontFamily: "Microsoft" }}
                                        value={products[index].name}
                                        onChange={(e) => handleProductChange(e, index, 'name')}
                                        placeholder="Nome do Produto"
                                    />
                                    <input
                                        type="text"
                                        style={{ height: '15px', width: '70%' }}
                                        value={products[index].valor}
                                        onChange={(e) => handleProductChange(e, index, 'valor')}
                                        placeholder="Valor do Produto"
                                    />

                                    {products[index].radio === "de, por" ? <input type="text" style={{ height: '15px', width: '70%' }} value={products[index].valor2} onChange={(e) => handleProductChange(e, index, 'valor2')} placeholder="Valor do Produto" /> : null}
                                    {products[index].radio === "Clube" ? <input type="text" style={{ height: '15px', width: '70%' }} value={products[index].valor2} onChange={(e) => handleProductChange(e, index, 'valor2')} placeholder="Valor do Produto" /> : null}


                                </div>
                                <div className="radio" style={{ marginLeft: '40px', display: "flex", alignItems: "start", flexDirection: "column", justifyContent: "center" }}>

                                    <label style={{ display: "flex", flexDirection: "row-reverse", alignItems: "center", justifyContent: "center" }}>
                                        De/Por
                                        <input type="radio" name={`radio-${index}`} onChange={() => handleChangeRadio("de, por", products[index].id)} value="1" />
                                    </label>

                                    <label style={{ display: "flex", flexDirection: "row-reverse", alignItems: "center", justifyContent: "center" }}>
                                        Clube
                                        <input type="radio" name={`radio-${index}`} onChange={() => handleChangeRadio("Clube", products[index].id)} value="1" />
                                    </label>

                                </div>
                            </div>

                        )}

                    </div>
                ))}
                {quantityProduct != 0 ? <Button onClick={addContentProductWithButton}>Adicionar Produto</Button> : null}
            </section>
        </main>
    )
}

export default FirstColumn;
