import React from "react";
import { MdArrowBackIos, MdArrowForwardIos } from "react-icons/md";

const getPages = (current, total) => {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages = [1];
  if (current > 3) pages.push("...");
  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);
  for (let i = start; i <= end; i++) pages.push(i);
  if (current < total - 2) pages.push("...");
  pages.push(total);
  return pages;
};

const Pagination = ({ page, totalPages, onPageChange }) => {
  const pages = getPages(page, totalPages);

  return (
    <div className="flex items-center gap-1.5">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
        className={`w-9 h-9 flex items-center justify-center rounded-full transition-all duration-200 ${
          page <= 1 ? "cursor-not-allowed opacity-40" : "bg-blue-600 hover:bg-blue-500 text-white cursor-pointer"
        }`}
        style={page <= 1 ? { background: "var(--input-bg)", color: "var(--text-faint)" } : {}}
      >
        <MdArrowBackIos className="text-sm ml-1" />
      </button>

      {pages.map((p, i) =>
        p === "..." ? (
          <span key={`e-${i}`} className="w-9 h-9 flex items-center justify-center text-sm select-none"
            style={{ color: "var(--text-faint)" }}>
            ...
          </span>
        ) : (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            className="w-9 h-9 flex items-center justify-center rounded-full text-sm font-medium transition-all duration-200"
            style={
              p === page
                ? { background: "#2563eb", color: "#fff", boxShadow: "0 0 10px rgba(59,130,246,0.4)", cursor: "default" }
                : { background: "var(--input-bg)", color: "var(--text-muted)", cursor: "pointer", border: "1px solid var(--card-border)" }
            }
          >
            {p}
          </button>
        )
      )}

      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
        className={`w-9 h-9 flex items-center justify-center rounded-full transition-all duration-200 ${
          page >= totalPages ? "cursor-not-allowed opacity-40" : "bg-blue-600 hover:bg-blue-500 text-white cursor-pointer"
        }`}
        style={page >= totalPages ? { background: "var(--input-bg)", color: "var(--text-faint)" } : {}}
      >
        <MdArrowForwardIos className="text-sm" />
      </button>
    </div>
  );
};

export default Pagination;
