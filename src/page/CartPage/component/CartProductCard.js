import React, { useEffect } from "react";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { Row, Col, Form } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useDispatch } from "react-redux";
import { currencyFormat } from "../../../utils/number";
import { updateQty, deleteCartItem } from "../../../features/cart/cartSlice";
import { showToastMessage } from "../../../features/common/uiSlice";

const CartProductCard = ({ item }) => {
  const dispatch = useDispatch();
  const stock = { ...item.productId.stock };
  const stockCount = stock[item.size];
  useEffect(() => {
    if (item.qty > stockCount && stockCount > 0) {
      dispatch(
        showToastMessage({
          message: `${item.productId.name}의 재고가 고객님이 선택하신 수량보다 적습니다. 수량을 다시 선택해주세요.`,
          status: "warning",
        })
      );
    }
  }, [item.qty, stockCount, item.productId.name, dispatch]);

  useEffect(() => {
    if (stockCount === 0) {
      dispatch(
        showToastMessage({
          message: `${item.productId.name}이 품절되었습니다.`,
          status: "warning",
        })
      );
    }
  }, [stockCount, item.productId.name, dispatch]);

  const handleQtyChange = (id, value) => {
    dispatch(updateQty({ id, value }));
  };

  const deleteCart = (id) => {
    dispatch(deleteCartItem(id));
  };

  return (
    <div className="product-card-cart">
      <Row>
        <Col md={2} xs={12}>
          <img src={item.productId.image} width={112} alt="product" />
        </Col>
        <Col md={10} xs={12}>
          <div className="display-flex space-between">
            <h3>{item.productId.name}</h3>
            <button className="trash-button">
              <FontAwesomeIcon
                icon={faTrash}
                width={24}
                onClick={() => deleteCart(item._id)}
              />
            </button>
          </div>

          <div>
            <strong> {currencyFormat(item.productId.price)}</strong>
          </div>
          <div>Size: {item.size}</div>
          <div>Total: {currencyFormat(item.productId.price * item.qty)}</div>
          <div>
            Quantity:{" "}
            {item.qty > stockCount ? (
              <p className="rechoice">
                재고가 얼마 남지않았습니다. 수량을 다시 선택해주세요!
              </p>
            ) : (
              ""
            )}
            <Form.Select
              onChange={(event) =>
                handleQtyChange(item._id, Number(event.target.value))
              }
              required
              defaultValue={item.qty}
              className="qty-dropdown"
              disabled={stockCount === 0}
            >
              {stockCount === 0 ? (
                <option>품절되었습니다</option>
              ) : (
                <>
                  {/* 사용자가 선택한 수량(item.qty)이 재고(stockCount)보다 크면 그 수량을 옵션에 추가 */}
                  {item.qty > stockCount && (
                    <option value={item.qty}>
                      {item.qty} [남은 재고 : {stockCount}]
                    </option>
                  )}
                  {[...Array(stockCount)].map((_, index) => (
                    <option key={index + 1} value={index + 1}>
                      {index + 1}
                    </option>
                  ))}
                </>
              )}
            </Form.Select>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default CartProductCard;
