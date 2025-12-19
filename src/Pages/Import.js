// Import page removed. Using local bundled data for the app; import functionality is not required.
// The original Import UI has been intentionally disabled to keep the app focused on bundled data.

export default function Import() {
    return (
        <div style={{ padding: 40, textAlign: 'center' }}>
            <h2>Import Disabled</h2>
            <p style={{ color: '#555' }}>Importing data via the UI has been disabled. All data is loaded from local bundled files.</p>
        </div>
    );
}
    const parseAndNormalizeData = (data, selectedVersion) => {
        const verses = [];

        // Format 1: KJV/ASV style - { books: [{ name, chapters: [{ chapter, verses: [{verse, text}] }] }] }
        if (data.books && Array.isArray(data.books)) {
            data.books.forEach(book => {
                if (book.chapters && Array.isArray(book.chapters)) {
                    book.chapters.forEach(chapter => {
                        if (chapter.verses && Array.isArray(chapter.verses)) {
                            chapter.verses.forEach(verse => {
                                verses.push({
                                    version: selectedVersion,
                                    book: book.name,
                                    chapter: chapter.chapter,
                                    verse: verse.verse,
                                    text: verse.text
                                });
                            });
                        }
                    });
                }
            });
        }
        // Format 2: NIV/ESV/NKJV/ISV style - { "Genesis": { "1": { "1": "text", "2": "text" } } }
        else {
            Object.entries(data).forEach(([bookName, chapters]) => {
                if (typeof chapters === 'object' && bookName !== 'translation') {
                    Object.entries(chapters).forEach(([chapterNum, versesObj]) => {
                        if (typeof versesObj === 'object') {
                            Object.entries(versesObj).forEach(([verseNum, text]) => {
                                if (typeof text === 'string') {
                                    verses.push({
                                        version: selectedVersion,
                                        book: bookName,
                                        chapter: parseInt(chapterNum),
                                        verse: parseInt(verseNum),
                                        text: text
                                    });
                                }
                            });
                        }
                    });
                }
            });
        }

        return verses;
    };

    const importVerses = async () => {
        if (!jsonData.trim()) {
            setStatus({ type: 'error', message: 'Please provide JSON data' });
            return;
        }

        try {
            setIsProcessing(true);
            setStatus({ type: 'loading', message: 'Parsing JSON...' });

            const data = JSON.parse(jsonData);
            const verses = parseAndNormalizeData(data, version);

            if (!verses.length) {
                setStatus({ type: 'error', message: 'No verses found in JSON data. Check the format.' });
                setIsProcessing(false);
                return;
            }

            setStatus({ type: 'loading', message: `Importing ${verses.length} verses...` });
            setProgress({ current: 0, total: verses.length });

            // Import in batches of 100
            const batchSize = 100;
            for (let i = 0; i < verses.length; i += batchSize) {
                const batch = verses.slice(i, i + batchSize);
                await base44.entities.BibleVerse.bulkCreate(batch);
                setProgress({ current: Math.min(i + batchSize, verses.length), total: verses.length });
            }

            setStatus({ 
                type: 'success', 
                message: `Successfully imported ${verses.length} verses for ${version}!` 
            });
            setJsonData('');
            setProgress({ current: 0, total: 0 });
        } catch (error) {
            setStatus({ type: 'error', message: 'Import failed: ' + error.message });
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-amber-50/30 py-8">
            <div className="container mx-auto px-4 max-w-4xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg shadow-blue-500/30 mb-4">
                            <Upload className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-4xl font-bold text-slate-900 mb-3">
                            Import Bible Verses
                        </h1>
                        <p className="text-slate-600">
                            Bulk import Bible verses from your JSON files
                        </p>
                    </div>

                    <Card className="mb-6 border-2 border-blue-100 bg-blue-50/50">
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <FileJson className="w-5 h-5 text-blue-600" />
                                Supported JSON Formats
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3 text-sm">
                            <div>
                                <p className="font-medium text-slate-700">Format 1 (KJV/ASV style):</p>
                                <pre className="bg-slate-900 text-slate-100 rounded-lg p-3 text-xs mt-2 overflow-x-auto">
{`{ "books": [{ "name": "Genesis", "chapters": [{ "chapter": 1, "verses": [{ "verse": 1, "text": "..." }] }] }] }`}
                                </pre>
                            </div>
                            <div>
                                <p className="font-medium text-slate-700">Format 2 (NIV/ESV/NKJV/ISV style):</p>
                                <pre className="bg-slate-900 text-slate-100 rounded-lg p-3 text-xs mt-2 overflow-x-auto">
{`{ "Genesis": { "1": { "1": "In the beginning...", "2": "And the earth..." } } }`}
                                </pre>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-2 border-slate-200 shadow-lg">
                        <CardHeader>
                            <CardTitle>Import Configuration</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">Bible Version</label>
                                <Select value={version} onValueChange={setVersion}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="KJV">King James Version (KJV)</SelectItem>
                                        <SelectItem value="NKJV">New King James Version (NKJV)</SelectItem>
                                        <SelectItem value="NIV">New International Version (NIV)</SelectItem>
                                        <SelectItem value="ESV">English Standard Version (ESV)</SelectItem>
                                        <SelectItem value="ISV">International Standard Version (ISV)</SelectItem>
                                        <SelectItem value="ASV">American Standard Version (ASV)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-4">
                                <div className="flex gap-2 border-b border-slate-200">
                                    <button
                                        onClick={() => setImportMethod('paste')}
                                        className={`px-4 py-2 text-sm font-medium transition-colors ${
                                            importMethod === 'paste'
                                                ? 'text-blue-600 border-b-2 border-blue-600'
                                                : 'text-slate-600 hover:text-slate-900'
                                        }`}
                                    >
                                        Paste JSON
                                    </button>
                                    <button
                                        onClick={() => setImportMethod('file')}
                                        className={`px-4 py-2 text-sm font-medium transition-colors ${
                                            importMethod === 'file'
                                                ? 'text-blue-600 border-b-2 border-blue-600'
                                                : 'text-slate-600 hover:text-slate-900'
                                        }`}
                                    >
                                        Upload File
                                    </button>
                                </div>

                                {importMethod === 'paste' && (
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-700">JSON Data</label>
                                        <Textarea
                                            value={jsonData}
                                            onChange={(e) => setJsonData(e.target.value)}
                                            placeholder="Paste your Bible JSON data here..."
                                            className="font-mono text-xs min-h-[300px]"
                                        />
                                    </div>
                                )}

                                {importMethod === 'file' && (
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-700">Upload JSON File</label>
                                        <Input
                                            type="file"
                                            accept=".json"
                                            onChange={handleFileUpload}
                                            disabled={isProcessing}
                                        />
                                    </div>
                                )}
                            </div>

                            <AnimatePresence>
                                {status && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className={`p-4 rounded-lg flex items-start gap-3 ${
                                            status.type === 'success'
                                                ? 'bg-green-50 border border-green-200'
                                                : status.type === 'error'
                                                ? 'bg-red-50 border border-red-200'
                                                : 'bg-blue-50 border border-blue-200'
                                        }`}
                                    >
                                        {status.type === 'loading' && (
                                            <Loader2 className="w-5 h-5 text-blue-600 animate-spin flex-shrink-0 mt-0.5" />
                                        )}
                                        {status.type === 'success' && (
                                            <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                                        )}
                                        {status.type === 'error' && (
                                            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                                        )}
                                        <div className="flex-1">
                                            <p className={`text-sm font-medium ${
                                                status.type === 'success'
                                                    ? 'text-green-800'
                                                    : status.type === 'error'
                                                    ? 'text-red-800'
                                                    : 'text-blue-800'
                                            }`}>
                                                {status.message}
                                            </p>
                                            {progress.total > 0 && status.type === 'loading' && (
                                                <div className="mt-2">
                                                    <div className="w-full bg-slate-200 rounded-full h-2">
                                                        <div
                                                            className="bg-blue-600 h-2 rounded-full transition-all"
                                                            style={{ width: `${(progress.current / progress.total) * 100}%` }}
                                                        />
                                                    </div>
                                                    <p className="text-xs text-slate-600 mt-1">
                                                        {progress.current} / {progress.total} verses
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <Button
                                onClick={importVerses}
                                disabled={isProcessing || !jsonData.trim()}
                                className="w-full bg-blue-600 hover:bg-blue-700"
                                size="lg"
                            >
                                {isProcessing ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Importing...
                                    </>
                                ) : (
                                    <>
                                        <Upload className="w-4 h-4 mr-2" />
                                        Import Verses
                                    </>
                                )}
                            </Button>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </div>
    );
}