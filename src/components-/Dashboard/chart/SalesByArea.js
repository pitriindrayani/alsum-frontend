// ** Reactstrap Imports
import { Card, CardHeader, CardTitle, CardBody, CardSubtitle } from 'reactstrap'
import { useState,useEffect, Fragment } from 'react';
import axios from 'axios'
import {FaUser, FaGenderless, FaMailBulk, FaTransgender, FaPhone, FaAddressBook, FaAddressCard, FaEdit, FaTrash} from 'react-icons/fa'
import { Row, Col } from 'react-bootstrap';
import ReactPaginate from "react-paginate";
import DeleteData from './DeleteData';
import { useQuery, useMutation } from 'react-query';
import { useNavigate } from 'react-router-dom';
import { API } from '../../../config/api';
import ShowMoreText from 'react-show-more-text';
import { setAuthToken } from '../../../config/api';

if (localStorage.token) {
  setAuthToken(localStorage.token);
}

const ProopsHome = ({year, month}) => {
  const [users, setUsers] = useState([]);
  const [pagination,setPagination] = useState([])
  const [page, setPage] = useState(0);
  const navigate = useNavigate()
  const [limit, setLimit] = useState(10);
  const [pages, setPages] = useState();
  const [ascending, setAscending] = useState(0);
  const [rows, setRows] = useState(1);
  const [keyword, setKeyword] = useState("");
  const [query, setQuery] = useState("");
  const [msg, setMsg] = useState("");
  const token = localStorage.getItem("token");
  const [idDelete, setIdDelete] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [dataMap, setDataMap] = useState("");
  const [dataSearch, setDataSearch] = useState("");
  const levelData = useNavigate(SVGFEComponentTransferElement)

    let fetchParams = {
      headers : {"Authorization" : `${token}`,"Content-Type" : "application/json"}
    };

  const getDataUsers = async () => {
    const response = await API.post(`/api/dashboard-main/sales-month`,
    {
      year: `${year}`,
      month: month,
      page: `${page}`,
      limit: `${limit}`,
      ascending: `${ascending}`,
      search:`${keyword}`
    },fetchParams)

    setUsers(response.data.data.Authorization)
    setUsers(response.data.data)
    setPage(response.data.pagination.current_page);
    setPages(response.data.pagination.total_pages);
    setRows(response.data.pagination.total);
  }

  useEffect(() => {
    getDataUsers()
  }, [year,month,page])
 
  const changePage = ({ selected }) => {
    setPage(selected+1);
    if (selected === 10) {
      setMsg(
        "Silahkan search data"
      );
    } else {
      setMsg("");
    }
  };
 
  const searchData = (e) => {
    e.preventDefault();
    setPage(0);
    setMsg("");
    setKeyword(query);
  };

  const handleUpdate = (id) => {
    navigate('/user-update/' + id);
  };

  const handleDelete = (id) => {
    setIdDelete(id);
    handleShow();
  };

  const deleteById = useMutation(async (id) => {
    try {
      await axios.delete(`/project/${id}`);
      getDataUsers()
    
    } catch (error) {
      console.log(error);
    }
  });

  return (
  <>
    <DeleteData setConfirmDelete={setConfirmDelete} show={show} handleClose={handleClose}/>
    <Card style={{ boxShadow:"2px 2px 10px #BFBFBF"}}>
    <CardHeader className='d-flex justify-content-between align-items-sm-center align-items-start flex-sm-row flex-column'>
        <CardTitle tag='p'>Penjualan Sales By Area Tahun {year}</CardTitle>
      </CardHeader>  
      <CardBody style={{height:"450px"}}>
          <Fragment>
            <Row >
              <Col xl='12' sm='12'>
                <div className="container">
                  <div className="columns">
                    <div className="column is-centered">
                      <form onSubmit={searchData}>
                        <div className="field has-addons">
                          <div className="control is-expanded">
                            <input
                              type="text"
                              className="input"
                              value={query}
                              onChange={(e) => setQuery(e.target.value)}
                              placeholder="Find something here..."
                            />
                          </div>
                          <div className="control">
                            <button type="submit" className="button is-info">
                              Search
                            </button>
                          </div>
                        </div>
                      </form>
                      <table className="table is-striped is-bordered  mt-2">
                        <thead>
                          <tr>
                            <th style={{textAlign:"center", fontSize:"10px", backgroundColor:"#99ccff"}}>No</th>
                            <th style={{textAlign:"center",fontSize:"10px",backgroundColor:"#99ccff"}}>Customer</th>
                            <th style={{textAlign:"center",fontSize:"10px",backgroundColor:"#99ccff"}}>Total</th>  
                          </tr>
                        </thead>
                        <tbody>
                          {users.map((user,index) => (
                            <tr key={index}>
                              <td style={{textAlign:"center",fontSize:"9px"}}>{page === 1 ? index + 1 : page === 2 ? (index + 1) + 10 : (index + 1) + ( page * 10 )}</td>
                              <td style={{textAlign:"center",fontSize:"9px"}}>
                                <ShowMoreText
                                  lines={1}
                                  more="show"
                                  less="hide"
                                  className="content-css"
                                  anchorClass="my-anchor-css-class text-primary"
                                  expanded={false}
                                  width={180}>
                                    {user.customer}
                                </ShowMoreText></td>
                              <td style={{textAlign:"center",fontSize:"9px"}}>{user.total}</td>
                                                         
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      <p style={{fontSize:"10px", marginBottom:"10px"}}>
                        Total Rows: {rows}, Page: {rows ? page : 0} of {pages}
                      </p>
                      
                      <p className="has-text-centered has-text-danger">{msg}</p>
                      <nav 
                        style={{fontSize:"10px"}}
                        className="pagination is-centered"
                        key={rows}
                        role="navigation"
                        aria-label="pagination"
                        >
                        <ReactPaginate
                          previousLabel={"< Prev"}
                          nextLabel={"Next >"}
                          pageCount={Math.min(10, pages)}
                          onPageChange={changePage}
                          containerClassName={"pagination-list"}
                          pageLinkClassName={"pagination-link"}
                          previousLinkClassName={"pagination-previous"}
                          nextLinkClassName={"pagination-next"}
                          activeLinkClassName={"pagination-link is-current"}
                          disabledLinkClassName={"pagination-link is-disabled"}
                        />
                      </nav>
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
          </Fragment>
      </CardBody>
    </Card>
    </>
  )
}

export default ProopsHome;
