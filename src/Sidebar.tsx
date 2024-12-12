import { Link, useLocation } from "react-router-dom";
import "./Sidebar.css";

const Sidebar = () => {
  const location = useLocation();
  const menu: { title: string; path: string }[] = [
    { title: "Home", path: "/" },
    { title: "Prime", path: "/prime" },
  ];
  return (
    <div className="sidebar">
      <div>サイドバー</div>
      <ul>
        {menu.map((item) => (
          <li
            key={item.title}
            className={`${location.pathname === item.path ? "active" : ""} ${location.pathname.startsWith(item.path) ? 'partially-active' : ''}`} // 部分一致対応
          >
            <Link to={item.path} className="links">
              {item.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;