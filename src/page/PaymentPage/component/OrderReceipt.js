import React from "react";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router";
import { useLocation } from "react-router-dom";
import { currencyFormat } from "../../../utils/number";
import { useDispatch } from "react-redux";

import { showToastMessage } from "../../../features/common/uiSlice";
import { deleteCartItem } from "../../../features/cart/cartSlice";
const OrderReceipt = ({ cartList, totalPrice }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  return (
    <div className="receipt-container">
      <h3 className="receipt-title">주문 내역</h3>
      <ul className="receipt-list">
        {cartList.length > 0 &&
          cartList.map((item, index) => {
            const stock = { ...item.productId.stock };
            const stockCount = stock[item.size];
            return (
              <li key={index}>
                <div className="display-flex space-between">
                  <div>
                    {item.productId.name}{" "}
                    {item.qty === 0 ? (
                      <span className="out-of-stock rechoice">
                        [품절되었습니다]
                      </span>
                    ) : item.qty > stockCount && stockCount > 0 ? (
                      <span className="reselect-quantity rechoice">
                        [수량을 다시 선택해주세요!]
                      </span>
                    ) : (
                      `[수량: ${item.qty}]`
                    )}
                  </div>

                  <div>₩ {currencyFormat(item.productId.price * item.qty)}</div>
                </div>
              </li>
            );
          })}
      </ul>
      <div className="display-flex space-between receipt-title">
        <div>
          <strong>Total:</strong>
        </div>
        <div>
          <strong>₩ {currencyFormat(totalPrice)}</strong>
        </div>
      </div>
      {location.pathname.includes("/cart") && cartList.length > 0 && (
        <Button
          variant="dark"
          className="payment-button"
          onClick={() => {
            // 품절된 항목 찾기
            const outOfStockItems = cartList.filter(
              (item) => item.productId.stock[item.size] === 0
            );

            // 품절된 항목이 있는 경우 삭제
            if (outOfStockItems.length > 0) {
              outOfStockItems.forEach((item) => {
                alert(
                  `품절된 ${item.productId.name} 은 장바구니 품목에서 삭제하였습니다.`
                );
                dispatch(deleteCartItem(item._id));
              });
            }

            // 수량이 재고보다 많은 항목 찾기
            const insufficientStockItem = cartList.find(
              (item) =>
                item.qty > item.productId.stock[item.size] &&
                item.productId.stock[item.size] > 0
            );

            // 수량이 부족한 항목이 있는 경우 토스트 메시지 표시
            if (insufficientStockItem) {
              dispatch(
                showToastMessage({
                  message: `${insufficientStockItem.productId.name}의 재고가 고객님이 선택하신 수량보다 적습니다. 수량을 다시 선택해주세요.`,
                  status: "warning",
                })
              );
            } else if (outOfStockItems.length === 0) {
              // 품절 항목이 없고 재고가 충분하면 결제 페이지로 이동
              navigate("/payment");
            }
          }}
        >
          결제 계속하기
        </Button>
      )}

      <div>
        가능한 결제 수단 귀하가 결제 단계에 도달할 때까지 가격 및 배송료는
        확인되지 않습니다.
        <div>
          30일의 반품 가능 기간, 반품 수수료 및 미수취시 발생하는 추가 배송 요금
          읽어보기 반품 및 환불
        </div>
      </div>
    </div>
  );
};

export default OrderReceipt;
