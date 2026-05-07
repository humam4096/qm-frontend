import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

export const TRANSLATABLE_ROLES_DATA = [
  {
    id: 'system_manager',
    translationKey: 'users.systemManager',
  },
  {
    id: 'quality_manager',
    translationKey: 'users.qualityManager',
  },
  {
    id: 'project_manager',
    translationKey: 'users.projectManager',
  },
  {
    id: 'quality_supervisor',
    translationKey: 'users.qualitySupervisor',
  },
  {
    id: 'quality_inspector',
    translationKey: 'users.qualityInspector',
  },
  {
    id: 'catering_manager',
    translationKey: 'users.cateringManager',
  },
]


export const useRolesData = () => {
  const { t } = useTranslation()

  return useMemo(() => {
    return TRANSLATABLE_ROLES_DATA.map((role) => ({
      id: role.id,
      name: t(role.translationKey),
    }))
  }, [t])
}