/*
 * Purpose: Provide a tiny, synchronous data surface for the app without network requests.
 * - `_store` contains `_verses` and `_documents` populated at module load by `dataLoader`.
 * - The `matchesFilter` function intentionally keeps filtering simple.
 */

import { initializeData } from './dataLoader';

export const _store = {
    _verses: [],
    _documents: []
};

// Simple, synchronous filter matcher used by the stubbed API methods.
// NOTE: This intentionally keeps the logic simple and does not support nested/complex queries.
function matchesFilter(item, filter) {
    for (const key of Object.keys(filter || {})) {
        const val = filter[key];
        if (val == null) continue;
        if (typeof val === 'object') {
            // not supporting complex queries in stub
            continue;
        }
        if (String(item[key]) !== String(val)) return false;
    }
    return true;
}

export const base44 = {
    entities: {
        BibleVerse: {
            // filter({version, book, chapter}) => Promise<array>
            filter: async (filter = {}) => {
                if (!filter || Object.keys(filter).length === 0) {
                    return Array.from(_store._verses);
                }
                return _store._verses.filter(v => matchesFilter(v, filter));
            },
            // bulkCreate(array) => Promise<array>
            bulkCreate: async (items = []) => {
                const created = items.map((it, i) => ({ ...it, id: `${Date.now()}-${_store._verses.length + i}` }));
                _store._verses.push(...created);
                return created;
            }
        },
        Document: {
            // list(order) => Promise<array>
            list: async (_order) => {
                return Array.from(_store._documents);
            }
        }
    }
};

// Initialize data on module load
initializeData(_store).catch(err => console.error('Data initialization failed:', err));

export default base44;
