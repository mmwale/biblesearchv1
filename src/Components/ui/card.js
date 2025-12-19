
/*
 * card.js
 * Simple collection of Card primitives (Card, CardHeader, CardContent, CardTitle) used for layout blocks.
 * These are intentionally minimal and focus on composition via className.
 */
export function Card({ children, className = '', ...props }) {
    return (
        <div className={`rounded-lg bg-white ${className}`} {...props}>
            {children}
        </div>
    );
}

export function CardHeader({ children, className = '', ...props }) {
    return (
        <div className={`p-4 border-b ${className}`} {...props}>{children}</div>
    );
}

export function CardContent({ children, className = '', ...props }) {
    return (
        <div className={`p-4 ${className}`} {...props}>{children}</div>
    );
}

export function CardTitle({ children, className = '', ...props }) {
    return (
        <h3 className={`text-lg font-semibold ${className}`} {...props}>{children}</h3>
    );
}

export default Card;
