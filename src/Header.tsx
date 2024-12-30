import "./Header.css";
const Header = () => {
  return (
    <header className="header">
      <div className="header-inner">
        <a className="logo-link">
          <a href="/#/">
            <div className="site-title">Blueberry1001</div>
          </a>
          <a href="/#/">
            <div className="page-link">
              <div>Home</div>
            </div>
          </a>
          <a href="/#/prime">
            <div className="page-link">
              <div>Products</div>
            </div>
          </a>
          <a href="/#/links">
            <div className="page-link">
              <div>Links</div>
            </div>
          </a>
        </a>
      </div>
    </header>
  );
};

export default Header;
