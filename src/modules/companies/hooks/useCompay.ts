import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { Company } from '../types';
import { CompanyAPI, type CompanyFilters } from '../api/company.api';

export const useDeleteCompany = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string | number) => CompanyAPI.deleteCompany(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companies'] });
    },
    onError: (error: any) => {
      console.error(error);
    },
  });
};


export const useCreateCompany = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Partial<Company>) => CompanyAPI.createCompany(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companies'] });
    },
    onError: (error: any) => {
      console.error(error);
    },
  });
};

export const useUpdateCompany = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string | number; payload: Partial<Company> }) =>
      CompanyAPI.updateCompany(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companies'] });
    },
    onError: (error: any) => {
      console.error(error);
    },
  });
};

export const useToggleCompanyStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string | number) =>
      CompanyAPI.toggleCompanyStatus(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companies'] });
    },
    onError: (error: any) => {
      console.error(error);
    },
  });
};

export const useGetCompanyById = (id: string | number) => {
   return useQuery({
      queryKey: ["company" ,id],
      queryFn: () => CompanyAPI.getCompanyById(id),
      enabled: !!id,
    });
};

export const useGetCompanies = (filters?: CompanyFilters) => {
   return useQuery({
      queryKey: ["companies", filters],
      queryFn: () => CompanyAPI.getCompanies(filters),
    });
};
