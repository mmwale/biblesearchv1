
/*
 * select.js
 * Minimal select primitives used in forms and the Reader component. These are lightweight wrappers
 * for the real UI components you might swap in later (e.g. Radix UI or similar).
 */

export function Select({ children, value, onValueChange, className = '', ...props }) {
    // Render a native select if children are <option> elements; otherwise, pass through
    return (
        <div className={`inline-block ${className}`} {...props}>
            {children}
        </div>
    );
}

export function SelectTrigger({ children, className = '', ...props }) {
    return <div className={className} {...props}>{children}</div>;
}

export function SelectValue({ children, className = '', ...props }) {
    return <div className={className} {...props}>{children}</div>;
}

export function SelectContent({ children, className = '', ...props }) {
    return <div className={className} {...props}>{children}</div>;
}

export function SelectItem({ children, value, className = '', ...props }) {
    // For simplicity render a button that calls onClick when used in custom lists.
    return <div data-value={value} className={className} {...props}>{children}</div>;
}

export default Select;
