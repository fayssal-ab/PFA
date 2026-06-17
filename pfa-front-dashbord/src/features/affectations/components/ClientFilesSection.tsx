import {
	FileText,
	Paperclip,
	Download,
	ChevronLeft,
	ChevronRight,
} from "lucide-react";
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
		<div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
			<div className="px-4 py-3 border-b border-slate-200 flex items-center gap-2.5">
				<div className="w-8 h-8 rounded-md bg-teal-50 flex items-center justify-center">
					<FileText size={15} className="text-teal-600" />
				</div>
				<div>
					<h2 className="text-sm font-bold text-slate-900">
						Pièces jointes client
					</h2>
					<p className="text-[11px] text-slate-500">
						{clientFiles.length} fichier{clientFiles.length !== 1 ? "s" : ""}
					</p>
				</div>
			</div>

			<div className="p-4 space-y-2">
				{clientFiles.length === 0 ? (
					<div className="flex flex-col items-center justify-center py-10 text-center">
						<div className="w-12 h-12 rounded-lg bg-slate-50 flex items-center justify-center mb-3">
							<Paperclip size={20} className="text-slate-400" />
						</div>
						<p className="text-sm text-slate-500">Aucun fichier joint</p>
					</div>
				) : (
					clientFiles.map((f) => (
						<div
							key={f.id}
							className="flex items-center justify-between bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg px-3 py-2.5 transition-all group"
						>
							<div className="flex items-center gap-3 min-w-0">
								<div className="w-8 h-8 rounded-md bg-teal-50 flex items-center justify-center shrink-0">
									<Paperclip size={13} className="text-teal-600" />
								</div>
								<p className="text-sm text-slate-700 truncate font-medium">
									{f.fichier}
								</p>
							</div>
							<button
								onClick={() => downloadFile(f.fichier)}
								title="Télécharger"
								className="w-8 h-8 rounded-md bg-white hover:bg-teal-50 text-slate-400 hover:text-teal-600 flex items-center justify-center transition-all shrink-0 ml-2 border border-slate-200"
							>
								<Download size={14} />
							</button>
						</div>
					))
				)}
			</div>

			{totalPages > 1 && (
				<div className="px-4 pb-4 flex items-center justify-center gap-2">
					<button
						disabled={page === 0}
						onClick={() => onPageChange(page - 1)}
						className="w-8 h-8 rounded-md bg-white border border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all flex items-center justify-center"
					>
						<ChevronLeft size={14} />
					</button>
					<span className="text-xs text-slate-500 font-medium px-2">
						{page + 1} / {Math.max(totalPages, 1)}
					</span>
					<button
						disabled={page + 1 >= totalPages}
						onClick={() => onPageChange(page + 1)}
						className="w-8 h-8 rounded-md bg-white border border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all flex items-center justify-center"
					>
						<ChevronRight size={14} />
					</button>
				</div>
			)}
		</div>
	);
}
