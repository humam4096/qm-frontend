import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { LocationAPI, type LocationFilters } from "../api/locations.api";

export const useLocations = (filters: LocationFilters) => {
  return useQuery({
    queryKey: ["locations", filters],
    queryFn: () => LocationAPI.getLocations(filters),
  });
};

export const useCreateLocation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: LocationAPI.createLocation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["locations"] });
    },
  });
};

export const useUpdateLocation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: any) =>
      LocationAPI.updateLocation(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["locations"] });
    },
  });
};

export const useDeleteLocation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: LocationAPI.deleteLocation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["locations"] });
    },
  });
};

export const useToggleLocationStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string | number) => LocationAPI.toggleLocationState(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["locations"] });
    },
  });
};

export const useGetLocationById = (id: string | number) => {
  return useQuery({
    queryKey: ["location", id],
    queryFn: () => LocationAPI.getLocationById(id),
    enabled: !!id,
  });
};
