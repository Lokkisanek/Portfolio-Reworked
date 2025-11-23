'use client';

import { useEdit } from '@/context/EditContext';
import { useEffect, useRef, useState } from 'react';

interface EditableTextProps {
    section: string;
    field: string;
    index?: number; // For array items
    className?: string;
    as?: 'h1' | 'h2' | 'h3' | 'p' | 'span' | 'div';
    multiline?: boolean;
}

export default function EditableText({ section, field, index, className, as: Tag = 'p', multiline = false }: EditableTextProps) {
    const { isEditing, content, updateField, updateArrayItem } = useEdit();
    const [localValue, setLocalValue] = useState('');

    // Determine the current value from content
    useEffect(() => {
        if (index !== undefined) {
            setLocalValue(content[section][index][field]);
        } else {
            setLocalValue(content[section][field]);
        }
    }, [content, section, field, index]);

    const handleChange = (e: any) => {
        const newValue = e.target.innerText; // Use innerText to avoid HTML injection issues
        if (index !== undefined) {
            updateArrayItem(section, index, field, newValue);
        } else {
            updateField(section, field, newValue);
        }
    };

    if (!isEditing) {
        return <Tag className={className}>{localValue}</Tag>;
    }

    return (
        <Tag
            contentEditable
            suppressContentEditableWarning
            onBlur={handleChange}
            className={`${className} outline-none border-b border-dashed border-blue-500 hover:bg-white/10 transition cursor-text`}
        >
            {localValue}
        </Tag>
    );
}
