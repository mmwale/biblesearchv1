/*
 * documentcard.js
 * Card UI for a single downloadable document/resource
 * - Handles the case where `file_url` may be absent and renders a disabled state
 */
import { motion } from "framer-motion";
import { Download, FileText } from "lucide-react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

const categoryColors = {
    "Study Guide": "bg-blue-100 text-blue-700 border-blue-200",
    "Commentary": "bg-purple-100 text-purple-700 border-purple-200",
    "Devotional": "bg-green-100 text-green-700 border-green-200",
    "Reference": "bg-amber-100 text-amber-700 border-amber-200",
    "Other": "bg-slate-100 text-slate-700 border-slate-200"
};

export default function DocumentCard({ document, index }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
        >
            <Card className="h-full hover:shadow-xl transition-all duration-300 border-2 border-slate-100 hover:border-amber-200 group">
                <CardHeader className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                        <div className="p-3 rounded-xl bg-amber-50 group-hover:bg-amber-100 transition-colors">
                            <FileText className="w-6 h-6 text-amber-600" />
                        </div>
                        {document.category && (
                            <Badge className={`${categoryColors[document.category]} border`}>
                                {document.category}
                            </Badge>
                        )}
                    </div>
                    <CardTitle className="text-lg leading-tight text-slate-900">
                        {document.title}
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {document.description && (
                        <p className="text-sm text-slate-600 leading-relaxed">
                            {document.description}
                        </p>
                    )}
                    <div className="flex items-center justify-between pt-2">
                        {document.file_size && (
                            <span className="text-xs text-slate-500">{document.file_size}</span>
                        )}
                        <Button
                            asChild
                            className={`rounded-full ml-auto ${document.file_url ? 'bg-slate-900 hover:bg-slate-800' : 'bg-slate-200 text-slate-500 cursor-not-allowed'}`}
                        >
                            {document.file_url ? (
                                // Use the file_url as a download link. If the URL doesn't contain a file name,
                                // fall back to a safe default using the document title.
                                <a href={document.file_url} target="_blank" rel="noopener noreferrer" download={
                                    document.file_url.split('/').pop() || `${document.title}.docx`
                                }>
                                    <Download className="w-4 h-4 mr-2" />
                                    Download
                                </a>
                            ) : (
                                <span>
                                    <Download className="w-4 h-4 mr-2" />
                                    Not available
                                </span>
                            )}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
}