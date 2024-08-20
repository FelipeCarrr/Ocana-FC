import { useEffect } from "react";
import { useStore } from "../../utils/store";
import Dashboard from "./Dashboard";
import Login from "./Login";
import { validateSession } from "../../firebase/Auth";



const Admin = () => {
  const [logged] = useStore((state) => [state.logged]);

  useEffect(()=> {
    validateSession();
  }, [logged]);
  if (logged){
    return <Dashboard />
  } else {
    return <Login />
  }
};

export default Admin;