import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { ComplaintType } from '../types';
import { ComplaintTypeAPI, type ComplaintTypeFilters } from '../api/complaint-types.api';

export const useDeleteComplaintType = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string | number) => ComplaintTypeAPI.deleteComplaintType(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['complaintTypes'] });
    },
    onError: (error: any) => {
      console.error(error);
    },
  });
};

export const useCreateComplaintType = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Partial<ComplaintType>) => ComplaintTypeAPI.createComplaintType(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['complaintTypes'] });
    },
    onError: (error: any) => {
      console.error(error);
    },
  });
};

export const useUpdateComplaintType = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string | number; payload: Partial<ComplaintType> }) =>
      ComplaintTypeAPI.updateComplaintType(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['complaintTypes'] });
    },
    onError: (error: any) => {
      console.error(error);
    },
  });
};

export const useToggleComplaintTypeStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string | number) =>
      ComplaintTypeAPI.toggleComplaintTypeStatus(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['complaintTypes'] });
    },
    onError: (error: any) => {
      console.error(error);
    },
  });
};

export const useGetComplaintTypeById = (id: string | number) => {
   return useQuery({
      queryKey: ["complaintType", id],
      queryFn: () => ComplaintTypeAPI.getComplaintTypeById(id),
      enabled: !!id,
    });
};

export const useGetComplaintTypes = (filters?: ComplaintTypeFilters) => {
   return useQuery({
      queryKey: ["complaintTypes", filters],
      queryFn: () => ComplaintTypeAPI.getComplaintTypes(filters),
    });
};
