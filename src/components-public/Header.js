import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../assets/css/style.css";
import Logo from "../assets/logo.png"

export default function Header() {
  const [units, setUnits] = useState([]);
  const [schools, setSchools] = useState([]);

  // ===== DUMMY API =====
  const fetchUnits = () =>
    Promise.resolve([
      { id: 1, name: "TK Islam" },
      { id: 2, name: "SD Islam" },
      { id: 3, name: "SMP Islam" },
    ]);

  const fetchSchools = () =>
    Promise.resolve([
      { id: 1, name: "Al Azhar Summarecon" },
      { id: 2, name: "Al Azhar Syifa Budi" },
    ]);

  useEffect(() => {
    fetchUnits().then(setUnits);
    fetchSchools().then(setSchools);
  }, []);

  return (
    <header>
      <nav className="navbar navbar-expand-lg fixed-top" id="navbar">
        <div className="container">
          {/* LOGO */}
          <Link to="/" className="navbar-brand">
            {/* <img
              src="/assets/images/alazhar/logo-01.png"
              alt="Logo Al Azhar"
            /> */}
            <img src={Logo}  alt="Logo Al Azhar Summarecon" />
          </Link>

          {/* TOGGLER */}
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          {/* MENU */}
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav mx-auto quick-links">
              <li className="nav-item testtt">
                <Link to="/" className="nav-link">
                  Beranda
                </Link>
              </li>

              {/* DROPDOWN UNIT */}
              <li className="nav-item dropdown">
                <span
                  className="nav-link dropdown-toggle"
                  role="button"
                  data-bs-toggle="dropdown"
                >
                  Kampus
                </span>
                <ul className="dropdown-menu">
                  {units.map((unit) => (
                    <li key={unit.id}>
                      <Link
                        to={`/unit/${unit.id}`}
                        className="dropdown-item"
                      >
                        {unit.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>

              <li className="nav-item testtt">
                <Link to="/" className="nav-link">
                  Tentang Kami
                </Link>
              </li>

            <li className="nav-item testtt">
                <Link to="/" className="nav-link">
                 Program
                </Link>
            </li>


              <li className="nav-item">
                <Link to="/kontak" className="nav-link">
                  Kontak
                </Link>
              </li>
            </ul>

            {/* BUTTON */}
            <div className="btn-header btn-pmb testtt">
              <button className="btn btn-warning">
                <Link to="/pmb">Pendaftaran</Link>
              </button>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
