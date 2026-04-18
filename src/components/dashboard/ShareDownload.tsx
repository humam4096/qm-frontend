import React from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '../ui/button'
import { handleDownload, handleShare } from '@/modules/report-daily/utils/utils'
import { DownloadIcon, Share2Icon } from 'lucide-react'

type Props = {
  reportRef: React.RefObject<HTMLDivElement | null>
}

export default function ShareDownload({reportRef}: Props) {
  const { t } = useTranslation();

  return (
    <div className='flex gap-2'>
      <Button
        onClick={() => handleShare(reportRef)}
        className="flex items-center gap-2 px-3 py-1.5 text-sm rounded-lg border hover:bg-muted"
      >
        <Share2Icon className='w-4 h-4 transition-transform group-hover:scale-110'/>
        {t('common.share')}
      </Button>
      <Button
        onClick={() => handleDownload(reportRef)}
        className="flex items-center gap-2 px-3 py-1.5 text-sm rounded-lg bg-primary text-white"
      >
        <DownloadIcon className='w-4 h-4 transition-transform group-hover:scale-110'/>
        {t('common.download')}
      </Button>
    </div>

  )
}
