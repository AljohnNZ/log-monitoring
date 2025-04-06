'use client'
import React, { useState, useEffect } from 'react';
import { getTypes } from '@/lib/api';

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

interface TypesDropdownProps {
    cluster: string;
    onSelect: (type: string) => void;
    disabled?: boolean;
}

const TypesDropdown: React.FC<TypesDropdownProps> = ({ cluster, onSelect, disabled = false }) => {
    const [types, setTypes] = useState<string[]>([]);
    const [selectedType, setSelectedType] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        setSelectedType('');
        onSelect('');
        
        if (cluster) {
            setIsLoading(true);
            const fetchTypes = async () => {
                try {
                    const data = await getTypes(cluster);
                    setTypes(data);
                } catch (error) {
                    console.error("Failed to fetch types:", error);
                    setTypes([]);
                } finally {
                    setIsLoading(false);
                }
            };
            fetchTypes();
        } else {
            setTypes([]);
        }
    }, [cluster, onSelect]);

    const handleChange = (type: string) => {
        setSelectedType(type);
        onSelect(type);
    };

    return (
        <Select 
            value={selectedType} 
            onValueChange={handleChange}
            disabled={disabled || isLoading || !cluster}
        >
            <SelectTrigger id="type" className="w-40">
                <SelectValue placeholder={isLoading ? "Loading..." : "Select a type"} />
            </SelectTrigger>
            <SelectContent position="popper">
                {types.length > 0 ? (
                    types.map((type) => (
                        <SelectItem key={type} value={type}>
                            {type}
                        </SelectItem>
                    ))
                ) : (
                    <SelectItem value="no-types" disabled>
                        {isLoading ? "Loading..." : "No types available"}
                    </SelectItem>
                )}
            </SelectContent>
        </Select>
    );
};

export default TypesDropdown;