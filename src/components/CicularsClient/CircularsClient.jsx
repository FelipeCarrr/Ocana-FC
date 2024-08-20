import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilePdf } from "@fortawesome/free-solid-svg-icons";
import { getAllCirculars } from "../../firebase/CircularsFirestore";

const CircularsClient = () => {
  const [circulars, setCirculars] = useState([]);
  const [filteredCirculars, setFilteredCirculars] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [circularElements, setCircularElements] = useState([]);

  const fetchAllCirculars = async () => {
    try {
      const allCirculars = await getAllCirculars();
      setCirculars(allCirculars.docs);
      setFilteredCirculars(allCirculars.docs);
      setSearchInput("");
    } catch (error) {
      console.error("Error fetching circulars:", error);
    }
  };

  const handleChangeSearchInput = (e) => {
    setSearchInput(e.target.value);
  };

  useEffect(() => {
    fetchAllCirculars();
  }, []);

  useEffect(() => {
    const filtered = circulars.filter((doc) =>
      doc.data().title.toLowerCase().includes(searchInput.toLowerCase())
    );
    setFilteredCirculars(filtered);
  }, [searchInput, circulars]);

  useEffect(() => {
    const circularList = [];
    if (filteredCirculars && filteredCirculars.length > 0) {
      filteredCirculars.forEach((doc) => {
        circularList.push(
          <div
            className="relative overflow-hidden bg-white rounded-xl shadow-lg transition-transform transform hover:scale-105"
            style={{ width: "300px", height: "250px" }}
            key={doc.id}
          >
            <div className="p-4">
              <div className="flex justify-center mb-4">
                <FontAwesomeIcon
                  icon={faFilePdf}
                  size="6x"
                  className="text-red-500"
                />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2 text-center">
                {doc.data().title}
              </h3>
              <div className="flex justify-center space-x-4 mt-4">
                <a
                  href={doc.data().fileURL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-primary flex items-center justify-center hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105"
                >
                  Ver PDF
                </a>
              </div>
            </div>
          </div>
        );
      });
      setCircularElements(circularList);
    }
  }, [filteredCirculars]);

  return (
  <>
    <div className="flex flex-wrap justify-center gap-8">{circularElements}</div>
  </>
  );
};

export default CircularsClient;
