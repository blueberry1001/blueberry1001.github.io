import "./Header.css";
const Header = () => {
  return (
    <header className="header">
      <div className="header-inner">
        <div className="logo-link">
          <a href="/#/">
            <div className="site-title">Blueberry1001</div>
          </a>
          <a href="/#/">
            <div className="page-link">
              <div>Home</div>
            </div>
          </a>
          <a href="/#/products">
            <div className="page-link">
              <div>Products</div>
            </div>
          </a>
          <a href="/#/links">
            <div className="page-link">
              <div>Links</div>
            </div>
          </a>
        </div>
      </div>
    </header>
  );
};

export default Header;
