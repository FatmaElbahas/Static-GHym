import React from "react";
import ReactPaginate from "react-paginate";
import "./App.css";

export default function Paginate({ pageCount, onPageChange, forcePage }) {
  return (
    <ReactPaginate
      pageCount={pageCount}
      onPageChange={(selected) => onPageChange(selected.selected + 1)} // يرجع index صفر فبنزوده 1
      forcePage={forcePage ? forcePage - 1 : undefined}
      marginPagesDisplayed={1}
      pageRangeDisplayed={3}
      previousLabel={"Prev"}
      nextLabel={"Next"}
      breakLabel={"..."}
      containerClassName={"pagination"}
      pageClassName={"page-item"}
      pageLinkClassName={"page-link"}
      previousClassName={"prev"}
      nextClassName={"next"}
      activeClassName={"active"}
      disabledClassName={"disabled"}
    />
  );
}