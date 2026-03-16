import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ComplaintAPI, type ComplaintFilters } from "../api/complaints.api";

export const useComplaints = (filters: ComplaintFilters) => {
  return useQuery({
    queryKey: ["complaints", filters],
    queryFn: () => ComplaintAPI.getComplaints(filters),
  });
};

export const useCreateComplaint = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ComplaintAPI.createComplaint,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["complaints"] });
    },
  });
};

export const useUpdateComplaint = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: any) =>
      ComplaintAPI.updateComplaint(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["complaints"] });
    },
  });
};

export const useDeleteComplaint = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ComplaintAPI.deleteComplaint,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["complaints"] });
    },
  });
};

export const useGetComplaintById = (id: string) => {
   return useQuery({
      queryKey: ["complaint", id],
      queryFn: () => ComplaintAPI.getComplaintById(id),
      enabled: !!id,
    });
};
