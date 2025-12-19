/*
 * input.js
 * Basic input wrapper that forwards refs and accepts additional classes.
 * Keep inputs simple and rely on utility classes for styling.
 */
import React from 'react';

export const Input = React.forwardRef(({ className = '', ...props }, ref) => {
    return (
        <input ref={ref} className={`border rounded px-3 py-2 ${className}`} {...props} />
    );
});

export default Input;
