
/*
 * textarea.js
 * Tiny textarea wrapper used in the (disabled) Import page. For large imports, consider streaming parsing.
 */

export function Textarea({ className = '', ...props }) {
    return <textarea className={`w-full border rounded px-3 py-2 ${className}`} {...props} />;
}

export default Textarea;
