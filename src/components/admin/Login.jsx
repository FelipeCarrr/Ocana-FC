import { useState } from 'react';
import { Login } from '../../firebase/Auth.js';
import Dashboard from './Dashboard';
import { useStore } from '../../utils/store.js';


const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [logged, setLogged] = useStore((state) => [state.logged, state.ChangeLogged]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await Login(email, password);
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  if (logged) {
    return <Dashboard />;
  }

  return (
    <div className="flex justify-center items-center h-screen">
    <form onSubmit={handleLogin} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-1/3">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-center mb-4">Iniciar Sesión</h2>
        <input
          className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="email"
          type="email"
          placeholder="Correo Electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className="mb-8">
        <input
          className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
          id="password"
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      {errorMessage && <p className="text-red-500 text-xs italic mb-4">{errorMessage}</p>}
      <div className="flex items-center justify-center">
        <button
          className="bg-primary hover:bg-green-700 text-white font-bold py-2 px-6 rounded focus:outline-none focus:shadow-outline"
          type="submit"
        >
          Ingresar
        </button>
      </div>
    </form>
  </div>
  );
};

export default LoginForm;
