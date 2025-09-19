import { width } from '@fortawesome/free-regular-svg-icons/faAddressBook'
import { Button } from '../../../../../../components/button/button'
import './index.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleLeft, faCircleRight } from '@fortawesome/free-regular-svg-icons'
import { useEffect, useState } from 'react'
import { getStamps } from '../../../../../../services/StampsAndBox/Stamps'
import { useStamps } from '../../../../../../contexts/StampsContext';
import { getAllBoxs } from '../../../../../../services/StampsAndBox/Box'
import { useBox } from '../../../../../../contexts/BoxContext'
import { toDataUrl } from "../../../../../../utils/toDataUrl"
export const BoxDecoration = () => {
    const [stamps, setStamps] = useState([])
    const [box, setBox] = useState([])
    const { setStampsKonva } = useStamps();
    const { setBoxData } = useBox()
    const [currentIndex, setCurrentIndex] = useState(0);
    const [currentIndexBox, setCurrentIndexBox] = useState(0);
    const itemsPerPage = 4;

    const FILES_BASE = process.env.REACT_APP_FILES_BASE || 'http://localhost:5532/files';
    const toUrl = (val) => {
        if (!val) return null;
        if (typeof val !== 'string') return null;
        if (val.startsWith('data:')) return val;               // já é base64
        if (/^https?:\/\//i.test(val)) return val;             // já é http(s)
        if (val.startsWith('/files/'))                         // já vem com /files
            return `${FILES_BASE}${val.replace(/^\/files/, '')}`;
        // valor relativo do BD: "box/15.png", "stamps/x.png", "products/y.jpg", "exemples/z.png"
        return `${FILES_BASE}/${encodeURI(val)}`;
    };


    useEffect(() => {
        const fetchStamps = async () => {
            try {
                const response = await getStamps();
                const list = Array.isArray(response) ? response : [];
                // 🔄 antes: toDataUrl(item.img)
                const urls = list
                    .map((item) => item?.url || toUrl(item?.img))
                    .filter(Boolean);
                setStamps(urls);
                // console.log('stamps carregados:', urls.length);
                // if (urls[0]) console.log('stamp[0]:', urls[0]);
            } catch (err) {
                console.error('Erro ao carregar stamps:', err);
                setStamps([]);
            }
        };

        const fetchBox = async () => {
            try {
                const data = await getAllBoxs();
                const list = Array.isArray(data) ? data : [];
                // 🔄 antes: toDataUrl(item.img)
                const urls = list
                    .map((item) => item?.url || toUrl(item?.img))
                    .filter(Boolean);
                setBox(urls);
                // console.log('box carregados:', urls.length); AVISO DO CONSOLE SE BOX ESTÃO CARREGADAS    
                // if (urls[0]) console.log('box[0]:', urls[0])
            } catch (err) {
                console.error('Erro ao carregar box:', err);
                setBox([]);
            }
        };

        fetchStamps();
        fetchBox();
    }, []);




    const imgs = [
        { id: "1", src: "https://via.placeholder.com/65" },
        { id: "2", src: "https://via.placeholder.com/65" },
        { id: "3", src: "https://via.placeholder.com/65" },
        { id: "4", src: "https://via.placeholder.com/65" },
    ]



    const handleSelectStamps = (e, type) => {
        if (type === "selo") {
            const newStamp = {
                id: `${Date.now()}`,
                image: new window.Image(),
                width: 100,
                height: 100,
                x: 100,
                y: 100,
            };
            newStamp.image.src = e.target.currentSrc;

            setStampsKonva((prev) => [...prev, newStamp]);
        } else {
            const newBox = {
                id: `${Date.now()}`,
                image: new window.Image(),
                width: 100,
                height: 100,
                x: 100,
                y: 100,
            };
            newBox.image.src = e.target.currentSrc;

            setBoxData((prev) => [...prev, newBox]);
        }
    };





    const goPrev = (type) => {
        type === "selo" ? setCurrentIndex((prev) => Math.max(prev - itemsPerPage, 0)) :
            setCurrentIndexBox((prev) => Math.max(prev - itemsPerPage, 0));
    };

    const goNext = (type) => {
        type === "selo" ? setCurrentIndex((prev) =>
            Math.min(prev + itemsPerPage, stamps.length - itemsPerPage)
        ) :
            setCurrentIndexBox((prev) =>
                Math.min(prev + itemsPerPage, box.length - itemsPerPage)
            );
    };

    // PARA ESCONDER O PAINEL DE SELOS E BOX
    const [showStamps, setShowStamps] = useState(false); // Selos
    const [showBox, setShowBox] = useState(false);       // Box

    const hidePanel = (which) => {
        if (which === "selo") setShowStamps(false);
        if (which === "box") setShowBox(false);
    };

    const showPanel = (which) => {
        if (which === "selo") setShowStamps(true);
        if (which === "box") setShowBox(true);
    };


    return (
        <div className="box-container">

            {/* SELOS */}
            {showStamps && (
                <div className="box">
                    {/* botão fechar (topo direito) */}
                    <div className="box-header">
                        <h3>Selos</h3>
                        <button
                            className="box-hide-btn"
                            onClick={() => hidePanel("selo")}
                            aria-label="Ocultar Selos"
                            title="Ocultar Selos"
                        >
                            x
                        </button>
                    </div>

                    <div style={{ display: 'flex', gap: '5px', width: '100%', height: '70%', alignItems: 'center', justifyContent: 'center' }}>
                        <button onClick={() => goPrev("selo")} className="prev-button">
                            <FontAwesomeIcon size='2x' icon={faCircleLeft} />
                        </button>

                        {stamps?.slice(currentIndex, currentIndex + itemsPerPage).map((img, index) => (
                            <img
                                key={index}
                                style={{ width: '60px', height: '60px' }}
                                src={img}
                                alt="Imagem"
                                className="box-image"
                                onClick={(e) => handleSelectStamps(e, "selo")}
                            />
                        ))}

                        <button onClick={() => goNext("selo")} className="next-button">
                            <FontAwesomeIcon size='2x' icon={faCircleRight} />
                        </button>
                    </div>

                    <div style={{ display: "flex", gap: '10px', width: "100%", height: "30%", justifyContent: 'space-evenly' }}>
                        <Button style={{ width: '80px' }}>Ver+</Button>
                        {/* <p ...>Ou clique aqui para carregar um selo</p> */}
                    </div>
                </div>
            )}

            {/* BOX */}
            {showBox && (
                <div className="box">
                    {/* botão fechar (topo direito) */}
                    <div className="box-header">
                        <h3>Box</h3>
                        <button
                            className="box-hide-btn"
                            onClick={() => hidePanel("box")}
                            aria-label="Ocultar Box"
                            title="Ocultar Box"
                        >
                            x
                        </button>
                    </div>


                    <div style={{ display: 'flex', gap: '5px', width: '100%', height: '70%', alignItems: 'center', justifyContent: 'center' }}>
                        <button onClick={() => goPrev("box")} className="prev-button">
                            <FontAwesomeIcon size='2x' icon={faCircleLeft} />
                        </button>

                        <div style={{ display: "flex", gap: '10px', width: "100%", height: "70%", alignItems: 'center', justifyContent: 'center' }}>
                            {box?.slice(currentIndexBox, currentIndexBox + itemsPerPage).map((img, index) => (
                                <img
                                    key={index}
                                    style={{ width: '60px', height: '60px' }}
                                    src={img}
                                    alt="Imagem"
                                    className="box-image"
                                    onClick={(e) => handleSelectStamps(e, "box")}
                                />
                            ))}
                        </div>

                        <button onClick={() => goNext("box")} className="next-button">
                            <FontAwesomeIcon size='2x' icon={faCircleRight} />
                        </button>
                    </div>

                    <div style={{ display: "flex", gap: '10px', width: "100%", height: "30%", justifyContent: 'space-evenly' }}>
                        <Button style={{ width: '80px' }}>Ver+</Button>
                        {/* <p ...>Ou clique aqui para carregar um box</p> */}
                    </div>
                </div>
            )}

            {/* Botões flutuantes para reabrir quando estiverem ocultos */}
            <div className="reopen-floating">
                {!showStamps && (
                    <button
                        className="reopen-btn"
                        onClick={() => showPanel("selo")}
                        aria-label="Mostrar Selos"
                        title="Mostrar Selos"
                    >
                        Selos
                    </button>
                )}
                {!showBox && (
                    <button
                        className="reopen-btn"
                        onClick={() => showPanel("box")}
                        aria-label="Mostrar Box"
                        title="Mostrar Box"
                    >
                        Box
                    </button>
                )}
            </div>

        </div>

    )
}