import React, { useState } from "react";
import { toast } from "react-toastify";
import HeaderProfile from "../../../components/HeaderProfile";
import { useAppDispatch } from "../../../hooks/redux";
import { fullResetStudentsAsync, resetStudentChoicesAsync } from "../../../store/slices/adminSlice";
import { adminService } from "../../../services/adminService";

function ActionCard({ title, description, buttonText, tone = "danger", onClick, isLoading }) {
  const toneClasses = {
    danger: "bg-red-600 hover:bg-red-700",
    warning: "bg-yellow-600 hover:bg-yellow-700",
    neutral: "bg-gray-800 hover:bg-gray-900",
  };

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
      <div className="text-lg font-semibold text-gray-800 mb-2">{title}</div>
      <div className="text-sm text-gray-500 mb-4">{description}</div>
      <button
        type="button"
        onClick={onClick}
        disabled={isLoading}
        className={`px-5 py-2.5 rounded-lg text-white font-medium transition-colors ${toneClasses[tone]} ${isLoading ? "opacity-60 cursor-not-allowed" : ""}`}
      >
        {isLoading ? "Processing..." : buttonText}
      </button>
    </div>
  );
}

function MasterSetting() {
  const dispatch = useAppDispatch();
  const [loadingKey, setLoadingKey] = useState("");

  const handleResetChoices = async () => {
    try {
      setLoadingKey("resetChoices");
      const response = await dispatch(resetStudentChoicesAsync()).unwrap();
      toast.success(response.message || "All student choices reset successfully");
    } catch (err) {
      toast.error(typeof err === "string" ? err : err?.message || "Failed to reset choices");
    } finally {
      setLoadingKey("");
    }
  };

  const handleFullReset = async () => {
    try {
      setLoadingKey("fullReset");
      const response = await dispatch(fullResetStudentsAsync()).unwrap();
      toast.success(response.message || "Full reset completed successfully");
    } catch (err) {
      toast.error(typeof err === "string" ? err : err?.message || "Full reset failed");
    } finally {
      setLoadingKey("");
    }
  };

  const handleDownloadPasswords = async () => {
    try {
      setLoadingKey("downloadPasswords");
      const blob = await adminService.downloadStudentTempPasswords();
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "student_temp_passwords.xlsx");
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success("Password file downloaded");
    } catch (err) {
      toast.error(typeof err === "string" ? err : err?.message || "Failed to download file");
    } finally {
      setLoadingKey("");
    }
  };

  return (
    <div className="flex bg-gradient-to-br from-gray-100 via-white to-gray-200 min-h-[100vh]">
      <section className="bg-white flex-1 flex flex-col px-0 md:px-0 w-full max-w-7xl mx-auto">
        <HeaderProfile />
        <div className="w-full max-w-7xl mx-auto">
          <div className=" rounded-2xl p-8">
            <h3 className="text-xl font-semibold !text-gray-700 mb-4 border-b pb-2">Master Settings</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
              <ActionCard
                title="Reset All Student Choices"
                description="Clears all student choices, allocations, and resets company filled seats. This does not remove preferred domains."
                buttonText="Reset Choices"
                tone="warning"
                onClick={handleResetChoices}
                isLoading={loadingKey === "resetChoices"}
              />
              <ActionCard
                title="Full Reset (Wipe Data)"
                description="Clears preferred domains, choices, allocation status, and resets company filled seats. Use with caution."
                buttonText="Full Reset"
                tone="danger"
                onClick={handleFullReset}
                isLoading={loadingKey === "fullReset"}
              />
              <ActionCard
                title="Download Temp Passwords"
                description="Download the Excel file containing all student temporary passwords."
                buttonText="Download"
                tone="neutral"
                onClick={handleDownloadPasswords}
                isLoading={loadingKey === "downloadPasswords"}
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default MasterSetting;
