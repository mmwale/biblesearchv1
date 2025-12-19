/*
 * Pages/Documents.js
 * Shows a grid of downloadable study resources (documents) sourced from the local `base44` store.
 */
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { ArrowLeft, FileText, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { base44 } from "../api/Client";
import DocumentCard from "../Components/documents/documentcard";
import { Button } from "../Components/ui/button";
import { createPageUrl } from "../utils";

export default function Documents() {
    const { data: documents, isLoading } = useQuery({
        queryKey: ['documents'],
        queryFn: () => base44.entities.Document.list('-created_date'),
        initialData: []
    });

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-amber-50/30">
            <div className="container mx-auto px-4 py-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <div className="mb-8">
                        <Button
                            asChild
                            variant="ghost"
                            className="rounded-full hover:bg-slate-100 mb-6"
                        >
                            <Link to={createPageUrl('Home')}>
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Back to Search
                            </Link>
                        </Button>

                        <div className="text-center space-y-3 mb-12">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 shadow-lg shadow-amber-500/30 mb-4">
                                <FileText className="w-8 h-8 text-white" />
                            </div>
                            <h1 className="text-4xl md:text-5xl font-bold text-slate-900">
                                Study Resources
                            </h1>
                            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                                Download helpful Bible study materials, commentaries, and devotionals
                            </p>
                        </div>
                    </div>

                    {isLoading ? (
                        <div className="flex items-center justify-center py-20">
                            <Loader2 className="w-8 h-8 animate-spin text-amber-600" />
                        </div>
                    ) : documents.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
                            {documents.map((doc, index) => (
                                <DocumentCard key={doc.id} document={doc} index={index} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20">
                            <FileText className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                            <p className="text-slate-500 text-lg">No documents available yet.</p>
                            <p className="text-slate-400 text-sm mt-2">Check back soon for study resources!</p>
                        </div>
                    )}
                </motion.div>
            </div>
        </div>
    );
}