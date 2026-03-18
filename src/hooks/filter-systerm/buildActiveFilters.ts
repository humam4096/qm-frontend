import type { FilterValue } from "./useAdvancedFilters"

export function buildActiveFilters(filters: Record<string,FilterValue>, configs:any[]) {
  return Object.entries(filters).map(([key,value]) => {

    const config = configs.find(f => f.key === key)

    const option = config?.options?.find((o:any)=>o.value === value)

    return {
      key,
      value,
      label: `${config?.label}: ${option?.label ?? value}`
    }

  })
}