// src/components/custom_component/CustomFilePreview.jsx - PURE BOOTSTRAP VERSION
import React, { useState } from "react";
import { FileText, Download, Maximize2 } from "react-feather";
import CustomModal from "./CustomModal";

/**
 * CustomFilePreview Component - Pure Bootstrap Version
 *
 * @param {object} fileData - File object {name, type, size, base64}
 * @param {string} variant - "inline" | "card" | "thumbnail" (default: "card")
 * @param {boolean} showModal - Enable modal preview (default: true)
 * @param {boolean} showDownload - Show download button (default: true)
 * @param {function} onClick - Custom click handler
  {string} className - Custom CSS class
 */

const CustomFilePreview = ({
  fileData = null,
  variant = "card",
  showModal = true,
  showDownload = true,
  onClick = null,
  className = "",
}) => {
  const [imageModal, setImageModal] = useState({
    show: false,
    src: "",
    name: "",
  });

  if (!fileData) return null;

  // Handle file click
  const handleFileClick = () => {
    if (onClick) {
      onClick(fileData);
      return;
    }

    // Image - Show in modal
    if (fileData.type?.startsWith("image/")) {
      if (showModal) {
        setImageModal({
          show: true,
          src: fileData.base64,
          name: fileData.name,
        });
      }
    }
    //  PDF - Open in new window
    else if (fileData.type === "application/pdf") {
      const newWindow = window.open();
      newWindow.document.write(`
        <html>
          <head><title>${fileData.name}</title></head>
          <body style="margin: 0;">
            <iframe src="${fileData.base64}" style="width: 100%; height: 100vh; border: none;"></iframe>
          </body>
        </html>
      `);
      newWindow.document.close();
    }
    // Excel - Download
    else if (
      fileData.type ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
      fileData.type === "application/vnd.ms-excel"
    ) {
      handleDownload();
    }
  };

  //  Download handler
  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = fileData.base64;
    link.download = fileData.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  //  Render based on variant
  const renderPreview = () => {
    // ========== THUMBNAIL VARIANT ==========
    if (variant === "thumbnail") {
      return (
        //  BOOTSTRAP: rounded-3, border, border-2, d-flex, align-items-center, justify-content-center, bg-light
        <div
          onClick={handleFileClick}
          className={`rounded-3 border border-2 border-light-subtle d-flex align-items-center justify-content-center bg-light file-thumbnail ${className}`}
          style={{
            width: "80px",
            height: "80px",
            cursor: "pointer",
            transition: "transform 0.2s ease", //  MINIMAL CUSTOM: Only transition
          }}
        >
          {fileData.type?.startsWith("image/") && fileData.base64 ? (
            <img
              src={fileData.base64}
              alt={fileData.name}
              className="w-100 h-100 rounded-3"
              style={{ objectFit: "cover" }}
            />
          ) : fileData.type === "application/pdf" ? (
            //  BOOTSTRAP: text-center, text-danger
            <div className="text-center text-danger">
              <FileText size={32} />
              <div className="small mt-1">PDF</div>
            </div>
          ) : (
            //  BOOTSTRAP: text-center, text-success
            <div className="text-center text-success">
              <span style={{ fontSize: "32px" }}>📊</span>
              <div className="small mt-1">EXCEL</div>
            </div>
          )}
        </div>
      );
    }

    // ========== INLINE VARIANT ==========
    if (variant === "inline") {
      return (
        //  BOOTSTRAP: d-flex, align-items-center, gap-2, p-2, bg-light, rounded-2, border
        <div
          className={`d-flex align-items-center gap-2 p-2 bg-light rounded-2 border file-inline ${className}`}
          onClick={handleFileClick}
          style={{ cursor: "pointer" }}
        >
          {/*  File icon */}
          {fileData.type?.startsWith("image/") ? (
            <span style={{ fontSize: "20px" }}>🖼️</span>
          ) : fileData.type === "application/pdf" ? (
            <FileText size={20} className="text-danger" />
          ) : (
            <span style={{ fontSize: "20px" }}>📊</span>
          )}

          {/* BOOTSTRAP: small, text-dark, flex-grow-1, text-truncate */}
          <span className="small text-dark flex-grow-1 text-truncate">
            {fileData.name}
          </span>

          {/* BOOTSTRAP: btn, btn-link, text-secondary, p-0 */}
          {showDownload && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleDownload();
              }}
              className="btn btn-link text-secondary p-0"
            >
              <Download size={16} />
            </button>
          )}
        </div>
      );
    }

    // ========== CARD VARIANT (Default) ==========
    return (
      // BOOTSTRAP: p-3, bg-light, rounded-3, border
      <div className={`p-3 bg-light rounded-3 border ${className}`}>
        {/* BOOTSTRAP: d-flex, align-items-center, gap-3 */}
        <div className="d-flex align-items-center gap-3">
          {/* File icon/preview */}
          <div
            onClick={handleFileClick}
            className="flex-shrink-0"
            style={{ cursor: showModal ? "pointer" : "default" }}
          >
            {fileData.type?.startsWith("image/") && fileData.base64 ? (
              // BOOTSTRAP: position-relative, rounded-3, border, border-2
              <div className="position-relative">
                <img
                  src={fileData.base64}
                  alt="Preview"
                  className="rounded-3 border border-2"
                  style={{
                    width: "100px",
                    height: "100px",
                    objectFit: "cover",
                  }}
                />
                {/* BOOTSTRAP: position-absolute, top-0, end-0, m-1, bg-dark, bg-opacity-75, rounded-2, p-1 */}
                {showModal && (
                  <div className="position-absolute top-0 end-0 m-1 bg-dark bg-opacity-75 rounded-2 p-1">
                    <Maximize2 size={14} className="text-white" />
                  </div>
                )}
              </div>
            ) : fileData.type === "application/pdf" ? (
              // BOOTSTRAP: d-flex, flex-column, align-items-center, justify-content-center, text-white, rounded-3
              <div
                className="d-flex flex-column align-items-center justify-content-center text-white rounded-3"
                style={{
                  width: "100px",
                  height: "100px",
                  background:
                    "linear-gradient(135deg, #dc3545 0%, #c82333 100%)", // Gradient needs custom CSS
                }}
              >
                <FileText size={40} />
                <span className="small mt-1">PDF</span>
              </div>
            ) : (
              //  BOOTSTRAP: d-flex, flex-column, align-items-center, justify-content-center, text-white, rounded-3
              <div
                className="d-flex flex-column align-items-center justify-content-center text-white rounded-3"
                style={{
                  width: "100px",
                  height: "100px",
                  background:
                    "linear-gradient(135deg, #28a745 0%, #218838 100%)", //  Gradient needs custom CSS
                }}
              >
                <span style={{ fontSize: "40px" }}>📊</span>
                <span className="small mt-1">EXCEL</span>
              </div>
            )}
          </div>

          {/*  BOOTSTRAP: flex-grow-1, text-truncate */}
          <div className="flex-grow-1" style={{ minWidth: 0 }}>
            {/*  BOOTSTRAP: mb-1, small, fw-semibold, text-dark, text-truncate */}
            <p className="mb-1 small fw-semibold text-dark text-truncate">
              {fileData.name}
            </p>
            {/*  BOOTSTRAP: mb-0, small, text-secondary */}
            <p className="mb-0 small text-secondary">
              {fileData.size
                ? `${(fileData.size / 1024).toFixed(2)} KB`
                : "Unknown size"}
            </p>
          </div>

          {/*  BOOTSTRAP: btn, btn-primary, btn-sm, d-flex, align-items-center, gap-2 */}
          {showDownload && (
            <button
              type="button"
              onClick={handleDownload}
              className="btn btn-primary btn-sm d-flex align-items-center gap-2 file-download-btn"
            >
              <Download size={14} />
              Download
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <>
      {renderPreview()}

      {/*  Image Modal */}
      {showModal && (
        <CustomModal
          show={imageModal.show}
          onClose={() => setImageModal({ show: false, src: "", name: "" })}
          title={imageModal.name}
          size="xl"
          closeOnOverlayClick={true}
        >
          {/*  BOOTSTRAP: text-center */}
          <div className="text-center">
            <img
              src={imageModal.src}
              alt={imageModal.name}
              className="rounded-3"
              style={{
                maxWidth: "100%",
                maxHeight: "70vh",
                objectFit: "contain",
              }}
            />
          </div>
        </CustomModal>
      )}

      {/*  MINIMAL CUSTOM CSS: Only for hover effects and transitions */}
      <style>{`
        .file-thumbnail:hover {
          transform: scale(1.05);
        }
        
        .file-inline:hover {
          background-color: #e9ecef !important;
        }
        
        .file-download-btn {
          transition: all 0.2s ease;
        }
        
        .file-download-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
        }
      `}</style>
    </>
  );
};

export default CustomFilePreview;
