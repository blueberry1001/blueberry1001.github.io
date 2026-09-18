# Google Analytics

測定ID: `G-6NFBCLHFK6`。`src/components/Analytics.tsx`で管理します。

- productionビルドかつblueberry1001.github.ioでのみ有効。ローカルのdev/previewではタグも読み込みません。
- HashRouterの初回表示・pathname変更・戻る/進むをpage_viewとして送信します。
- /の/homeへのリダイレクトと、同一パスの再レンダリングは重複計測しません。
- フィルターなどハッシュ内のクエリ変更はページビューに含めません。
- レポートでページを区別できるよう、/#/worksを仮想URL /worksとして送信します。実際のサイトURLは変更しません。
- 外側のクエリはUTMなど流入情報のため保持します。個人情報をURLに含めないでください。
- send_page_view:falseで初期自動送信を止めます。

## GA管理画面で必要な設定

管理 → データストリーム → 対象のウェブストリーム → 拡張計測機能の歯車 → ページビューの詳細設定 →「ブラウザの履歴イベントに基づくページの変更」をオフにして保存します。
これをオンにしたままだと、手動送信とは別に自動のページビューが送られ、重複する可能性があります。

公開後はリアルタイムで確認します。管理画面へのアクセス権がないため、サイトのデプロイだけではGA側の受信確認や上記設定変更は完了しません。

公式仕様: https://developers.google.com/analytics/devguides/collection/ga4/views
