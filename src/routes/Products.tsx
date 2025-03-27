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
          <Link to="/randompicker">ランダムピッカー</Link>
        </li>
        <li>
          <Link to="/invincibletank">InvincibleTank</Link>
        </li>
      </ul>
    </div>
  );
}
export default ProductsPage;
