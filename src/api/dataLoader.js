/*
 * dataLoader.js
 * Loads and normalizes bundled Bible JSON files and sample documents.
 * Exports:
 * - loadBibleData(store): populates `store._verses` with normalized verse objects
 * - loadDocuments(store): populates `store._documents` with sample docs (local file URLs)
 * - initializeData(store): convenience method that runs both loaders
 */
import ASVData from '../Entities/ASV.json';
import ESVData from '../Entities/ESV_bible.json';
import ISVData from '../Entities/ISV_bible.json';
import JesusDoc from "../Entities/Jesus' Words in the Gospels that prove he's God.docx";
import KJVData from '../Entities/KJV.json';
import NIVData from '../Entities/NIV_bible.json';
import NKJVData from '../Entities/NKJV_bible.json';

const BIBLE_VERSIONS = {
    KJV: KJVData,
    NKJV: NKJVData,
    NIV: NIVData,
    ESV: ESVData,
    ISV: ISVData,
    ASV: ASVData
};

// Normalize verse data from JSON structure into flat array
// Supports the common structure used by KJV/ASV style JSON files: books -> chapters -> verses
function normalizeVerses(versionKey, versionData) {
    const verses = [];
    const books = versionData.books || [];
    
    books.forEach(book => {
        if (!book.chapters) return;
        book.chapters.forEach(chapter => {
            if (!chapter.verses) return;
            chapter.verses.forEach(verse => {
                // Build a compact verse object used by the rest of the app
                verses.push({
                    id: `${versionKey}-${book.name}-${chapter.chapter}-${verse.verse}`,
                    version: versionKey,
                    book: book.name,
                    chapter: chapter.chapter,
                    verse: verse.verse,
                    text: verse.text
                });
            });
        });
    });
    
    return verses;
}

// Load all Bible versions and populate store
export async function loadBibleData(store) {
    try {
        for (const [versionKey, versionData] of Object.entries(BIBLE_VERSIONS)) {
            const verses = normalizeVerses(versionKey, versionData);
            if (store._verses) {
                store._verses.push(...verses);
            }
        }
        console.log(`✓ Loaded ${Object.keys(BIBLE_VERSIONS).length} Bible versions (${store._verses?.length || 0} total verses)`);
        return true;
    } catch (error) {
        console.error('Failed to load Bible data:', error);
        return false;
    }
}

// Load sample documents (Word doc is available in Entities)
export async function loadDocuments(store) {
    try {
        const sampleDocs = [
            {
                id: 'doc-1',
                title: "Jesus' Words in the Gospels",
                description: 'A comprehensive collection of Jesus\' teachings and words as recorded in the Gospel accounts',
                file_url: JesusDoc,
                category: 'Reference',
                file_size: '2.5 MB'
            }
        ];
        
        if (store._documents) {
            store._documents.push(...sampleDocs);
        }
        console.log(`✓ Loaded ${sampleDocs.length} documents`);
        return true;
    } catch (error) {
        console.error('Failed to load documents:', error);
        return false;
    }
}

// Initialize all data
export async function initializeData(store) {
    await loadBibleData(store);
    await loadDocuments(store);
}
