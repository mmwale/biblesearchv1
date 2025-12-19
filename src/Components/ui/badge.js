
/*
 * badge.js
 * Tiny badge/pill component used to present versions or categories inline.
 * Keep it lightweight and styled via utility classes.
 */
export function Badge({ children, className = '', variant, ...props }) {
    return (
        <span className={`inline-flex items-center px-2 py-0.5 rounded ${className}`} {...props}>{children}</span>
    );
}

export default Badge;
