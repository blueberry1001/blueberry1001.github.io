import { Link } from "react-router-dom";

function ProductsPage() {
  return (
    <div>
      <h1>Products</h1>
      <ul>
        <li>
          <Link to="/prime">素因数分解</Link>
        </li>
        <li>
          <Link to="/public_ethics">共通テスト対策【公共・倫理】</Link>
        </li>
        <li>
          <Link to="/randompicker">ランダムピッカー</Link>
        </li>
        <li>
          <Link to="/invincibletank">InvincibleTank</Link>
        </li>
        <li>
          <Link to="/chemistry_ion">イオン化傾向</Link>
        </li>
        <li>
          <Link to="/timer">過去問タイマー(共テ用)</Link>
        </li>
      </ul>
    </div>
  );
}
export default ProductsPage;
