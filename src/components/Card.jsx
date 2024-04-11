import './Representados.css';

const CardComponent = ({name, position, team, birthDate, imageUrl }) => {
  return (
    <div className="card">
    <div className="card-inner">
      <div className="card-front card-front-style"> 
        <img
          src={imageUrl}
          alt={`Representado ${name}`}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="card-back card-back-style"> 
        <p className="text-lg font-semibold mb-1 text-white">JUGADOR</p>
        <p className="text-white">{name}</p>
        <p className="text-lg font-semibold mb-1 text-white">POSICIÓN</p>
        <p className="text-white">{position}</p>
        <p className="text-lg font-semibold mb-1 text-white">EQUIPO</p>
        <p className="text-white">{team}</p>
        <p className="text-lg font-semibold mb-1 text-white">
          FECHA DE NACIMIENTO
        </p>
        <p className="text-white">{birthDate}</p>
      </div>
    </div>
  </div>
);
};

export default CardComponent;
