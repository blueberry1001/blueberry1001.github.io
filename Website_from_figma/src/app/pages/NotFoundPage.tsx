import { useNavigate } from "react-router";
import { Home } from "lucide-react";

export function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen pt-20 flex items-center justify-center bg-slate-50">
      <div className="text-center px-6">
        <div className="mb-8">
          <h1 className="text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500 mb-4">
            404
          </h1>
          <h2 className="text-3xl font-bold text-slate-900 mb-4">
            ページが見つかりません
          </h2>
          <p className="text-lg text-slate-600 mb-8">
            お探しのページは存在しないか、移動した可能性があります。
          </p>
        </div>
        
        <button
          onClick={() => navigate("/")}
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 hover:scale-105 hover:shadow-lg"
        >
          <Home size={20} />
          <span>ホームに戻る</span>
        </button>
      </div>
    </div>
  );
}
