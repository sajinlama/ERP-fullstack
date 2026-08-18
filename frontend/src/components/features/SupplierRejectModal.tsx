import React, { useState } from "react";
import api from "../../api/axios";
import type { Supplier } from "../../types";
import { Modal } from "../ui/Modal";
import { Button } from "../ui/Button";

export interface SupplierRejectModalProps {
  supplier: Supplier | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const SupplierRejectModal: React.FC<SupplierRejectModalProps> = ({
  supplier,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!supplier) return null;

  const handleReject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (reason.trim().length < 10) {
      setError("Rejection reason must contain at least 10 characters.");
      return;
    }
    setError(null);
    setLoading(true);

    try {
      await api.post("/approver/reject", {
        supplierId: supplier.id,
        rejectionReason: reason.trim(),
      });
      onSuccess();
      onClose();
      setReason("");
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to finalize rejection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Reject Supplier Application"
      description={`Rejecting ${supplier.companyName} (${supplier.vatId}).`}
      maxWidth="md"
    >
      {error && (
        <div className="mb-4 rounded-lg bg-rose-50 p-3 text-xs text-rose-700 border border-rose-200 font-medium">
          {error}
        </div>
      )}
      <form onSubmit={handleReject} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
            Formal Rejection Reason <span className="text-rose-600">*</span>
          </label>
          <textarea
            rows={4}
            required
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Specify reason (e.g., Incomplete tax registration documentation, expired certification)..."
            className="block w-full rounded-lg border border-slate-300 p-3 text-sm text-slate-900 focus:border-rose-600 focus:outline-none focus:ring-2 focus:ring-rose-500/20"
          />
          <div className="mt-1.5 flex justify-between text-[11px] text-slate-400">
            <span>Min 10 characters</span>
            <span>{reason.trim().length} / 500</span>
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-2.5 pt-4 border-t border-slate-100">
          <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="destructive"
            isLoading={loading}
            disabled={reason.trim().length < 10}
          >
            Confirm Rejection
          </Button>
        </div>
      </form>
    </Modal>
  );
};