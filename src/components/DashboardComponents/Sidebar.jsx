import { LogOut } from "../../firebase/Auth";

const Sidebar = ({ onSelect }) => {
  const handleLogout = () => {
    LogOut();
  };

  return (
    <div className="bg-gray-800 fixed h-screen w-64 flex flex-col justify-between">
      <div className="p-4">
        <h1 className="text-white text-3xl font-bold mb-8">Dashboard</h1>
        <ul>
          <li>
            <a
              href="#"
              onClick={() => onSelect('news')}
              className="flex items-center text-white text-lg font-semibold hover:text-gray-400"
            >
              <span className="mr-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </span>
              Noticias
            </a>
          </li>
          <li>
            <a
              href="#"
              onClick={() => onSelect('players20')}
              className="flex items-center text-white text-lg font-semibold hover:text-gray-400 mt-4"
            >
              <span className="mr-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </span>
              Jugadores Sub 20
            </a>
          </li>
          <li>
            <a
              href="#"
              onClick={() => onSelect('gallery')}
              className="flex items-center text-white text-lg font-semibold hover:text-gray-400 mt-4"
            >
              <span className="mr-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </span>
              Galeria
            </a>
          </li>
          <li>
            <a
              href="#"
              onClick={() => onSelect('staff')}
              className="flex items-center text-white text-lg font-semibold hover:text-gray-400 mt-4"
            >
              <span className="mr-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </span>
              Staff
            </a>
          </li>
          <li>
            <a
              href="#"
              onClick={() => onSelect('events')}
              className="flex items-center text-white text-lg font-semibold hover:text-gray-400 mt-4"
            >
              <span className="mr-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </span>
              Cumpleaños
            </a>
          </li>
          <li>
            <a
              href="#"
              onClick={() => onSelect('stream')}
              className="flex items-center text-white text-lg font-semibold hover:text-gray-400 mt-4"
            >
              <span className="mr-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </span>
              Transmiciones
            </a>
          </li>
        </ul>
      </div>
      <div className="p-4">
        <button
          onClick={handleLogout}
          className="bg-primary hover:bg-green-900 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
        >
          LogOut
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
