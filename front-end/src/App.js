import './App.css';
import './fonts/config/_fonts.css'
import Register from './pages/Cadastro/Cadastro';
import Login from './pages/Login/Login';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ResetPassword from './pages/ResetPassword/ResetPassword';
import HomePage from './pages/HomePage/HomePage';
import PrivateRoute from './Security/PrivateRoutes/PrivateSimpleRoutes';
import Aplication from './pages/App/aplication';
import LandingPage from './pages/LandingPage';
import { StampsProvider } from './contexts/StampsContext';
import { BoxProvider } from './contexts/BoxContext';
import { MyAccount } from './pages/App/MyAccount/MyAccount';
import Plans from './pages/Plans/Plans';

function App() {
  return (
    <StampsProvider>
      <BoxProvider>

        <div className="App">
          <Router>
            <Routes>
              <Route path='/' element={<LandingPage />} />
              <Route path='/login' element={<Login />} />
              <Route path='/register' element={<Register />} />
              <Route path='/redefinir-senha/:token' element={<ResetPassword />} />
              <Route path='/HomePage/:id' element={<PrivateRoute element={<HomePage />} />} />
              <Route path='/MyAccount/:id' element={<PrivateRoute element={<MyAccount/>}/>}/>
              <Route path='/Plans/:id' element={<PrivateRoute element={<Plans/>}/>}/>
              <Route path='/app/:id' element={<PrivateRoute element={<Aplication />} />} />
            </Routes>
          </Router>
        </div>
      </BoxProvider>
    </StampsProvider>
  );
}

export default App;
