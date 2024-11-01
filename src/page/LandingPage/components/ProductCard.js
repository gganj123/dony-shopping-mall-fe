import React from "react";
import { useNavigate } from "react-router-dom";
import { currencyFormat } from "../../../utils/number";
import "../../../App.css";

const ProductCard = ({ item }) => {
  const navigate = useNavigate();
  const showProduct = (id) => {
    navigate(`/product/${id}`);
  };
  return (
    <div className="card" onClick={() => showProduct(item._id)}>
      <img src={item?.image} alt={item?.image} />
      <div className="card_name">{item?.name}</div>
      <div className="card_price">{currencyFormat(item?.price)}</div>
    </div>
  );
};

export default ProductCard;
