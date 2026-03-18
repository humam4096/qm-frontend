import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ZoneAPI, type ZoneFilters } from "../api/zones.api";

export const useZones = (filters: ZoneFilters) => {
  return useQuery({
    queryKey: ["zones", filters],
    queryFn: () => ZoneAPI.getZones(filters),
  });
};

export const useZonesList = () => {
  return useQuery({
    queryKey: ["zones-list"],
    queryFn: () => ZoneAPI.getZonesList(),
  });
};

export const useCreateZone = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ZoneAPI.createZone,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["zones"] });
    },
  });
};

export const useUpdateZone = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: any) =>
      ZoneAPI.updateZone(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["zones"] });
    },
  });
};

export const useDeleteZone = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string | number) => ZoneAPI.deleteZone(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["zones"] });
    },
  });
};

export const useToggleZoneStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string | number) => ZoneAPI.toggleZoneState(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["zones"] });
    },
  });
};

export const useGetZoneById = (id: string | number) => {
  return useQuery({
    queryKey: ["zone", id],
    queryFn: () => ZoneAPI.getZoneById(id),
    enabled: !!id,
  });
};
