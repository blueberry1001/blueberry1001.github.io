export type ReleaseNote = { version: string; date: string; updates: string[] };

export default function ReleaseNotes({ notes }: { notes: ReleaseNote[] }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
      <h2 className="mb-4 text-2xl font-bold text-slate-900">更新履歴</h2>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] border-collapse">
          <thead>
            <tr className="border-b border-slate-200 text-left text-sm text-slate-600">
              <th className="px-3 py-2 font-semibold" scope="col">
                バージョン
              </th>
              <th className="px-3 py-2 font-semibold" scope="col">
                日付
              </th>
              <th className="px-3 py-2 font-semibold" scope="col">
                更新内容
              </th>
            </tr>
          </thead>
          <tbody>
            {notes.map((note) => (
              <tr
                className="border-b border-slate-100 align-top"
                key={note.version}
              >
                <th
                  className="px-3 py-3 text-left text-sm font-semibold text-slate-900"
                  scope="row"
                >
                  {note.version}
                </th>
                <td className="px-3 py-3 text-sm text-slate-600">
                  {note.date}
                </td>
                <td className="px-3 py-3">
                  <ul className="list-disc space-y-1 pl-5 text-sm text-slate-700">
                    {note.updates.map((update) => (
                      <li key={update}>{update}</li>
                    ))}
                  </ul>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
