import { useMediaQuery } from 'react-responsive';
import {  useState } from "react";

export default function SearchPagination() {
  // Responsive to mobile or dekstop
  const isTabletOrMobile = useMediaQuery({ query: '(max-width: 780px)'})

  const [limit, setLimit] = useState(10);
  const [query, setQuery] = useState("");

  return (
    <div className="search-pagination" >
        {isTabletOrMobile ? 
                  // HP
                  <div className="row d-flex">
                    <div className="col-4 mt-1">
                       <select
                        className="form-select"
                        aria-label="Default select example"
                        style={{ textAlign: "", cursor: "pointer", height: "35px", width: "70px",fontSize:"14px" }}
                        onChange={(e) => setLimit(e.target.value)}
                        value={limit}
                      >
                        <option style={{fontSize:"14px"}} value={10}>10</option>
                        <option style={{fontSize:"14px"}} value={25}>25</option>
                        <option style={{fontSize:"14px"}} value={50}>50</option>
                        <option style={{fontSize:"14px"}} value={100}>100</option>
                      </select>
                    </div>
                    <div className="col-5 p-2 ml-auto">
                      <form onSubmit={e => e.preventDefault()}   >
                        <input style={{width: "130px", fontSize:"14px", border: "1px solid #cfcfcfff"}}
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            type="text"
                            placeholder="Search"/>
                      </form>
                    </div>
                  </div> 
                    :
                  // DESKTOP
                  <div style={{ display: "flex" }} >
                    <div className="line-show" >
                      <div>
                        Show 
                      </div>
                      &nbsp;
                      <div>
                      <select 
                        className="form-select"
                        aria-label="Default select example"
                        style={{ textAlign: "", cursor: "pointer", height: "35px" }}
                        onChange={(e) => setLimit(e.target.value)}
                        value={limit}
                      >
                        <option value={10}>10</option>
                        <option value={25}>25</option>
                        <option value={50}>50</option>
                        <option value={100}>100</option>
                      </select>
                      </div>
                      &nbsp;
                      <div>
                        Entries
                      </div>
                    </div>
                    <div className="line-search" >
                    <form onSubmit={e => e.preventDefault()} style={{ display: "flex", paddingRight: "0px", borderRadius: "5px" }}>
                      <div style={{ marginRight: "5px", borderRadius: "5px" }}>
                        <input 
                          value={query}
                          onChange={(e) => setQuery(e.target.value)}
                          className="focused"
                          style={{ backgroundColor: "white", border: "3px solid #C6C6C6", height: "100%", paddingLeft: "5px", borderRadius: "5px" }}
                          type="text"
                          placeholder="Search"
                        />
                      </div>
                    </form>
                    </div>
                  </div> 
                }
    </div>
  );
}
