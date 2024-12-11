import { Button } from "@/components/ui/button"
import { ChefHat } from 'lucide-react'
import { Link } from "react-router-dom"

export function SuggestionButton() {
  return (
    <Button
      asChild
      className="fixed bottom-20 right-4 rounded-full shadow-lg w-16 h-16 md:hidden"
      size="icon"
    >
      <Link to="/recipe" aria-label="料理提案" className="flex items-center justify-center">
        <ChefHat className="h-8 w-8" />
      </Link>
    </Button>
  )
}

