import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { InspectionStage } from '../types';
import { InspectionStageAPI, type InspectionStageFilters } from '../api/inspection-stages.api';

export const useDeleteInspectionStage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string | number) => InspectionStageAPI.deleteInspectionStage(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inspection-stages'] });
    },
    onError: (error: any) => {
      console.error(error);
    },
  });
};

export const useCreateInspectionStage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Partial<InspectionStage>) => InspectionStageAPI.createInspectionStage(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inspection-stages'] });
    },
    onError: (error: any) => {
      console.error(error);
    },
  });
};

export const useUpdateInspectionStage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string | number; payload: Partial<InspectionStage> }) =>
      InspectionStageAPI.updateInspectionStage(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inspection-stages'] });
    },
    onError: (error: any) => {
      console.error(error);
    },
  });
};

export const useToggleInspectionStageStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string | number) =>
      InspectionStageAPI.toggleInspectionStageStatus(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inspection-stages'] });
    },
    onError: (error: any) => {
      console.error(error);
    },
  });
};

export const useGetInspectionStageById = (id: string | number) => {
   return useQuery({
      queryKey: ["inspection-stage", id],
      queryFn: () => InspectionStageAPI.getInspectionStageById(id),
      enabled: !!id,
    });
};

export const useGetInspectionStages = (filters?: InspectionStageFilters) => {
   return useQuery({
      queryKey: ["inspection-stages", filters],
      queryFn: () => InspectionStageAPI.getInspectionStages(filters),
    });
};

export const useGetInspectionStagesList = () => {
   return useQuery({
      queryKey: ["inspection-stages-list"],
      queryFn: () => InspectionStageAPI.getInspectionStagesList(),
    });
};
