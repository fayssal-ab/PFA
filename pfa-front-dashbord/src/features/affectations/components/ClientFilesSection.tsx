import { FileText, Paperclip, Download } from "lucide-react";

import { PieceJointe } from "../../../types";

type Props = {
	clientFiles: PieceJointe[];
	downloadFile: (filename?: string) => void;
	page: number;
	totalPages: number;
	onPageChange: (page: number) => void;
};
export default function ClientFilesSection({
	clientFiles,
	downloadFile,
	page,
	totalPages,
	onPageChange,
}: Props) {
	return (
		<div className="bg-[#111827]/80 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl p-6">
			<div className="flex items-center gap-2 mb-5">
				<FileText size={18} className="text-indigo-400" />

				<h2 className="text-lg font-bold text-white">Pièces jointes client</h2>
			</div>

			<div className="space-y-3">
				{clientFiles.length === 0 ? (
					<div className="text-sm text-gray-500">Aucun fichier</div>
				) : (
					clientFiles.map((f) => (
						<div
							key={f.id}
							className="flex items-center justify-between border border-white/10 bg-[#0f172a]/50 rounded-2xl px-4 py-3 hover:border-indigo-500/40 transition-all"
						>
							<div className="flex items-center gap-3">
								<div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center">
									<Paperclip size={16} className="text-indigo-300" />
								</div>

								<p className="text-sm font-semibold text-white">{f.fichier}</p>
							</div>

							<button
								onClick={() => downloadFile(f.fichier)}
								className="w-10 h-10 rounded-xl bg-[#1e293b] hover:bg-indigo-500/20 text-gray-300 hover:text-indigo-300 flex items-center justify-center transition-all"
							>
								<Download size={16} />
							</button>
						</div>
					))
				)}
			</div>
			<div className="flex items-center justify-center gap-4 mt-5">
				<button
					disabled={page === 0}
					onClick={() => onPageChange(page - 1)}
					className="px-4 py-2 rounded-xl bg-slate-700 text-white disabled:opacity-50"
				>
					Précédent
				</button>

				<span className="text-white font-medium">
					{page + 1} / {Math.max(totalPages, 1)}
				</span>

				<button
					disabled={page + 1 >= totalPages}
					onClick={() => onPageChange(page + 1)}
					className="px-4 py-2 rounded-xl bg-slate-700 text-white disabled:opacity-50"
				>
					Suivant
				</button>
			</div>
		</div>
	);
}
