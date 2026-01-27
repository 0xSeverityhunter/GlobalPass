"use client";

import { useState, useCallback } from "react";
import { Upload, FileImage, X, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import clsx from "clsx";

interface VisaUploadProps {
    onScanComplete: (data: unknown) => void;
    onError: (error: string) => void;
}

export function VisaUpload({ onScanComplete, onError }: VisaUploadProps) {
    const [isDragging, setIsDragging] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [isScanning, setIsScanning] = useState(false);

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const droppedFile = e.dataTransfer.files[0];
        if (droppedFile && droppedFile.type.startsWith("image/")) {
            processFile(droppedFile);
        }
    }, []);

    const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            processFile(selectedFile);
        }
    }, []);

    const processFile = (selectedFile: File) => {
        setFile(selectedFile);
        const reader = new FileReader();
        reader.onload = (e) => {
            setPreview(e.target?.result as string);
        };
        reader.readAsDataURL(selectedFile);
    };

    const clearFile = () => {
        setFile(null);
        setPreview(null);
    };

    const handleScan = async () => {
        if (!file) return;

        setIsScanning(true);
        try {
            const formData = new FormData();
            formData.append("file", file);

            const response = await fetch("/api/scan-visa", {
                method: "POST",
                body: formData,
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || "Failed to scan visa");
            }

            onScanComplete(result.data);
        } catch (error) {
            onError(error instanceof Error ? error.message : "Failed to scan visa");
        } finally {
            setIsScanning(false);
        }
    };

    return (
        <div className="w-full">
            <AnimatePresence mode="wait">
                {!file ? (
                    <motion.div
                        key="dropzone"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        className={clsx(
                            "relative flex flex-col items-center justify-center w-full h-64 rounded-3xl border-2 border-dashed transition-all cursor-pointer",
                            isDragging
                                ? "border-brand-orange bg-brand-orange/10"
                                : "border-charcoal-300 dark:border-charcoal-600 hover:border-brand-orange/50 bg-charcoal-50 dark:bg-brand-surface"
                        )}
                    >
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileSelect}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        <Upload className={clsx(
                            "w-12 h-12 mb-4 transition-colors",
                            isDragging ? "text-brand-orange" : "text-charcoal-400"
                        )} />
                        <p className="text-lg font-medium text-charcoal-700 dark:text-charcoal-300">
                            {isDragging ? "Drop your visa here" : "Drag & drop your visa image"}
                        </p>
                        <p className="text-sm text-charcoal-500 mt-2">
                            or click to browse • JPG, PNG, WebP
                        </p>
                    </motion.div>
                ) : (
                    <motion.div
                        key="preview"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="relative"
                    >
                        <div className="relative rounded-3xl overflow-hidden bg-charcoal-100 dark:bg-brand-surface border border-charcoal-200 dark:border-white/5">
                            {preview && (
                                <img
                                    src={preview}
                                    alt="Visa preview"
                                    className="w-full h-64 object-contain"
                                />
                            )}
                            <button
                                onClick={clearFile}
                                disabled={isScanning}
                                className="absolute top-4 right-4 p-2 rounded-full bg-charcoal-900/80 text-white hover:bg-charcoal-900 transition-colors disabled:opacity-50"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="flex items-center gap-4 mt-4">
                            <div className="flex items-center gap-3 flex-1 px-4 py-3 rounded-2xl bg-charcoal-100 dark:bg-brand-surface">
                                <FileImage className="w-5 h-5 text-charcoal-500" />
                                <span className="text-sm font-medium text-charcoal-700 dark:text-charcoal-300 truncate">
                                    {file.name}
                                </span>
                            </div>
                            <button
                                onClick={handleScan}
                                disabled={isScanning}
                                className="px-8 py-3 rounded-2xl bg-brand-orange text-white font-bold hover:bg-brand-orange-hover disabled:opacity-50 transition-all flex items-center gap-2"
                            >
                                {isScanning ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Scanning...
                                    </>
                                ) : (
                                    "SCAN VISA"
                                )}
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
