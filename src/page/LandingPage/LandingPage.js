import React, { useEffect, useState } from "react";
import ProductCard from "./components/ProductCard";
import { Row, Col, Container } from "react-bootstrap";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getProductList } from "../../features/product/productSlice";
import ReactPaginate from "react-paginate";
import { Spinner } from "react-bootstrap";
import "../../App.css";

const LandingPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { productList, totalPageNum, loading } = useSelector(
    (state) => state.product
  );

  const [query, setQuery] = useSearchParams();
  const name = query.get("name") || "";
  const page = Number(query.get("page")) || 1;

  const [searchQuery, setSearchQuery] = useState({ page, name });

  // 상품 리스트 가져오기
  useEffect(() => {
    dispatch(getProductList(searchQuery));
  }, [searchQuery, dispatch]);

  // 쿼리가 바뀔 때마다 searchQuery 상태 업데이트
  useEffect(() => {
    setSearchQuery({ page, name });
  }, [query]);

  // 페이지 변경 시 쿼리 업데이트
  const handlePageClick = ({ selected }) => {
    const newPage = selected + 1;
    setQuery({ name, page: newPage });
  };

  return (
    <Container>
      <Row>
        {loading ? ( // 로딩 중일 때 Spinner 표시
          <div className="text-align-center empty-bag">
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          </div>
        ) : productList.length > 0 ? (
          productList.map((item) => (
            <Col md={3} sm={12} key={item._id}>
              <ProductCard item={item} />
            </Col>
          ))
        ) : (
          <div className="text-align-center empty-bag">
            {name ? (
              <h2>{name}과 일치한 상품이 없습니다!</h2>
            ) : (
              <h2>등록된 상품이 없습니다!</h2>
            )}
          </div>
        )}
      </Row>
      <ReactPaginate
        nextLabel=">"
        onPageChange={handlePageClick}
        pageRangeDisplayed={5}
        pageCount={totalPageNum}
        forcePage={page - 1}
        previousLabel="<"
        renderOnZeroPageCount={null}
        pageClassName="page-item"
        pageLinkClassName="page-link"
        previousClassName="page-item"
        previousLinkClassName="page-link"
        nextClassName="page-item"
        nextLinkClassName="page-link"
        breakLabel="..."
        breakClassName="page-item"
        breakLinkClassName="page-link"
        containerClassName="pagination"
        activeClassName="active"
        className="display-center list-style-none"
      />
    </Container>
  );
};

export default LandingPage;
