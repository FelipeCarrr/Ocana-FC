import { useState, useEffect } from "react";
import { getAllLiveStreams } from "../../firebase/StreamFirestore";

const StreamClient = () => {
  const [data, setData] = useState(null);
  const [dataFilter, setDataFilter] = useState([]);
  const [valueInput, setValueInput] = useState("");
  const [streams, setStreams] = useState([]);

  const consultAllStreams = async () => {
    try {
      const streams = await getAllLiveStreams();
      setData(streams.docs);
      setDataFilter(streams.docs);
    } catch (error) {
      console.error("Error al cargar los En Vivos:", error);
    }
    setValueInput("");
  };

  const handleChangeValueInput = (e) => {
    setValueInput(e.target.value);
  };

  useEffect(() => {
    consultAllStreams();
  }, []);

  useEffect(() => {
    const actual = [];
    if (data && data.length > 0) {
      data.forEach((doc) => {
        const docData = doc.data();
        const url = docData.URL || '';
        if (url.toLowerCase().includes(valueInput.toLowerCase())) {
          actual.push(doc);
        }
      });
      setDataFilter(actual);
    }
  }, [valueInput, data]);

  useEffect(() => {
    const actual = [];
    if (dataFilter && dataFilter.length > 0) {
      try {
        for (let index = 0; index < dataFilter.length; index++) {
          const streamData = dataFilter[index].data();
          if (streamData.isLive) {
            actual.push(
              <div className="bg-white shadow-md rounded-lg overflow-hidden mb-6 max-w-sm mx-auto" key={dataFilter[index].id}>
                <img
                  src={streamData.frontPage}
                  alt="Live Stream Thumbnail"
                  className="w-full h-full object-cover"
                  onClick={() => window.open(streamData.URL, "_blank")}
                />
              </div>
            );
          }
        }
        setStreams(actual);
      } catch (error) {
        console.error("Error al renderizar los En Vivos:", error);
      }
    }
  }, [dataFilter]);

  return (
    <div className="container mx-auto">
      {/* <input
        type="text"
        value={valueInput}
        onChange={handleChangeValueInput}
        placeholder="Buscar En Vivo"
        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-4"
      /> */}
      <div className="flex flex-wrap -m-2">
        {streams}
      </div>
    </div>
  );
};

export default StreamClient;
