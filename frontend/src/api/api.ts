import axios from "axios";

const BASE_URL = 'https://vit-tm-task.api.trademarkia.app/api/v3/us';

export interface FilterOptions {
    owners?: string[],
    lawFirms?:string[],
    attorneys?:string[],
    status?:string[]
}

export const fetchTradeMarks = async (query: string, filters: FilterOptions) => {
    try {
        const response = await axios.post(
            BASE_URL,
            {
                input_query: query,
                input_query_type: '',
                sort_by: 'default',
                status: filters.status || [],
                exact_match: false,
                date_query:false,
                owners: filters.owners || [],
                attorneys: filters.attorneys || [],
                law_firms: filters.lawFirms || [],
                mark_description_description: [],
                classes: [],
                page: 1,
                rows: 10,
                sort_order: "desc",
                states:[],
                counties:[]
            },
            {
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
            }
        )

        return response.data;
    } catch (error) {
        console.error('Error fetching trademarks:', error)
        throw error;
    }
}