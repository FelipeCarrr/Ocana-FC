import { useState, useEffect } from "react";
import {
  getAllImages,
  getOrderedImages,
} from "../../firebase/GalleryFirestore";

const GalleryClient = () => {
  const [data, setData] = useState([]);
  const [dataFilter, setDataFilter] = useState([]);
  const [valueInput, setValueInput] = useState("");
  const [image, setImage] = useState([]);
  const [filteredImages, setFilteredImages] = useState([]);

  const consultAllImages = async () => {
    try {
      const allImages = await getAllImages();
      setData(allImages);
      setDataFilter(allImages);
      setValueInput("");
    } catch (error) {
      console.error("Error fetching images:", error);
    }
  };

  const handleChangeValueInput = (e) => {
    setValueInput(e.target.value);
  };

  useEffect(() => {
    consultAllImages();
  }, []);

  useEffect(() => {
    const actual = [];
    if (data && data.length > 0) {
      data.forEach((img) => {
        img.name.toLowerCase().includes(valueInput.toLowerCase()) &&
          actual.push(img);
      });
      setDataFilter(actual);
    }
  }, [valueInput]);

  useEffect(() => {
    const fetchImages = async () => {
      const dataFilter = await getOrderedImages();

      const actual = [];

      if (dataFilter && dataFilter.length > 0) {
        try {
          dataFilter.forEach((img) => {
            actual.push(
              <div
                className="bg-white shadow-md rounded-lg overflow-hidden w-full mb-8"
                key={img.refFile}
              >
                <img src={img.downloadURL} alt={img.name} className="w-full" />
              </div>
            );
          });
        } catch (e) {
          console.error(e);
        }
      }
      setImage(actual);
      setFilteredImages(actual);
    };
    fetchImages();
  }, [dataFilter]);

  return (
    <div className="container mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {filteredImages}
      </div>
    </div>
  );
};

export default GalleryClient;
