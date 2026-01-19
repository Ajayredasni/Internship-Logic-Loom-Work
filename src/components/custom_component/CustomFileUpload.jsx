// src/components/custom_component/CustomFileUpload.jsx - PURE BOOTSTRAP VERSION
import React from "react";
import { Upload, X, AlertCircle } from "react-feather";

/**
 * CustomFileUpload Component - Pure Bootstrap Version
 *
  {string} name - Input name
  {string} label - Label text
  {function} onChange - Change handler receives (fieldName, fileData)
  {object} value - Current file value {name, type, size, base64}
  {string} error - Error message
  {boolean} required - Required field
  {boolean} disabled - Disabled state
  {string} accept - Accepted file types (default: "image/*,.pdf,.xlsx,.xls")
  {number} maxSize - Max file size in MB (default: 2)
  {boolean} showPreview - Show preview in upload area (default: true)
  {function} onClear - Clear file handler
  {string} className - Custom CSS class
 */

const CustomFileUpload = ({
  name = "",
  label = "Upload File",
  onChange = () => {},
  value = null,
  error = "",
  required = false,
  disabled = false,
  accept = "image/*,.pdf,.xlsx,.xls",
  maxSize = 2, // MB
  showPreview = true,
  onClear = null,
  className = "",
  ...rest
}) => {
  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    //  File size validation
    if (file.size > maxSize * 1024 * 1024) {
      alert(`File size should be less than ${maxSize}MB`);
      e.target.value = "";
      return;
    }

    //  Read file and convert to base64
    const reader = new FileReader();
    reader.onloadend = () => {
      const fileData = {
        name: file.name,
        type: file.type,
        size: file.size,
        base64: reader.result,
      };

      onChange(name, fileData);
    };

    reader.onerror = () => {
      alert("Error reading file. Please try again.");
      e.target.value = "";
    };

    reader.readAsDataURL(file);
  };

  const handleClear = () => {
    if (onClear) {
      onClear(name);
    } else {
      onChange(name, null);
    }
  };

  return (
    //  BOOTSTRAP: mb-3 (margin-bottom)
    <div className={`mb-3 ${className}`}>
      {/*  BOOTSTRAP: form-label, fw-semibold */}
      {label && (
        <label className="form-label fw-semibold">
          {label}
          {required && <span className="text-danger ms-1">*</span>}
        </label>
      )}

      {/*  BOOTSTRAP: border, border-2, rounded-3, p-4, text-center, position-relative */}
      <div
        className={`
          border border-2 rounded-3 p-4 text-center position-relative
          ${error ? "border-danger" : "border-secondary"}
          ${disabled ? "bg-light" : value ? "bg-success-subtle" : "bg-white"}
          ${!disabled && !value ? "hover-border-primary" : ""}
        `}
        style={{
          // MINIMAL CUSTOM CSS: Only for cursor and transition
          cursor: disabled ? "not-allowed" : "pointer",
          transition: "all 0.3s ease",
          borderStyle: "dashed",
        }}
      >
        {/*  Hidden file input */}
        <input
          type="file"
          id={`file-upload-${name}`}
          name={name}
          onChange={handleFileChange}
          accept={accept}
          disabled={disabled}
          className="d-none"
          {...rest}
        />

        {/*  Display based on file state */}
        {!value ? (
          //  No file selected - BOOTSTRAP CLASSES
          <label
            htmlFor={`file-upload-${name}`}
            className="d-block m-0"
            style={{ cursor: disabled ? "not-allowed" : "pointer" }}
          >
            {/*  BOOTSTRAP: mb-2 */}
            <Upload size={40} className="text-secondary mb-2" />

            {/*  BOOTSTRAP: mb-2, text-secondary, fs-6 */}
            <p className="mb-2 text-secondary fs-6">
              Click to upload or drag and drop
            </p>

            {/*  BOOTSTRAP: mb-0, text-muted, small */}
            <p className="mb-0 text-muted small">Max size: {maxSize}MB</p>
          </label>
        ) : (
          //  File selected - BOOTSTRAP CLASSES
          <div>
            {/*  BOOTSTRAP: mb-3, rounded-3, border, border-2 */}
            {showPreview && value.type?.startsWith("image/") && (
              <img
                src={value.base64}
                alt="Preview"
                className="mb-3 rounded-3 border border-2 border-light-subtle"
                style={{
                  maxWidth: "120px",
                  maxHeight: "120px",
                  objectFit: "cover",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                }}
              />
            )}

            {/*  BOOTSTRAP: d-flex, align-items-center, justify-content-center, gap-2 */}
            <div className="d-flex align-items-center justify-content-center gap-2">
              {/*  BOOTSTRAP: mb-0, text-success, fs-6, fw-medium */}
              <p className="mb-0 text-success fs-6 fw-medium">✓ {value.name}</p>

              {/*  BOOTSTRAP: btn, btn-link, text-danger, p-0 */}
              {!disabled && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="btn btn-link text-danger p-0"
                  title="Remove file"
                >
                  <X size={18} />
                </button>
              )}
            </div>

            {/*  BOOTSTRAP: mt-1, mb-0, text-muted, small */}
            <p className="mt-1 mb-0 text-muted small">
              {(value.size / 1024).toFixed(2)} KB
            </p>
          </div>
        )}
      </div>

      {/*  BOOTSTRAP: d-flex, align-items-center, gap-2, mt-2, text-danger, small, fw-medium */}
      {error && (
        <div className="d-flex align-items-center gap-2 mt-2 text-danger small fw-medium">
          <AlertCircle size={14} />
          <span>{error}</span>
        </div>
      )}

      {/*  CUSTOM CSS: Only for hover effect (Bootstrap doesn't have hover utilities) */}
      <style>{`
        .hover-border-primary:hover {
          border-color: #0d6efd !important;
          background-color: #f8f9fa !important;
        }
      `}</style>
    </div>
  );
};

export default CustomFileUpload;
