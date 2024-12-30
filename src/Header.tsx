import "./Header.css";
const Header = () => {
  return (
    <header className="header">
      <div className="header-inner">
        <div className="logo-area">
          <a className="logo-link" href="/">
            <img alt="サイトロゴ" className="logo-image" src="./icon.png" />
            <span className="site-title">Blueberry1001</span>
          </a>
        </div>
      </div>
    </header>
  );
};

export default Header;
