import { useState } from "react";
import api from "../api";
import { useNavigate, useLocation } from "react-router-dom";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
import LoadingIndicator from "./LoadingIndicator";
import { FaLock, FaUser } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { jwtDecode } from "jwt-decode";
import loginImage from '../assets/Loginform/loginimage.png';
import classes from '../assets/Loginform/loginform.module.css';
import Swal from "sweetalert2";

function Form({ route, method }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [employee_id, setEmployeeID] = useState("");
    const [first_name, setFirstName] = useState("");
    const [last_name, setLastName] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const currentPath = location.pathname;

    const name = method === "login" ? "Login" : "Register";

const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();

    try {
        var isSuperUser = false;
        if (method === "login") {
            const res = await api.post(route, { username, password });
            localStorage.setItem(ACCESS_TOKEN, res.data.access);
            localStorage.setItem(REFRESH_TOKEN, res.data.refresh);

            const token = localStorage.getItem(ACCESS_TOKEN);

            try {
                console.log("JWT token --->", token)
                const decoded = jwtDecode(token);
                const tokenExpiration = decoded.exp;
                const now = Date.now() / 1000;
            
                if (tokenExpiration < now) {
                    await refreshToken();
                } else {
                    isSuperUser = (decoded.is_superuser);
                }
            } catch (error) {
                console.error("JWT decoding failed:", error);
            }
            //if admin
            if(isSuperUser){
                navigate("/admin");
            }
            else{
                navigate("/");
            }

        } else {
            const res = await api.post(route, { username, password, email, first_name, last_name, employee_id });
            navigate("/login");
        }
    } catch (error) {
        if (method === "login") {
            console.log("Error --> " + error);
            Swal.fire({
                icon: "error",
                title: "Login Failed",
                text: "Incorrect Username or Password",
            });
        } else {
            console.log("Error --> " + error);
            Swal.fire({
                icon: "error",
                title: "Registration Failed",
                text: "Username already exists",
            });
        }
    } finally {
        setLoading(false);
    }
};


    return (
        <div className={classes.wrapper}>
            <form onSubmit={handleSubmit} className={classes['form-container']}>
                <img src={loginImage} alt={"loginImage"}/>
                <h1>{name}</h1>
                <div className={classes['input-box']}>
                    <input
                        className={classes['form-input']}
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder='Username'
                        required
                    />
                    <FaUser className={classes.icon}/>
                </div>
                {currentPath === '/register' && (
                    <div className={classes['input-box']}>
                        <input
                            className={classes['form-input']}
                            type="text"
                            value={first_name}
                            onChange={(e) => setFirstName(e.target.value)}
                            placeholder="First Name"
                            required
                        />
                        <FaUser className={classes.icon}/>
                    </div>
                )}
                {currentPath === '/register' && (
                    <div className={classes['input-box']}>
                        <input
                            className={classes['form-input']}
                            type="text"
                            value={last_name}
                            onChange={(e) => setLastName(e.target.value)}
                            placeholder="Last Name"
                            required
                        />
                        <FaUser className={classes.icon}/>
                    </div>
                )}
                {currentPath === '/register' && (
                    <div className={classes['input-box']}>
                        <input
                            className={classes['form-input']}
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Email"
                            required
                        />
                        <MdEmail className={classes.icon}/>
                    </div>
                )}
                {currentPath === '/register' && (
                    <div className={classes['input-box']}>
                        <input
                            className={classes['form-input']}
                            type="text"
                            value={employee_id}
                            onChange={(e) => setEmployeeID(e.target.value)}
                            placeholder="EmployeeID"
                            required
                        />
                        <MdEmail className={classes.icon}/>
                    </div>
                )}
                <div className={classes['input-box']}>
                    <input
                        className={classes['form-input']}
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder='Password'
                        required
                    />
                    <FaLock className={classes.icon}/>
                </div>
                <div className={classes['login-button']}>
                    {loading && <LoadingIndicator />}
                    <button className={classes['form-button']} type="submit">{name.toUpperCase()}</button>
                </div>
            </form>
        </div>
    );
}

export default Form;