import { Button } from '../../../../components/button/button';
import './index.css'
import { useContext, useEffect, useState } from 'react';
import { GetUser } from '../../../../services/User/User';
import { useNavigate, useParams } from 'react-router-dom';
import Slider from './Slider/Slider';
import { UserContext } from '../../../../contexts/UserContext';
const HomeContent = () => {
    const navigate = useNavigate()
    const { id } = useParams()
    const { user } = useContext(UserContext)



    const handleClick = () => {
        navigate(`/app/${id}`)
    }
    return (
        <main className="contentHomePage">

            <section className="firstContentHome">
                <div className="textAreaHomeContent">
                    <h1>Seja bem vindo {user?.name}!</h1>
                    <h1>Você está a um</h1>
                    <h1>passo de começar</h1>
                    <p>Faça seus tablóides de maneira rápida e fácil.</p>
                </div>

                <div className="buttonAreaHomeContent">
                    <Button onClick={handleClick} style={{ border: '1px solid', width: '25%' }}>Começar</Button>
                </div>

            </section>

            <section className="secondContentHome">
                {<Slider />}
            </section>


        </main>
    )
}

export default HomeContent;