import { useState } from "react";
import { FaFilter } from "react-icons/fa";

const StatusFilter = ({
  statuses,
  selectedStatus,
  setSelectedStatus,
}: {
  statuses: string[];
  selectedStatus: string;
  setSelectedStatus: (status: any) => void;
}) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center justify-center w-10 h-10 border-2 border-[#232730]  bg-[#1b1e26] rounded hover:border-[#5ecde3] transition cursor-pointer"
      >
        <FaFilter className="text-[#8fa0b3]" />
      </button>

      {open && (
        <div className="absolute mt-3 p-4 bg-[#0f1117] border border-[#232730] rounded-lg shadow-lg z-50 min-w-[280px]">
          <p
            className="text-xs font-bold text-[#8fa0b3] uppercase mb-3"
            style={{ fontFamily: "'Press Start 2P', cursive" }}
          >
            Filter by Status
          </p>

          <div className="flex flex-wrap gap-2">
            {statuses.map((status) => (
              <button
                key={status}
                onClick={() => {
                  setSelectedStatus(status);
                  setOpen(false);
                }}
                className={`px-3 py-2 text-sm font-bold rounded transition-all ${
                  selectedStatus === status
                    ? "text-[#000] bg-[#98dc48] border border-[#98dc48]"
                    : "text-[#8fa0b3] bg-[#1b1e26] border border-[#232730] hover:border-[#5ecde3]"
                }`}
                style={{
                  fontFamily: "'Press Start 2P', cursive",
                }}
              >
                {status === "ALL" ? "ALL" : status.replace(/_/g, " ")}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default StatusFilter;