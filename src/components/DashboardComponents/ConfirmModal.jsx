import { FaCheck } from "react-icons/fa";
import { FaTimes } from "react-icons/fa";

const ConfirmModal = ({ hidden, text, onConfirm, onClose }) => {
  return (
    <div className={`${!hidden && "hidden"}`}>
      <div className="fixed top-0 z-50 left-0 w-full h-full bg-black opacity-50"></div>
      <div className="fixed top-0 right-0 bottom-0  z-50 left-0 flex flex-col items-center justify-center">
        <div className="bg-white max-w-sm p-4 rounded-2xl">
          <h5 className="text-xl font-bold text-gray-900 text-center">
            {text}
          </h5>
          <div className="w-full mt-8 flex justify-center ">
            <button
              type="submit"
              className="bg-white border border-primary border-2 text-primary  font-medium rounded-lg text-sm p-1.5 mr-2 mb-2  hover:bg-primary hover:text-white duration-500"
              onClick={onConfirm}
            >
              <FaCheck size={25} />
            </button>
            <button
              type="button"
              className="bg-white border border-red-500 border-2  text-red-500 font-medium rounded-lg text-sm p-1.5 mr-2 mb-2  hover:bg-red-500 hover:text-white duration-500"
              onClick={onClose}
            >
              <FaTimes size={25} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
