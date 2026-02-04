import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { showError, showSuccess } from "@/utility/utility";
import { getSeoPageData } from "@/http/Services/all";

export const useGetSeoPage = (id: string) => {
  const query = useQuery({
    queryKey: ["getSeoPageDetails", id],
    queryFn: () => getSeoPageData(id),
    enabled: !!id,
    retry: false,
  });

  useEffect(() => {
    if (query.isSuccess && query.data) {
      showSuccess("Page loaded successfully");
      console.log("SUCCESS:", query.data);
    }
  }, [query.isSuccess, query.data]);

  useEffect(() => {
    if (query.isError && query.error) {
      const msg = (query.error as any)?.response?.data?.message || "Failed to load page!";
      showError(msg);
      console.log("ERROR:", msg);
    }
  }, [query.isError, query.error]);

  return query;
};
