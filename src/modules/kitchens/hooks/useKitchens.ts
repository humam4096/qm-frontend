import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { KitchenAPI, type KitchenFilters } from "../api/kitchens.api";

export const useKitchens = (filters: KitchenFilters) => {
  return useQuery({
    queryKey: ["kitchens", filters],
    queryFn: () => KitchenAPI.getKitchens(filters),
  });
};

export const useKitchensList = () => {
  return useQuery({
    queryKey: ["kitchensList"],
    queryFn: () => KitchenAPI.getKitchensList(),
  });
};


export const useGetKitchenById = (id: string | number) => {
  return useQuery({
    queryKey: ["kitchen", id],
    queryFn: () => KitchenAPI.getKitchenById(id),
    enabled: !!id,
  });
};

export const useGetKitchenContracts = (id: string | number) => {
  return useQuery({
    queryKey: ["kitchen", id, "contracts"],
    queryFn: () => KitchenAPI.getKitchenContracts(id),
    enabled: !!id,
  });
};

export const useGetKitchenContractTimes = (id: string | number) => {
  return useQuery({
    queryKey: ["kitchen", id, "contract-times"],
    queryFn: () => KitchenAPI.getKitchenContractTimes(id),
    enabled: !!id,
  });
};

export const useCreateKitchen = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: KitchenAPI.createKitchen,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["kitchens"] });
    },
  });
};

export const useUpdateKitchen = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: any) =>
      KitchenAPI.updateKitchen(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["kitchens"] });
    },
  });
};

export const useDeleteKitchen = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: KitchenAPI.deleteKitchen,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["kitchens"] });
    },
  });
};

export const useToggleKitchenStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string | number) => KitchenAPI.toggleKitchenState(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["kitchens"] });
    },
  });
};
