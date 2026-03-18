import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { BranchAPI, type BranchFilters } from "../api/branches.api";

export const useBranches = (filters: BranchFilters) => {
  return useQuery({
    queryKey: ["branches", filters],
    queryFn: () => BranchAPI.getBranches(filters),
  });
};

export const useBranchesList = () => {
  return useQuery({
    queryKey: ["branches-list"],
    queryFn: () => BranchAPI.getBranchesList(),
  });
};

export const useCreateBranch = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: BranchAPI.createBranch,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["branches"] });
    },
  });
};

export const useUpdateBranch = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: any) =>
      BranchAPI.updateBranch(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["branches"] });
    },
  });
};

export const useDeleteBranch = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: BranchAPI.deleteBranch,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["branches"] });
    },
  });
};

export const useToggleBranchStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string | number) => BranchAPI.toggleBranchState(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["branches"] });
    },
  });
};

export const useGetBranchById = (id: string | number) => {
   return useQuery({
      queryKey: ["branch" ,id],
      queryFn: () => BranchAPI.getBranchById(id),
      enabled: !!id,
    });
};
