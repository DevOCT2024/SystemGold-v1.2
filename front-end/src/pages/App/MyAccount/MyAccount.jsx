import { useContext } from "react"
import { UserContext } from "../../../contexts/UserContext"
import "./index.css"
import {formatDate} from "date-fns"
import { ptBR } from 'date-fns/locale';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAddressCard, faClone, faCreditCard, faSquareCheck } from "@fortawesome/free-regular-svg-icons";
import { faGear } from "@fortawesome/free-solid-svg-icons";
import { useNavigate, useParams } from "react-router-dom";
import NavBar from "../../HomePage/components/NavBar/NavBar";

export const MyAccount = () => {

    const {user} = useContext(UserContext)
    const navigate = useNavigate();
    const {token , id} = useParams()

    return(
        <main className="mainMyAccount">
            <NavBar/>
            <div className="header-myAccount">
                <h1 style={{fontSize:"40px"}}>Conta</h1>
                <h3 style={{ color: " rgba(0, 0, 0, 0.622)" }}> Detalhes da adesão</h3>
            </div>
            <div className="planEasyManegement">

                <div className="memberSince">
                    Membro desde {formatDate(new Date(user.createdAt), "dd/MM/yyyy", ptBR)}
                </div>

                <div className="informationOfPlan">
                    <p>Plano</p>
                    <p>Próximo pagamento:</p>
                </div>

                <hr className="hr"/>

                <div onClick={() => navigate(`/Plans/${id}`)} className="manageMembership">
                    <h3>Gerir Adesão</h3>
                </div>
            </div>

            <div className="header-myAccount">
                <h3 style={{ color: " rgba(0, 0, 0, 0.622)" }}>Ligações Rápidas</h3>
            </div>
            <div className="planEasyManegement">

                <div onClick={() => navigate(`/Plans/${id}`)} className="manageMembership">
                    <h3><FontAwesomeIcon icon={faClone} /> Alterar plano</h3>
                </div>

                <hr className="hr"/>

                <div className="manageMembership">
                    <h3><FontAwesomeIcon icon={faCreditCard} /> Alterar forma de pagamento</h3>
                </div>

                <hr className="hr"/>

                <div className="manageMembership">
                    <h3><FontAwesomeIcon icon={faAddressCard}/> Alterar informações da conta</h3>
                </div>

                <hr className="hr"/>

                <div className="manageMembership">
                    <h3><FontAwesomeIcon icon={faSquareCheck} /> Termos de uso</h3>
                </div>

                <hr className="hr"/>

                <div className="manageMembership">
                    <h3> <FontAwesomeIcon icon={faGear} /> Configurações</h3>
                </div>


            </div>
        </main>
    )
}