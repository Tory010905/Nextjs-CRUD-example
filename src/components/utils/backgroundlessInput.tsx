"use client"
import React, { useRef } from 'react';

interface BackgroundlessInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
}

export const BackgroundlessInput = (props : BackgroundlessInputProps) => {
    const ref = useRef<HTMLInputElement>(null);

    return (
        <input
            ref={ref}
            onKeyDown={(e) => {
                if(e.key === "Enter" || e.key === "Escape"){
                    ref.current?.blur();
                }
            }}
            {...props}
        />
    )
}