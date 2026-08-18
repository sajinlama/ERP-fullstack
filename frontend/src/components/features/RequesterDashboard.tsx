import React, { useEffect, useState, useCallback, useMemo } from "react";
import api from "../../api/axios";
import type{ Supplier } from "../../types";
import { StatsCard } from "../ui/StatsCard";
import  { DataTable,type Column } from "../ui/DataTable";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { SupplierFormModal } from "./SupplierFormModal";

export const RequesterDashboard: React.FC = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);

  const fetchMySuppliers = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get("/suppliers/my-suppliers");
      setSuppliers(res.data.data || []);
    } catch (err) {
      console.error("Failed to load user suppliers", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMySuppliers();
  }, [fetchMySuppliers]);

  const stats = useMemo(() => {
    return {
      total: suppliers.length,
      pending: suppliers.filter((s) => s.status === "PENDING_APPROVAL").length,
      approved: suppliers.filter((s) => s.status === "APPROVED").length,
      rejected: suppliers.filter((s) => s.status === "REJECTED").length,
    };
  }, [suppliers]);

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
      header: "Contact Email",
      accessorKey: "contactEmail",
      className: "text-slate-600",
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
        ) : (
          <span className="text-slate-400 text-xs">—</span>
        ),
    },
    {
      header: "Actions",
      className: "text-right",
      cell: (row) =>
        row.status !== "APPROVED" ? (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setEditingSupplier(row);
              setIsModalOpen(true);
            }}
          >
            Edit
          </Button>
        ) : (
          <span className="text-xs text-slate-400">Locked</span>
        ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Metric Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Submitted"
          value={stats.total}
          icon={
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          }
        />
        <StatsCard
          title="Pending Approval"
          value={stats.pending}
          variant="amber"
          icon={
            <svg className="h-5 w-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
        <StatsCard
          title="Approved Entities"
          value={stats.approved}
          variant="emerald"
          icon={
            <svg className="h-5 w-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
        <StatsCard
          title="Action Needed"
          value={stats.rejected}
          variant="rose"
          icon={
            <svg className="h-5 w-5 text-rose-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          }
        />
      </div>

      {/* Action Header */}
      <div className="flex items-center justify-between bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs">
        <div>
          <h2 className="text-base font-bold text-slate-900">My Supplier Applications</h2>
          <p className="text-xs text-slate-500 mt-0.5">Track live verification workflow status and revision notes.</p>
        </div>
        <Button
          variant="primary"
          onClick={() => {
            setEditingSupplier(null);
            setIsModalOpen(true);
          }}
          leftIcon={
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
          }
        >
          New Application
        </Button>
      </div>

      {/* Table Component */}
      <DataTable
        columns={columns}
        data={suppliers}
        isLoading={loading}
        keyExtractor={(row) => row.id}
        emptyMessage="No supplier applications registered yet. Click 'New Application' to begin."
      />

      {/* Form Drawer / Modal */}
      <SupplierFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchMySuppliers}
        editingSupplier={editingSupplier}
      />
    </div>
  );
};