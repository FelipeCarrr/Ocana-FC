import { useState, useEffect } from "react";
import { getAllNoticias } from "../../firebase/Firestore";

const NewsClient = () => {
  const [data, setData] = useState(null);
  const [dataFilter, setDataFilter] = useState(null);
  const [valueInput, setValueInput] = useState("");
  const [news, setNews] = useState([]);

  const consultAllNews = () => {
    const noticia = getAllNoticias();
    noticia.then((result) => {
      setData(result.docs);
      setDataFilter(result.docs);
    });
    setValueInput("");
  };
  const handleChangeValueInput = (e) => {
    setValueInput(e.target.value);
  };

  useEffect(() => {
    consultAllNews();
  }, []);

  useEffect(() => {
    const actual = [];
    if (data && data.length > 0) {
      data.forEach((doc) => {
        (doc.data().name.toLowerCase().includes(valueInput.toLowerCase()) ||
          doc.data().author.toLowerCase().includes(valueInput.toLowerCase())) &&
          actual.push(doc);
      });
      setDataFilter(actual);
    }
  }, [valueInput]);

  useEffect(() => {
    const actual = [];

    if (dataFilter && dataFilter.length > 0) {
      try {
        if (dataFilter && dataFilter.length > 0)
          for (let index = 0; index < dataFilter.length; index++) {
            actual.push(
              <div
                className={`rounded-lg  w-full  mb-6 break-inside-avoid-column `}
                key={dataFilter[index].id}
              >
                <div className="bg-white shadow-md rounded-lg overflow-hidden">
                  <img
                    src={dataFilter[index].data().frontPage}
                    alt={`img-${dataFilter[index].data().title}`}
                    className="w-full"
                  />
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2">
                      {dataFilter[index].data().title}
                    </h3>
                    <p className="text-gray-700">
                      {dataFilter[index].data().description}
                    </p>
                    <a
                      href={dataFilter[index].data().URL}
                      className="bg-primary block text-center hover:bg-green-900 text-gray-900 font-bold py-2 px-6 rounded-full uppercase tracking-wide mt-4"
                    >
                      Leer más
                    </a>
                  </div>
                </div>
              </div>
            );
          }
      } catch (e) {
        console.error(e);
      }
    }
    setNews(actual);
  }, [dataFilter]);

  return (
    <>
      <div className="w-full flex flex-wrap justify-center mt-6">
        {news.map((item, index) => (
          <div key={index} className="w-full sm:w-1/2 lg:w-1/3 p-4">
            {item}
          </div>
        ))}
      </div>
    </>
  );
};

export default NewsClient;
