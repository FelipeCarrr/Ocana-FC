import { useState, useEffect } from "react";
import { getAllStaff } from "../../firebase/StaffFirestore";

const StaffClient = () => {
  const [data, setData] = useState(null);
  const [dataFilter, setDataFilter] = useState(null);
  const [valueInput, setValueInput] = useState("");
  const [staff, setStaff] = useState([]);

  const conultAllStaff = () => {
    const staff = getAllStaff();
    staff.then((result) => {
      setData(result.docs);
      setDataFilter(result.docs);
    });
    setValueInput("");
  };
  const handleChangeValueInput = (e) => {
    setValueInput(e.target.value);
  };

  useEffect(() => {
    conultAllStaff();
  }, []);
  
  useEffect(() => {
    const actual = [];
    if (dataFilter && dataFilter.length > 0) {
      dataFilter.forEach((doc) => {
        actual.push(
          <div
            className="relative overflow-hidden bg-white rounded-xl shadow-lg transition-transform transform hover:scale-105"
            style={{ width: "400px", height: "400px" }}
            key={doc.id}
          >
            <img
              src={doc.data().frontPage}
              alt={`img-${doc.data().nombre}`}
              className="w-full h-auto rounded-t-xl"
            />
            <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-gray-900 to-transparent p-4">
              <h3 className="text-lg font-semibold text-white mb-2">
                {doc.data().nombre}
              </h3>
              <p className="text-gray-300">{doc.data().cargo}</p>
            </div>
          </div>
        );
      });
      setStaff(actual);
    }
  }, [dataFilter]);

  return (
    <div className="flex flex-wrap justify-center gap-8">
        {staff}
    </div>
);
};

export default StaffClient;
