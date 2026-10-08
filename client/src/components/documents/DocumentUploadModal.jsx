import React, { useState, useRef } from 'react';
import { useDocumentStore } from '../../stores/documentStore.js';
import { documentsApi } from '../../services/index.js';
import { Upload, X, FileUp, AlertCircle, CheckCircle, FileText, Loader2 } from 'lucide-react';

export const DocumentUploadModal = ({ onUploadSuccess }) => {
  const { isUploadModalOpen, setUploadModalOpen } = useDocumentStore();
  const [file, setFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState('');
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  if (!isUploadModalOpen) return null;

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelected(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelected = (selectedFile) => {
    setError(null);
    if (selectedFile.type !== 'application/pdf') {
      setError('Please select a valid PDF file.');
      return;
    }
    if (selectedFile.size > 25 * 1024 * 1024) {
      setError('File exceeds the 25MB maximum limit.');
      return;
    }
    setFile(selectedFile);
  };

  const handleUpload = async () => {
    if (!file) return;
    setIsUploading(true);
    setError(null);
    setProgress(20);
    setStage('Uploading file buffer...');

    try {
      const formData = new FormData();
      formData.append('file', file);

      setProgress(50);
      setStage('Extracting text & validating content...');

      const response = await documentsApi.upload(formData);
      setProgress(100);
      setStage('Upload complete! Processing...');

      setTimeout(() => {
        setIsUploading(false);
        setFile(null);
        setUploadModalOpen(false);
        onUploadSuccess?.(response.data);
      }, 350);
    } catch (err) {
      setIsUploading(false);
      setError(err.message || 'Failed to upload document');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-dark-card border border-dark-border rounded-2xl p-6 shadow-card-glow">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-dark-border/80">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-brand-500/15 border border-brand-500/30 text-brand-400">
              <FileUp className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-white">Upload Document</h3>
              <p className="text-xs text-dark-muted">Upload multi-page PDFs to vectorize into RAG</p>
            </div>
          </div>
          <button
            onClick={() => {
              if (!isUploading) setUploadModalOpen(false);
            }}
            disabled={isUploading}
            className="p-1.5 rounded-lg text-dark-muted hover:text-white hover:bg-dark-surface transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Dropzone */}
        <div className="mt-5 space-y-4">
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
              dragActive
                ? 'border-brand-500 bg-brand-500/10 scale-[1.01]'
                : file
                ? 'border-brand-500/40 bg-brand-500/5'
                : 'border-dark-border hover:border-gray-500 bg-dark-surface/40'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,application/pdf"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && handleFileSelected(e.target.files[0])}
            />

            {file ? (
              <div className="flex flex-col items-center gap-2">
                <div className="p-3 rounded-full bg-brand-500/20 text-brand-400">
                  <FileText className="w-8 h-8" />
                </div>
                <span className="text-sm font-medium text-white">{file.name}</span>
                <span className="text-xs text-gray-400">{(file.size / (1024 * 1024)).toFixed(2)} MB</span>
                <span className="text-xs text-brand-400 underline mt-1">Click to change file</span>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3">
                <div className="p-3 rounded-full bg-dark-surface border border-dark-border text-gray-400">
                  <Upload className="w-6 h-6 text-brand-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-200">
                    Drag and drop your PDF here, or <span className="text-brand-400 underline">browse</span>
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Supports multi-page PDFs up to 25MB</p>
                </div>
              </div>
            )}
          </div>

          {/* Error Banner */}
          {error && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Upload Progress Bar */}
          {isUploading && (
            <div className="space-y-2 p-3 rounded-lg bg-dark-surface/60 border border-dark-border">
              <div className="flex items-center justify-between text-xs text-gray-300">
                <span className="flex items-center gap-2">
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-brand-400" />
                  {stage}
                </span>
                <span className="font-mono text-brand-400">{progress}%</span>
              </div>
              <div className="w-full bg-dark-border h-2 rounded-full overflow-hidden">
                <div
                  className="bg-brand-500 h-full rounded-full transition-all duration-300 shadow-glow-sm"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex items-center justify-end gap-3 pt-4 border-t border-dark-border/80">
          <button
            type="button"
            disabled={isUploading}
            onClick={() => setUploadModalOpen(false)}
            className="px-4 py-2 text-xs font-medium text-gray-400 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={!file || isUploading}
            onClick={handleUpload}
            className="flex items-center gap-2 px-5 py-2 rounded-xl bg-brand-500 hover:bg-brand-600 disabled:opacity-50 disabled:pointer-events-none text-white text-xs font-semibold shadow-glow-sm transition-all"
          >
            {isUploading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                Ingesting...
              </>
            ) : (
              <>
                <Upload className="w-3.5 h-3.5" />
                Start RAG Ingestion
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
