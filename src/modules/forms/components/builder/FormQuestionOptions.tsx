import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { FormQuestionOption } from '../../types'
import { Button } from '@/components/ui/button'
import { useFormBuilderContext } from '../../context/FormBuilderContext'

export default function FormQuestionOptions({ question, sectionId }: { question: any; sectionId: string }) {
    const { updateOption, removeOption, addOption } = useFormBuilderContext();
  return (
     <div className="transition-all duration-200 ease-in-out">
          <div className="space-y-2 mt-3">
            <Label>Options</Label>

            {question.options.map((opt: FormQuestionOption) => (
              <div key={opt.id} className="flex gap-2 items-center">
                <Input
                  value={opt.option}
                  onChange={(e) =>
                    updateOption(sectionId, question.id, opt.id, {
                      option: e.target.value,
                    })
                  }
                  placeholder="Option text"
                />

                <Input
                  type="number"
                  value={opt.weight}
                  onChange={(e) =>
                    updateOption(sectionId, question.id, opt.id, {
                      weight: Number(e.target.value),
                    })
                  }
                  className="w-24"
                />

                <Button
                  type="button"
                  variant="ghost"
                  onClick={() =>
                    removeOption(sectionId, question.id, opt.id)
                  }
                >
                  ✕
                </Button>
              </div>
            ))}

            <Button
              type="button"
              size="sm"
              onClick={() => addOption(sectionId, question.id)}
            >
              + Add Option
            </Button>
          </div>
      </div>
  )
}
