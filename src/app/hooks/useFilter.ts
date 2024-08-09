import { useCallback, useEffect, useState } from "react";

export interface Filter {
    [name: string]: string | string[];
}
  
export interface Search {
    query: string;
    fields: string[];
}

  
export interface HookParams<Item> {
    data: Item[];
    filters?: Filter;
    search?: Search;
}

export function useFilter<Item extends Record<string, unknown>>({ data, search, filters }: HookParams<Item>) {
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<Record<string, unknown>[]>(data);

    const filter = useCallback(() => {
        return data.filter((item: Item) => {
            
            return item["name"].toLowerCase().includes(search.query.toLowerCase())
        });
    }, [data,search.query]);

    useEffect(() => {
        setLoading(true)
        setResult(filter())
        setLoading(false);
    }, [filter])


    return { loading, data: result }
}