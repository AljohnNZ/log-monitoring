'use client'
import React, { useState, useEffect } from 'react';
import { getClusters } from '@/lib/api';

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

interface ClustersDropdownProps {
    onSelect: (cluster: string) => void;
}

const ClustersDropdown: React.FC<ClustersDropdownProps> = ({ onSelect }) => {
    const [clusters, setClusters] = useState<string[]>([]);
    const [selectedCluster, setSelectedCluster] = useState<string>('');

    useEffect(() => {
        const fetchClusters = async () => {
            const data = await getClusters();
            setClusters(data);
        };
        fetchClusters();
    }, []);

    const handleChange = (value: string) => {
        setSelectedCluster(value);
        onSelect(value);
    };

    return (
        <div className="flex flex-col space-y-1.5">
            <Select 
                value={selectedCluster} 
                onValueChange={handleChange}
            >
                <SelectTrigger id="cluster">
                    <SelectValue placeholder="Select a cluster" />
                </SelectTrigger>
                <SelectContent position="popper">
                    {clusters.map((cluster) => (
                        <SelectItem key={cluster} value={cluster}>
                            {cluster}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
};

export default ClustersDropdown;