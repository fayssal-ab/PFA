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
		<div className="bg-[#1a1a2e] rounded-2xl border border-white/5 overflow-hidden">
			<div className="px-5 py-4 border-b border-white/5 flex items-center gap-2.5">
				<div className="w-8 h-8 rounded-xl bg-violet-500/15 flex items-center justify-center">
					<FileText size={15} className="text-violet-400" />
				</div>
				<div>
					<h2 className="text-sm font-bold text-white">
						Pièces jointes client
					</h2>
					<p className="text-[11px] text-gray-600">
						{clientFiles.length} fichier{clientFiles.length !== 1 ? "s" : ""}
					</p>
				</div>
			</div>

			<div className="p-4 space-y-2">
				{clientFiles.length === 0 ? (
					<div className="flex flex-col items-center justify-center py-10 text-center">
						<div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-3">
							<Paperclip size={20} className="text-gray-600" />
						</div>
						<p className="text-sm text-gray-600">Aucun fichier joint</p>
					</div>
				) : (
					clientFiles.map((f) => (
						<div
							key={f.id}
							className="flex items-center justify-between bg-white/[0.03] hover:bg-white/[0.06] border border-white/5 hover:border-violet-500/20 rounded-xl px-3 py-2.5 transition-all group"
						>
							<div className="flex items-center gap-3 min-w-0">
								<div className="w-8 h-8 rounded-lg bg-violet-500/15 flex items-center justify-center shrink-0">
									<Paperclip size={13} className="text-violet-400" />
								</div>
								<p className="text-sm text-gray-300 truncate font-medium">
									{f.fichier}
								</p>
							</div>
							<button
								onClick={() => downloadFile(f.fichier)}
								title="Télécharger"
								className="w-8 h-8 rounded-lg bg-white/5 hover:bg-violet-500/20 text-gray-500 hover:text-violet-300 flex items-center justify-center transition-all shrink-0 ml-2"
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
						className="w-8 h-8 rounded-lg bg-white/5 border border-white/5 text-gray-400 hover:bg-white/10 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all flex items-center justify-center"
					>
						<ChevronLeft size={14} />
					</button>
					<span className="text-xs text-gray-500 font-medium px-2">
						{page + 1} / {Math.max(totalPages, 1)}
					</span>
					<button
						disabled={page + 1 >= totalPages}
						onClick={() => onPageChange(page + 1)}
						className="w-8 h-8 rounded-lg bg-white/5 border border-white/5 text-gray-400 hover:bg-white/10 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all flex items-center justify-center"
					>
						<ChevronRight size={14} />
					</button>
				</div>
			)}
		</div>
	);
}
