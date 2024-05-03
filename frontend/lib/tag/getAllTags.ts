import { Tag } from "@/types";
import { getApiKey } from "../auth/action";
import useSWR from "swr";
import { endpoint } from "@/constants";

const fetcher = async (url: string) => {
    const token = await getApiKey();
    return fetch(url, {
        headers: {
            accept: "application/json",
            Authorization: `Bearer ${token}`,
        },
    })
        .then((res) => {
            return res.json();
        })
        .then((json) => {
            return {
                data: json.data,
            };
        });
};

export default function getAllTags() {
    const { data, error, isLoading, mutate } = useSWR(
        `${endpoint}/tag`,
        fetcher
    );

    return {
        tags: data,
        isLoading,
        isError: error,
        mutate: mutate,
    };
}