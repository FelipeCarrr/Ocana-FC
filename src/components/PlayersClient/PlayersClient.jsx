import { useState, useEffect } from "react";
import { getAllPlayers } from "../../firebase/PlayersFirestore";
import CardComponent from "../Card";

const PlayersClient = () => {
  const [data, setData] = useState(null);
  const [dataFilter, setDataFilter] = useState(null);
  const [valueInput, setValueInput] = useState("");
  const [player, setPlayer] = useState([]);

  const consultAllPlayers = () => {
    const player = getAllPlayers();
    player.then((result) => {
      setData(result.docs);
      setDataFilter(result.docs);
    });
    setValueInput("");
  };
  const handleChangeValueInput = (e) => {
    setValueInput(e.target.value);
  };

  useEffect(() => {
    consultAllPlayers();
  }, []);

  useEffect(() => {
    const actual = [];
    if (data && data.length > 0) {
      data.forEach((doc) => {
        (doc.data().posicion.toLowerCase().includes(valueInput.toLowerCase()) ||
          doc
            .data()
            .jugador.toLowerCase()
            .includes(valueInput.toLowerCase())) &&
          actual.push(doc);
      });
      setDataFilter(actual);
    }
  }, [valueInput]);

  useEffect(() => {
    const actual = [];

    if (dataFilter && dataFilter.length > 0) {
      try {
        dataFilter.forEach((doc) => {
          actual.push(
            <div className="mb-6" key={doc.id}>
              <CardComponent
                jugador={doc.data().jugador}
                posicion={doc.data().posicion}
                equipo={doc.data().equipo}
                dateBirth={doc.data().dateBirth}
                imageUrl={doc.data().frontPage}
              />
            </div>
          );
        });
      } catch (e) {
        console.error(e);
      }
    }
    setPlayer(actual);
  }, [dataFilter]);

  return (
    <div className="container mx-auto py-20">
      <div className="flex flex-wrap justify-center gap-10 md:gap-6 lg:gap-8">
        {player}
      </div>
    </div>
  );
};

export default PlayersClient;
