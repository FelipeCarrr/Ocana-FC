
import './Representados.css';

const Repres = () => {
  // Supongamos que tienes un array de objetos con la información de cada carta
  const representadosData = [
    {
      image: 'url_de_la_imagen_1',
      name: 'Nombre 1',
      position: 'Posición 1',
      team: 'Equipo 1',
    },
    {
      image: 'url_de_la_imagen_2',
      name: 'Nombre 2',
      position: 'Posición 2',
      team: 'Equipo 2',
    },
    // Agrega más objetos según sea necesario
  ];

  return (
    <div className="representados-container">
      <h1>Representados</h1>
      <div className="cards-container">
        {representadosData.map((representado, index) => (
          <div key={index} className="card">
            <div className="card-inner">
              <div className="card-front">
                <img src={representado.image} alt={representado.name} />
              </div>
              <div className="card-back">
                <h2>{representado.name}</h2>
                <p>{representado.position}</p>
                <p>{representado.team}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Repres;
