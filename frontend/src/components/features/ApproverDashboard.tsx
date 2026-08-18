import React, { useEffect, useState, useCallback, useMemo } from "react";
import api from "../../api/axios";
import type{ Supplier, SupplierStatus } from "../../types";
import { StatsCard } from "../ui/StatsCard";
import  { DataTable, type Column } from "../ui/DataTable";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { SupplierRejectModal } from "./SupplierRejectModal";

export const ApproverDashboard: React.FC = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<"ALL" | SupplierStatus>("PENDING_APPROVAL");
  const [searchQuery, setSearchQuery] = useState("");
  const [rejectingSupplier, setRejectingSupplier] = useState<Supplier | null>(null);

  const fetchSuppliers = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get("suppliers/getSupplires");
      setSuppliers(res.data.data || []);
    } catch (err) {
      console.error("Failed to load queue", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSuppliers();
  }, [fetchSuppliers]);

  const handleApprove = async (supplier: Supplier) => {
    if (!window.confirm(`Authorize approval for ${supplier.companyName} (${supplier.vatId})?`)) return;
    try {
      await api.post("/approver/approval", { supplierId: supplier.id });
      fetchSuppliers();
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to approve supplier");
    }
  };

  const stats = useMemo(() => {
    return {
      total: suppliers.length,
      pending: suppliers.filter((s) => s.status === "PENDING_APPROVAL").length,
      approved: suppliers.filter((s) => s.status === "APPROVED").length,
      rejected: suppliers.filter((s) => s.status === "REJECTED").length,
    };
  }, [suppliers]);

  const filteredSuppliers = useMemo(() => {
    return suppliers.filter((s) => {
      const matchesStatus = filterStatus === "ALL" || s.status === filterStatus;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        s.companyName.toLowerCase().includes(q) ||
        s.vatId.toLowerCase().includes(q) ||
        s.contactEmail.toLowerCase().includes(q);
      return matchesStatus && matchesSearch;
    });
  }, [suppliers, filterStatus, searchQuery]);

  const columns: Column<Supplier>[] = [
    {
      header: "Company Details",
      cell: (row) => (
        <div>
          <p className="font-semibold text-slate-900">{row.companyName}</p>
          <p className="text-xs text-slate-500 font-mono">{row.vatId}</p>
        </div>
      ),
    },
    {
      header: "Country",
      cell: (row) => <span className="text-slate-600">{row.country.replace(/_/g, " ")}</span>,
    },
    {
      header: "Requester",
      cell: (row) => (
        <div>
          <p className="text-xs font-semibold text-slate-900">{row.createdBy?.name || "System"}</p>
          <p className="text-[11px] text-slate-400">{row.createdBy?.email || "—"}</p>
        </div>
      ),
    },
    {
      header: "Status",
      cell: (row) => <Badge status={row.status} />,
    },
    {
      header: "Audit / Rejection Notes",
      cell: (row) =>
        row.rejectionReason ? (
          <div className="rounded-lg bg-rose-50 border border-rose-200/80 p-2 text-xs text-rose-700 max-w-xs">
            <strong className="block text-[10px] uppercase font-bold tracking-wider">Reason:</strong>
            {row.rejectionReason}
          </div>
        ) : row.status === "APPROVED" ? (
          <span className="text-xs text-emerald-700 font-medium">
            Approved by {row.approvedBy?.name || "Approver"}
          </span>
        ) : (
          <span className="text-slate-400 text-xs">Pending Decision</span>
        ),
    },
    {
      header: "Decision Action",
      className: "text-right",
      cell: (row) =>
        row.status === "PENDING_APPROVAL" ? (
          <div className="flex justify-end gap-1.5">
            <Button variant="secondary" size="sm" onClick={() => handleApprove(row)}>
              Approve
            </Button>
            <Button variant="destructive" size="sm" onClick={() => setRejectingSupplier(row)}>
              Reject
            </Button>
          </div>
        ) : (
          <span className="text-xs text-slate-400 select-none">Completed</span>
        ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Metric Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Action Queue"
          value={stats.pending}
          variant="amber"
          icon={
            <svg className="h-5 w-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
        <StatsCard
          title="Approved Today"
          value={stats.approved}
          variant="emerald"
          icon={
            <svg className="h-5 w-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
        <StatsCard
          title="Rejected Total"
          value={stats.rejected}
          variant="rose"
          icon={
            <svg className="h-5 w-5 text-rose-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
        <StatsCard
          title="Total Registry"
          value={stats.total}
          icon={
            <svg className="h-5 w-5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          }
        />
      </div>

      {/* Control Filter Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
        <div className="flex flex-wrap gap-1.5">
          {(["PENDING_APPROVAL", "ALL", "APPROVED", "REJECTED"] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                filterStatus === status
                  ? "bg-slate-900 text-white shadow-xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {status === "PENDING_APPROVAL"
                ? "Pending Queue"
                : status === "ALL"
                ? "All Requests"
                : status}
            </button>
          ))}
        </div>

        <div className="w-full sm:w-72">
          <Input
            placeholder="Search company, VAT, or requester..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={filteredSuppliers}
        isLoading={loading}
        keyExtractor={(row) => row.id}
        emptyMessage="No supplier applications match this verification queue filter."
      />

      {/* Reject Modal */}
      <SupplierRejectModal
        supplier={rejectingSupplier}
        isOpen={Boolean(rejectingSupplier)}
        onClose={() => setRejectingSupplier(null)}
        onSuccess={fetchSuppliers}
      />
    </div>
  );
};