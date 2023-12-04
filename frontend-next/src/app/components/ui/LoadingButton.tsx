import { Loader2 } from "lucide-react"

import { Button } from "@/app/components/ui/button"

export function LoadingButton() {
  return (
    <Button disabled>
      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      Please wait
    </Button>
  )
}
