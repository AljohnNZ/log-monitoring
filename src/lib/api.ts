import axios from 'axios';

export interface Log {
    count: any;
    id: string;
    timestamp: string;
    event_id: string;
    cluster: string;
    type: string;
    message: string;
    duration: number;
    notes: string;
}

export interface LogsPerDay {
    count: any;
    d: string;
}

export interface LogsPerHour {
    count: any;
    d: string;
}

export interface LogsCountsPerQuery {
    count: any;
    d: string;
}

export const getClusters = async (): Promise<string[]> => {
    const response = await axios.get('/api/clusters');
    return response.data;
};

export const getTypes = async (cluster: string): Promise<string[]> => {
    const response = await axios.get(`/api/clusters/${cluster}/types`);
    return response.data;
};

export const getLogs = async (
    cluster: string,
    type: string,
    minDuration: number, 
    limit: number,
    offset: number,
): Promise<{ offset: number; count: number; logs: Log[]}> => {
    const response = await axios.get(`/api/clusters/${cluster}/types/${type}/logs`, {
        params: { minDuration, offset, limit },
    });
    return response.data;
};

export const getLogsCountPerDay = async (
    cluster: string,
    type: string,
): Promise<{ countPerDay: LogsPerDay[] }> => {
    const response = await axios.get(`/api/clusters/${cluster}/types/${type}/count-per-day`);
    return response.data;
};

export const getLogsCountPerHour = async (
    cluster: string,
    type: string,
): Promise<{ countPerHour: LogsPerHour[] }> => {
    const response = await axios.get(`/api/clusters/${cluster}/types/${type}/count-per-hour`);
    return response.data;
};

export const getLogsCountPerQuery = async (
    cluster: string,
    type: string,
): Promise<{ countPerQuery: LogsCountsPerQuery[] }> => {
    const response = await axios.get(`/api/clusters/${cluster}/types/${type}/count-per-query`);
    return response.data;
};