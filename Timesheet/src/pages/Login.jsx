import Form from "../components/Form"
import api from "../api";

export const Login = () => {
  return <Form route="/api/token/" method="login"/>
}

export default Login