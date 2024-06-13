import './css/Representados.css';

const CardComponent = ({jugador, posicion, equipo, dateBirth, imageUrl }) => {
  return (
    <div className="card">
    <div className="card-inner">
      <div className="card-front card-front-style"> 
        <img
          src={imageUrl}
          alt={`Jugador ${jugador}`}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="card-back card-back-style"> 
        <p className="text-lg font-semibold mb-1 text-white">JUGADOR</p>
        <p className="text-white">{jugador}</p>
        <p className="text-lg font-semibold mb-1 text-white">POSICIÓN</p>
        <p className="text-white">{posicion}</p>
        <p className="text-lg font-semibold mb-1 text-white">EQUIPO</p>
        <p className="text-white">{equipo}</p>
        <p className="text-lg font-semibold mb-1 text-white">FECHA DE NACIMIENTO</p>
        <p className="text-white">{dateBirth}</p>
      </div>
    </div>
  </div>
);
};

export default CardComponent;
