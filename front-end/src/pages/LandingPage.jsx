import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
    const token = localStorage.getItem("authToken");
    const userId = localStorage.getItem("userId");
    const navigate = useNavigate()

    useEffect(() => {
        if (token, userId) {
            navigate(`/HomePage/${userId}`)
        }
    })


}

export default LandingPage;