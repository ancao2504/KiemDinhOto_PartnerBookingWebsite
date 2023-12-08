import React from 'react';
import { useHistory } from 'react-router-dom';
import { ReactComponent as DefaultLeftIcon } from './../../assets/new-icons/ArrowLeft.svg';

const BackButtonPC = ({ title = "Quay lại", Icon = DefaultLeftIcon, onClick }) => {
  const history = useHistory();

  const handleClick = () => {
    if (typeof onClick === 'function') {
      onClick();
      return;
    }

    if (typeof onClick === 'string') {
      history.push(onClick);
      return;
    }

    history.goBack();
  };

  return (
    <div className="d-flex justify-content-center align-items-center d-none d-lg-flex cursor" onClick={handleClick} style={{ height : 50 }}>
      <Icon />
      <span className="ps-2" style={{ color: "#0870d9" , fontSize : 16 }}>{title}</span>
    </div>
  );
};

export default BackButtonPC;
