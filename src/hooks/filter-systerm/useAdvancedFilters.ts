import { useMemo, useState } from "react"
import { useDebounce } from "@/hooks/useDebounce"

export type FilterValue = string | number | boolean

export function useAdvancedFilters() {
  const [searchTerm, setSearchTerm] = useState("")

  const [filters, setFilters] = useState<Record<string, FilterValue>>({})  
  const [page, setPage] = useState(1)

  const debouncedSearch = useDebounce(searchTerm, 500)

  const apiFilters = useMemo(() => ({
    search: debouncedSearch,
    page,
    ...filters,
  }), [debouncedSearch, page, filters]);

  const setFilter = (key: string, value: string | number | boolean | null) => {
    setFilters(prev => {
      const next = { ...prev }

      if (value === null || value === undefined || value === "") {
        delete next[key]
      } else {
        next[key] = value
      }

      return next
    })

    setPage(1)
  }

  const removeFilter = (key: string) => {
    setFilters(prev => {
      const next = { ...prev }
      delete next[key]
      return next
    })

    setPage(1)
  }

  const clearFilters = () => {
    setFilters({})
    setPage(1)
  }

  return {
    searchTerm,
    setSearchTerm,
    filters,
    setFilter,
    removeFilter,
    clearFilters,
    page,
    setPage,
    apiFilters,
  }
}