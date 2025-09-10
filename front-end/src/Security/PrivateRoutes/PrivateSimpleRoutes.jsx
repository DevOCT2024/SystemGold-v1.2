import React from 'react';
import { Navigate, useParams} from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';



const PrivateRoute = ({ element }) => {
  const {id} = useParams();
  
  const  localId  = localStorage.getItem('userId');  
  const authToken = localStorage.getItem('authToken');


  if (!authToken) {
    return <Navigate to="/login" />;
  }


  try {

    const decodedToken = jwtDecode(authToken);

    const currentTime = Date.now() /1000;
    const userId = decodedToken.id;


    if(currentTime > decodedToken.exp){
        return <Navigate to="/login"/>;
    }
    

    if (localId !== userId || id !== userId ) {

      return <Navigate to="/login" />;

    };
    

    return element;
  } catch (error) {
    console.error('Erro ao decodificar o token:', error);
    return <Navigate to="/login" />;
  }
};

export default PrivateRoute;
