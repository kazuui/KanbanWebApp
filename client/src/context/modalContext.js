import { createContext, useState , useEffect } from "react";

const ModalContext = createContext();

export const ModalProvider = ({ children, ...rest }) => {
  //const [modalTitle, setModalTitle] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handleShowModal = () => {
    showModal ? setShowModal(false) : setShowModal(true);
  };

  return (
    <ModalContext.Provider value={{ handleShowModal, showModal, setShowModal }}>
      {children}
    </ModalContext.Provider>
  );
};

export default ModalProvider;