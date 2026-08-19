import React, { useEffect, useState, useCallback, useMemo } from "react";
import api from "../../api/axios";
import type { Supplier, SupplierStatus } from "../../types";
import { DataTable, type Column } from "../ui/DataTable";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { SupplierRejectModal } from "./SupplierRejectModal";

const FILTERS = ["PENDING_QUEUE", "ALL", "APPROVED", "REJECTED"] as const;

const FILTER_LABELS: Record<(typeof FILTERS)[number], string> = {
  PENDING_QUEUE: "Action Queue (Pending & Draft)",
  ALL: "All Applications",
  APPROVED: "Approved",
  REJECTED: "Rejected",
};

export const ApproverDashboard: React.FC = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filterStatus, setFilterStatus] = useState<(typeof FILTERS)[number]>("PENDING_QUEUE");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [rejectingSupplier, setRejectingSupplier] = useState<Supplier | null>(null);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  // 1. Fetch All Suppliers from Server
  const fetchSuppliers = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get("suppliers/getSupplires");
      setSuppliers(res.data.data || []);
    } catch (err: any) {
      console.error("Failed to load queue:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSuppliers();
  }, [fetchSuppliers]);

  // 2. Handle Approval Action
  const handleApprove = async (supplier: Supplier) => {
    const isDraft = supplier.status === "DRAFT";
    const promptMsg = isDraft
      ? `Authorize and approve DRAFT supplier "${supplier.companyName}" (${supplier.vatId})?`
      : `Authorize approval for "${supplier.companyName}" (${supplier.vatId})?`;

    if (!window.confirm(promptMsg)) return;

    try {
      setActionLoadingId(supplier.id);
      await api.post("/approver/approval", { supplierId: supplier.id });
      await fetchSuppliers();
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to approve supplier.");
    } finally {
      setActionLoadingId(null);
    }
  };

  // 3. Computed Metrics
  const stats = useMemo(() => {
    const drafts = suppliers.filter((s) => s.status === "DRAFT").length;
    const pendingApproval = suppliers.filter((s) => s.status === "PENDING_APPROVAL").length;
    return {
      total: suppliers.length,
      actionQueue: drafts + pendingApproval,
      drafts,
      pendingApproval,
      approved: suppliers.filter((s) => s.status === "APPROVED").length,
      rejected: suppliers.filter((s) => s.status === "REJECTED").length,
    };
  }, [suppliers]);

  // 4. Filtering and Real-time Search
  const filteredSuppliers = useMemo(() => {
    return suppliers.filter((s) => {
      let matchesStatus = true;
      if (filterStatus === "PENDING_QUEUE") {
        matchesStatus = s.status === "PENDING_APPROVAL" || s.status === "DRAFT";
      } else if (filterStatus !== "ALL") {
        matchesStatus = s.status === filterStatus;
      }

      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        s.companyName.toLowerCase().includes(q) ||
        s.vatId.toLowerCase().includes(q) ||
        s.contactEmail.toLowerCase().includes(q) ||
        (s.createdBy?.name && s.createdBy.name.toLowerCase().includes(q));

      return matchesStatus && matchesSearch;
    });
  }, [suppliers, filterStatus, searchQuery]);

  // 5. Table Columns Definition
  const columns: Column<Supplier>[] = [
    {
      header: "Company Details",
      cell: (row) => (
        <div className="space-y-0.5">
          <p className="font-medium text-slate-900">{row.companyName}</p>
          <div className="flex items-center gap-2 font-mono text-xs text-slate-500">
            <span>{row.vatId}</span>
            <span>·</span>
            <span className="font-sans">{row.contactEmail}</span>
          </div>
        </div>
      ),
    },
    {
      header: "Country",
      cell: (row) => (
        <span className="text-xs text-slate-600">
          {row.country.replace(/_/g, " ")}
        </span>
      ),
    },
    {
      header: "Requester",
      cell: (row) => (
        <div className="space-y-0.5">
          <p className="text-xs font-medium text-slate-800">{row.createdBy?.name || "System"}</p>
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
          <div className="max-w-xs text-xs text-slate-600">
            <span className="font-medium text-slate-900">Reason: </span>
            {row.rejectionReason}
          </div>
        ) : row.status === "APPROVED" ? (
          <span className="text-xs text-slate-500">
            Approved by {row.approvedBy?.name || "Approver"}
          </span>
        ) : (
          <span className="text-xs text-slate-400">
            {row.status === "DRAFT" ? "Draft submission" : "Awaiting decision"}
          </span>
        ),
    },
    {
      header: "Actions",
      className: "text-right",
      cell: (row) => {
        const canDecide = row.status === "PENDING_APPROVAL" || row.status === "DRAFT";
        const isActionLoading = actionLoadingId === row.id;

        if (canDecide) {
          return (
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setRejectingSupplier(row)}
                disabled={isActionLoading}
              >
                Reject
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => handleApprove(row)}
                disabled={isActionLoading}
              >
                {isActionLoading ? "Approving…" : "Approve"}
              </Button>
            </div>
          );
        }

        if (row.status === "REJECTED") {
          return (
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleApprove(row)}
              disabled={isActionLoading}
            >
              Re-Approve
            </Button>
          );
        }

        return <span className="select-none text-xs text-slate-400">Complete</span>;
      },
    },
  ];

  return (
    <div className="space-y-6">
      {/* 1. Header Section */}
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-lg font-semibold text-slate-900">Supplier Verification Queue</h1>
          <p className="text-xs text-slate-500">Audit, approve, or reject draft and pending onboarding applications.</p>
        </div>
      </div>

      {/* 2. Metric Overview Cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Action Queue</p>
          <p className="mt-1 text-2xl font-semibold text-slate-900">{stats.actionQueue}</p>
          <p className="mt-0.5 text-[11px] text-slate-400">
            {stats.pendingApproval} pending, {stats.drafts} drafts
          </p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Approved</p>
          <p className="mt-1 text-2xl font-semibold text-slate-900">{stats.approved}</p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Rejected</p>
          <p className="mt-1 text-2xl font-semibold text-slate-900">{stats.rejected}</p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Total Submissions</p>
          <p className="mt-1 text-2xl font-semibold text-slate-900">{stats.total}</p>
        </div>
      </div>

      {/* 3. Filter Toolbar & Search */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-50/50 p-1">
          {FILTERS.map((status) => {
            const active = filterStatus === status;
            return (
              <button
                key={status}
                type="button"
                onClick={() => setFilterStatus(status)}
                className={`cursor-pointer rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                  active
                    ? "bg-white text-slate-900 shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {FILTER_LABELS[status]}
              </button>
            );
          })}
        </div>

        <div className="relative w-full sm:w-72">
          <input
            type="text"
            className="w-full rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:outline-none"
            placeholder="Search company, VAT, requester..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* 4. Dynamic Data Table */}
      <DataTable
        columns={columns}
        data={filteredSuppliers}
        isLoading={loading}
        keyExtractor={(row) => row.id}
        emptyMessage="No suppliers match the active queue filter."
      />

      {/* 5. Reject Modal */}
      <SupplierRejectModal
        supplier={rejectingSupplier}
        isOpen={Boolean(rejectingSupplier)}
        onClose={() => setRejectingSupplier(null)}
        onSuccess={fetchSuppliers}
      />
    </div>
  );
};

export default ApproverDashboard;