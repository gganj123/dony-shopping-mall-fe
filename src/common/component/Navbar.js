import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-regular-svg-icons";
import {
  faBars,
  faBox,
  faSearch,
  faShoppingBag,
  faUserShield,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../features/user/userSlice";
import { getCartList } from "../../features/cart/cartSlice";
import EventHeader from "./EventHeader";

const Navbar = ({ user }) => {
  const dispatch = useDispatch();
  const { cartItemCount } = useSelector((state) => state.cart);
  const isMobile = window.navigator.userAgent.indexOf("Mobile") !== -1;
  const [showSearchBox, setShowSearchBox] = useState(false);
  const menuList = [
    "BEST 50",
    "NEW",
    "TOP",
    "PANTS",
    "OUTER",
    "ACCESSORY",
    "SALE",
  ];
  let [width, setWidth] = useState(0);
  let navigate = useNavigate();

  useEffect(() => {
    if (user) {
      dispatch(getCartList());
    }
  }, [dispatch, user]);

  const onCheckEnter = (event) => {
    if (event.key === "Enter") {
      if (event.target.value === "") {
        return navigate("/");
      }
      navigate(`?name=${event.target.value}`);
    }
  };
  const handleLogout = () => {
    dispatch(logout());
    dispatch(getCartList());
  };
  return (
    <div>
      {showSearchBox && (
        <div className="display-space-between mobile-search-box w-100">
          <div className="search display-space-between w-100">
            <div>
              <FontAwesomeIcon className="search-icon" icon={faSearch} />
              <input
                type="text"
                placeholder="제품검색"
                onKeyPress={onCheckEnter}
              />
            </div>
            <button
              className="closebtn"
              onClick={() => setShowSearchBox(false)}
            >
              &times;
            </button>
          </div>
        </div>
      )}
      <div className="side-menu" style={{ width: width }}>
        <button className="closebtn" onClick={() => setWidth(0)}>
          &times;
        </button>

        <div className="side-menu-list" id="menu-list">
          {menuList.map((menu, index) => (
            <button key={index}>{menu}</button>
          ))}
        </div>
      </div>
      {/* <EventHeader /> */}

      <div className="nav-header">
        <div onClick={() => navigate("/")} className="nav-title-text">
          Dony shop
        </div>
        <div className="burger-menu hide">
          <FontAwesomeIcon icon={faBars} onClick={() => setWidth(250)} />
        </div>

        <div>
          <div className="display-flex">
            <div
              onClick={() => navigate("/admin/product?page=1")}
              className="nav-icon"
            >
              {user && user.level === "admin" && (
                <>
                  <FontAwesomeIcon icon={faUserShield} />
                  <span style={{ cursor: "pointer" }}>관리자 페이지</span>
                </>
              )}
            </div>
            {user ? (
              <div onClick={handleLogout} className="nav-icon">
                <FontAwesomeIcon icon={faUser} />
                {!isMobile && (
                  <span style={{ cursor: "pointer" }}>로그아웃</span>
                )}
              </div>
            ) : (
              <div onClick={() => navigate("/login")} className="nav-icon">
                <FontAwesomeIcon icon={faUser} />
                {!isMobile && <span style={{ cursor: "pointer" }}>로그인</span>}
              </div>
            )}
            <div onClick={() => navigate("/cart")} className="nav-icon">
              <FontAwesomeIcon icon={faShoppingBag} />
              {!isMobile && (
                <span style={{ cursor: "pointer" }}>{`쇼핑백(${
                  cartItemCount || 0
                })`}</span>
              )}
            </div>
            <div
              onClick={() => navigate("/account/purchase")}
              className="nav-icon"
            >
              <FontAwesomeIcon icon={faBox} />
              {!isMobile && <span style={{ cursor: "pointer" }}>내 주문</span>}
            </div>
            {isMobile && (
              <div className="nav-icon" onClick={() => setShowSearchBox(true)}>
                <FontAwesomeIcon icon={faSearch} />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* <div className="nav-logo"></div> */}
      <div className="nav-menu-area">
        <ul className="menu">
          {menuList.map((menu, index) => (
            <li className="li_menu" key={index}>
              <a href="#">{menu}</a>
            </li>
          ))}
        </ul>
        {!isMobile && ( // admin페이지에서 같은 search-box스타일을 쓰고있음 그래서 여기서 서치박스 안보이는것 처리를 해줌
          <div className="search-box landing-search-box ">
            <FontAwesomeIcon icon={faSearch} />
            <input
              type="text"
              placeholder="제품검색"
              onKeyPress={onCheckEnter}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
