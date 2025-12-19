/*
 * button.js
 * Simple Button primitive used across the app. Supports `asChild` for wrapping anchor links or other elements.
 * - `asChild` allows using native anchors inside the Button without extra wrapper markup.
 */
import React from 'react';

export const Button = React.forwardRef(({ children, asChild, className = '', variant, size, ...props }, ref) => {
    const Tag = asChild ? React.Fragment : 'button';
    const base = 'inline-flex items-center gap-2 rounded-full px-3 py-2 transition';
    const classes = `${base} ${className}`;
    if (Tag === React.Fragment) {
        return <>{children}</>;
    }
    return (
        <button ref={ref} className={classes} {...props}>
            {children}
        </button>
    );
});

export default Button;
