import { useContext, useEffect } from 'react';
import HomeContent from './components/HomeContent/HomeContent';
import NavBar from './components/NavBar/NavBar';
import './index.css'
import { GetUser } from '../../services/User/User';
import { useParams } from 'react-router-dom';
import { UserContext } from '../../contexts/UserContext';

const HomePage = () => {

    const {id} = useParams();
    const {setUser} = useContext(UserContext)

    useEffect(() => {
        const getUserInformation = async () => {
            const response = await GetUser(id)
            setUser(response)
        }

        getUserInformation();
    }, [])
    return (
        <main className="homePage">
            <NavBar />
            <HomeContent />
        </main>
    )
}

export default HomePage;