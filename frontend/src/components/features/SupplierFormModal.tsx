import React, { useState, useEffect } from "react";
import api from "../../api/axios";
import type { Supplier, Country } from "../../types";
import { ALL_COUNTRIES } from "../../constants/countries";
import { Modal } from "../ui/Modal";
import { Input } from "../ui/Input";
import { Select } from "../ui/Select";
import { Button } from "../ui/Button";

export interface SupplierFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editingSupplier?: Supplier | null;
}

export const SupplierFormModal: React.FC<SupplierFormModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  editingSupplier,
}) => {
  const [companyName, setCompanyName] = useState("");
  const [vatId, setVatId] = useState("");
  const [country, setCountry] = useState<Country>("NEPAL");
  const [contactEmail, setContactEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const userId = localStorage.getItem("userId") || "";

  useEffect(() => {
    if (editingSupplier) {
      setCompanyName(editingSupplier.companyName);
      setVatId(editingSupplier.vatId);
      setCountry(editingSupplier.country);
      setContactEmail(editingSupplier.contactEmail);
    } else {
      setCompanyName("");
      setVatId("");
      setCountry("NEPAL");
      setContactEmail("");
    }
    setError(null);
  }, [editingSupplier, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (editingSupplier) {
        await api.put("/suppliers/updateSuppliers", {
          vatId: editingSupplier.vatId,
          companyName: companyName.trim(),
          country,
          contactEmail: contactEmail.trim(),
        });
      } else {
        await api.post("/suppliers/createsSuppliers", {
          companyName: companyName.trim(),
          vatId: vatId.trim(),
          country,
          contactEmail: contactEmail.trim(),
          createdById: userId,
        });
      }
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to process supplier submission.");
    } finally {
      setLoading(false);
    }
  };

  const countryOptions = ALL_COUNTRIES.map((c) => ({
    value: c,
    label: c.replace(/_/g, " "),
  }));

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editingSupplier ? "Edit Supplier Application" : "Register New Supplier"}
      description="All submissions are evaluated against enterprise compliance rules."
      maxWidth="md"
    >
      {error && (
        <div className="mb-4 rounded-lg bg-rose-50 p-3 text-xs text-rose-700 border border-rose-200 font-medium">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Legal Entity Name"
          required
          placeholder="Global Tech Logistics Ltd"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
        />
        <Input
          label="VAT / Tax Identification Number"
          required
          disabled={Boolean(editingSupplier)}
          placeholder="VAT-9920192"
          value={vatId}
          onChange={(e) => setVatId(e.target.value)}
          helperText={editingSupplier ? "VAT ID is unique and immutable." : undefined}
        />
        <Input
          label="Official Contact Email"
          type="email"
          required
          placeholder="procurement@globaltech.com"
          value={contactEmail}
          onChange={(e) => setContactEmail(e.target.value)}
        />
        <Select
          label="Country Jurisdiction"
          value={country}
          onChange={(e) => setCountry(e.target.value as Country)}
          options={countryOptions}
        />
        <div className="mt-6 flex justify-end gap-2.5 pt-4 border-t border-slate-100">
          <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" isLoading={loading}>
            {editingSupplier ? "Update Record" : "Submit for Approval"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};