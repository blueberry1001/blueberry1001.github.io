import { Link } from "react-router-dom";
import "./Sidebar.css";
const Sidebar = () => {
  const menu: { title: string; path: string }[] = [
    { title: "Home", path: "/" },
    { title: "Prime", path: "/prime" },
  ];
  return (
    <div className="sidebar">
      <div>俺がサイドバーだよ</div>
      <div>
        <ul>
          {menu.map((item) => (
            <li key={item.title}>
              <Link to={item.path} className="links">
                {item.title}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
