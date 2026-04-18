type  Props = {
  content: string;
  title: string;
}

export default function ContentText({ content, title}: Props) {
  return (
    <div className="rounded-lg border bg-muted/30 p-4 space-y-2">
      <p className="text-sm font-medium">
        {title}
      </p>

      <p className="text-sm text-muted-foreground leading-relaxed">
        {content}
      </p>
    </div>
    // <div className="rounded-lg border border-amber-200 bg-amber-50 dark:bg-amber-900/10 p-4 space-y-2">
    //   <p className="text-sm font-medium text-amber-700 dark:text-amber-400">
    //     Confirm Approval
    //   </p>

    //   <p className="text-sm text-muted-foreground leading-relaxed">
    //     Approving this report will submit it to the company account and finalize its status. 
    //     You may not be able to make changes afterward.
    //   </p>
    // </div>
  )
}
