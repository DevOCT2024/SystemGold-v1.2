import logobranca from "../../../../sources/logo-branca.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { GetUser } from '../../../../services/User/User';
import './index.css'
import { useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { UserContext } from "../../../../contexts/UserContext";

const NavBar = () => {
    const {id} = useParams()
    const {user} = useContext(UserContext)
    const navigate = useNavigate();

    return (
        <main className="navBarHomePage">
            <ul className="listNavBarHomePage">
                <li className="optionsMenuBar">
                    <img src={logobranca} alt="logo-branca" />
                </li>

                <li className="optionsMenuBar">
                    {user?.name}
                    <div className="userMenu">
                    <FontAwesomeIcon size="2x" color="gray" icon={faUser} />
                    </div>

                    <div className="dropdown-menu">
                        <ul className="dropdown-menu-list">
                            <li className="optionsAccount"><a onClick={() =>navigate(`/MyAccount/${id}`)}>Minha Conta</a></li>
                            <li className="optionsAccount"><a href="">Planos</a></li>
                            <li className="optionsAccount"><a href="">Meus Produtos</a></li>
                            <li className="optionsAccount"><a href="">Meus Layouts</a></li>
                        </ul>
                    </div>
                </li>
            </ul>
        </main>
    )
}

export default NavBar;