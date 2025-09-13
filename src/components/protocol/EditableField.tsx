import { useState } from "react";

interface EditableFieldProps {
    value: string;
    label?: string;
    onSave: (newValue: string) => Promise<void>;
    className?: string;
}

export default function EditableField({ value, label, onSave, className }: EditableFieldProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [inputValue, setInputValue] = useState(value);

    function handleDoubleClick() {
        setIsEditing(true);
    }

    async function handleBlur() {
        setIsEditing(false);
        if (inputValue !== value) {
            await onSave(inputValue);
        }
    }

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        setInputValue(e.target.value);
    }

    return (
        <span className={className}>
            {label && <span>{label} : </span>}
            {isEditing ? (
                <input
                    type="text"
                    value={inputValue}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    autoFocus
                    className="bg-transparent border-b border-gray-400"
                />
            ) : (
                <span onDoubleClick={handleDoubleClick} style={{ cursor: "pointer" }}>
                    {inputValue}
                </span>
            )}
        </span>
    );
}