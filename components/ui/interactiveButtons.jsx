
import { Button } from "@/components/ui/button"

export function DemoButton() {
  return (
    <Button
      variant="outline"
      className="px-8 py-6 text-lg border-2 hover:bg-gray-50"
      onClick={() => document.getElementById('demo-video').scrollIntoView({ behavior: 'smooth' })}
      aria-label="Watch demo video"
    >
      Watch Demo
    </Button>
  )
}

export function BackToTopButton() {
  return (
    <Button
      variant="outline"
      className="mt-4 border-gray-600 text-white hover:bg-gray-800 hover:text-white"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label="Back to top"
    >
      Back to Top
    </Button>
  )
}