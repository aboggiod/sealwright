'use client';

import React, { useState } from 'react';
import { Upload, X, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

interface Document {
  id: string;
  file: File;
  status: 'pending' | 'uploading' | 'success' | 'error';
  progress: number;
  key?: string;
  error?: string;
}

interface DocumentUploaderProps {
  orderId: string;
  onUploadComplete: (documents: { key: string; originalName: string }[]) => void;
  maxFiles?: number;
  acceptedTypes?: string;
}

export function DocumentUploader({
  orderId,
  onUploadComplete,
  maxFiles = 10,
  acceptedTypes = '.pdf,.png,.jpg,.jpeg,.heic,.webp'
}: DocumentUploaderProps) {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return;

    const newDocs: Document[] = Array.from(files).map((file) => ({
      id: crypto.randomUUID(),
      file,
      status: 'pending',
      progress: 0,
    }));

    setDocuments(prev => [...prev, ...newDocs].slice(0, maxFiles));
  };

  const uploadDocument = async (doc: Document, index: number) => {
    // Update status to uploading
    setDocuments(prev => prev.map(d =>
      d.id === doc.id ? { ...d, status: 'uploading' } : d
    ));

    try {
      // Get presigned URL from API
      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileName: doc.file.name,
          fileType: doc.file.type,
          orderId,
          documentIndex: index,
        }),
      });

      if (!response.ok) throw new Error('Failed to get upload URL');

      const { uploadUrl, key } = await response.json();

      // Upload to R2
      const xhr = new XMLHttpRequest();

      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) {
          const progress = Math.round((e.loaded / e.total) * 100);
          setDocuments(prev => prev.map(d =>
            d.id === doc.id ? { ...d, progress } : d
          ));
        }
      });

      xhr.addEventListener('load', () => {
        if (xhr.status === 200) {
          setDocuments(prev => prev.map(d =>
            d.id === doc.id ? { ...d, status: 'success', key } : d
          ));
        } else {
          throw new Error('Upload failed');
        }
      });

      xhr.addEventListener('error', () => {
        throw new Error('Upload failed');
      });

      xhr.open('PUT', uploadUrl);
      xhr.setRequestHeader('Content-Type', doc.file.type);
      xhr.send(doc.file);

    } catch (error) {
      setDocuments(prev => prev.map(d =>
        d.id === doc.id ? {
          ...d,
          status: 'error',
          error: error instanceof Error ? error.message : 'Upload failed'
        } : d
      ));
    }
  };

  const uploadAll = async () => {
    const pendingDocs = documents.filter(d => d.status === 'pending');

    for (let i = 0; i < pendingDocs.length; i++) {
      await uploadDocument(pendingDocs[i], i);
    }

    // Call callback with successful uploads
    const successful = documents.filter(d => d.status === 'success');
    if (successful.length > 0) {
      onUploadComplete(successful.map(d => ({
        key: d.key!,
        originalName: d.file.name
      })));
    }
  };

  const removeDocument = (id: string) => {
    setDocuments(prev => prev.filter(d => d.id !== id));
  };

  return (
    <div className="space-y-4">
      {/* Drop Zone */}
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          isDragging ? 'border-accent bg-accent/5' : 'border-gray-300'
        }`}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          handleFileSelect(e.dataTransfer.files);
        }}
      >
        <Upload className="mx-auto h-12 w-12 text-gray-400" />
        <p className="mt-2 text-sm">Drag & drop your documents here, or</p>
        <label htmlFor="file-upload" className="cursor-pointer">
          <span className="mt-2 inline-block px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90">
            Browse Files
          </span>
          <input
            id="file-upload"
            type="file"
            multiple
            accept={acceptedTypes}
            className="hidden"
            onChange={(e) => handleFileSelect(e.target.files)}
          />
        </label>
        <p className="text-xs text-gray-500 mt-2">
          Accepted: PDF, PNG, JPG, HEIC, WEBP (max {maxFiles} files)
        </p>
      </div>

      {/* Document List */}
      {documents.length > 0 && (
        <div className="space-y-2">
          {documents.map((doc) => (
            <div
              key={doc.id}
              className="flex items-center justify-between p-3 bg-white border rounded-lg"
            >
              <div className="flex items-center space-x-3 flex-1">
                <FileText className="h-5 w-5 text-gray-400" />
                <div className="flex-1">
                  <p className="text-sm font-medium truncate">{doc.file.name}</p>
                  <p className="text-xs text-gray-500">
                    {(doc.file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>

              {doc.status === 'uploading' && (
                <div className="w-32">
                  <Progress value={doc.progress} className="h-2" />
                </div>
              )}

              {doc.status === 'success' && (
                <CheckCircle className="h-5 w-5 text-green-500" />
              )}

              {doc.status === 'error' && (
                <div className="flex items-center space-x-2">
                  <AlertCircle className="h-5 w-5 text-red-500" />
                  <span className="text-xs text-red-500">{doc.error}</span>
                </div>
              )}

              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeDocument(doc.id)}
                disabled={doc.status === 'uploading'}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* Upload Button */}
      {documents.length > 0 && (
        <Button
          onClick={uploadAll}
          disabled={documents.every(d => d.status === 'success' || d.status === 'uploading')}
          className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
        >
          Upload {documents.filter(d => d.status === 'pending').length} Document(s)
        </Button>
      )}
    </div>
  );
}
