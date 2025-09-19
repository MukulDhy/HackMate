import * as React from "react"
import { ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface FilterOption {
  value: string
  label: string
  count?: number
}

interface FilterSelectProps {
  title: string
  options: FilterOption[]
  selectedValues: string[]
  onSelectionChange: (values: string[]) => void
  placeholder?: string
}

export function FilterSelect({
  title,
  options,
  selectedValues,
  onSelectionChange,
  placeholder = "Select options..."
}: FilterSelectProps) {
  const handleCheckedChange = (value: string, checked: boolean) => {
    if (checked) {
      onSelectionChange([...selectedValues, value])
    } else {
      onSelectionChange(selectedValues.filter(v => v !== value))
    }
  }

  const selectedCount = selectedValues.length

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="glass" className="justify-between min-w-[140px]">
          <span className="flex items-center gap-2">
            {title}
            {selectedCount > 0 && (
              <Badge variant="secondary" className="text-xs">
                {selectedCount}
              </Badge>
            )}
          </span>
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 glass-card border-glass-border">
        <DropdownMenuLabel>{title}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {options.map((option) => (
          <DropdownMenuCheckboxItem
            key={option.value}
            checked={selectedValues.includes(option.value)}
            onCheckedChange={(checked) => handleCheckedChange(option.value, checked)}
            className="flex items-center justify-between"
          >
            <span>{option.label}</span>
            {option.count && (
              <Badge variant="outline" className="text-xs ml-2">
                {option.count}
              </Badge>
            )}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}