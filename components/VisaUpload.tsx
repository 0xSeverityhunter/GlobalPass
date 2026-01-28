"use client";

import { useState, useCallback, useEffect } from "react";
import { Upload, FileImage, X, Loader2, Sparkles, Cpu, Brain, Settings2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import clsx from "clsx";
import { AIProvider } from "@/lib/ai-types";

interface VisaUploadProps {
    onScanComplete: (data: unknown) => void;
    onError: (error: string) => void;
}

const PROVIDERS: { id: AIProvider; name: string; icon: React.ReactNode; color: string }[] = [
    { id: "gemini", name: "Gemini", icon: <Sparkles className="w-4 h-4" />, color: "bg-blue-500" },
    { id: "openai", name: "GPT-4o", icon: <Cpu className="w-4 h-4" />, color: "bg-emerald-500" },
    { id: "claude", name: "Claude", icon: <Brain className="w-4 h-4" />, color: "bg-amber-500" },
];

export function VisaUpload({ onScanComplete, onError }: VisaUploadProps) {
    const [isDragging, setIsDragging] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [isScanning, setIsScanning] = useState(false);
    const [selectedProvider, setSelectedProvider] = useState<AIProvider | null>(null); // null = auto
    const [showPowerUserSettings, setShowPowerUserSettings] = useState(false);

    // Power user: Ctrl+Shift+P to toggle settings
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.ctrlKey && e.shiftKey && e.key === "P") {
                e.preventDefault();
                setShowPowerUserSettings((prev) => !prev);
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);

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
            // Only send provider if power user has selected one
            if (selectedProvider) {
                formData.append("provider", selectedProvider);
            }

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
            {/* Power User Settings (Hidden by default - Ctrl+Shift+P to show) */}
            <AnimatePresence>
                {showPowerUserSettings && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mb-4 overflow-hidden"
                    >
                        <div className="flex items-center justify-center gap-2 p-3 rounded-2xl bg-charcoal-100/50 dark:bg-white/5 border border-charcoal-200 dark:border-white/10">
                            <Settings2 className="w-4 h-4 text-charcoal-500" />
                            <span className="text-xs font-medium text-charcoal-500 dark:text-charcoal-400 mr-2">
                                Force AI:
                            </span>
                            <button
                                onClick={() => setSelectedProvider(null)}
                                className={clsx(
                                    "px-3 py-1.5 rounded-full text-xs font-semibold transition-all",
                                    selectedProvider === null
                                        ? "bg-charcoal-800 text-white"
                                        : "bg-charcoal-200 dark:bg-white/10 text-charcoal-600 dark:text-charcoal-400"
                                )}
                            >
                                Auto
                            </button>
                            {PROVIDERS.map((provider) => (
                                <button
                                    key={provider.id}
                                    onClick={() => setSelectedProvider(provider.id)}
                                    className={clsx(
                                        "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all",
                                        selectedProvider === provider.id
                                            ? `${provider.color} text-white`
                                            : "bg-charcoal-200 dark:bg-white/10 text-charcoal-600 dark:text-charcoal-400"
                                    )}
                                >
                                    {provider.icon}
                                    {provider.name}
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

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
                            "relative flex flex-col items-center justify-center w-full h-56 rounded-3xl border-2 border-dashed transition-all cursor-pointer",
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
                            "w-10 h-10 mb-3 transition-colors",
                            isDragging ? "text-brand-orange" : "text-charcoal-400"
                        )} />
                        <p className="text-base font-medium text-charcoal-700 dark:text-charcoal-300">
                            {isDragging ? "Drop your visa here" : "Drag & drop your visa image"}
                        </p>
                        <p className="text-sm text-charcoal-500 mt-1">
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
                                    className="w-full h-56 object-contain"
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
