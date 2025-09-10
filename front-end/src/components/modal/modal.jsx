import './index.css'

const Modal = ({ onClose, message, styleModalContent, content, icon}) => {
    
    return (
        <div className="modal">
            <div className="modal-content" style={styleModalContent}>
                <button style={{width:'30px', height:'30px', position:'absolute', right:'10px', top:'10px'}} onClick={onClose} className="close">&times;</button>
                {icon}
                {message? <h2>{message}</h2> : null}
                {content}
            </div>
        </div>
    );
};


export default Modal