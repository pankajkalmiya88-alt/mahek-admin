'use client';

import { useState } from 'react';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from '@/components/ui/command';
import { cn } from '@/lib/utils';

interface OptionType {
  id: string | number;
  label: string;
}

interface SearchableSelectProps {
  options: OptionType[];
  value: string | number | null;
  onChange: (val: string | number) => void;
  placeholder?: string;
  inputClassName?: string;
  disabled?: boolean;
}

export default function SearchableSelect({
  options,
  value,
  onChange,
  placeholder = 'Select value',
  inputClassName,
  disabled,
}: SearchableSelectProps) {
  const [open, setOpen] = useState(false);

  const selectedLabel = value ? options.find((item) => item.id === value)?.label : '';

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          disabled={disabled}
          className={cn(
            'w-full flex justify-between items-center border px-3 py-2 rounded-md cursor-pointer disabled:opacity-50',
            inputClassName,
          )}
        >
          {selectedLabel || placeholder}
        </button>
      </PopoverTrigger>

      <PopoverContent
        forceMount
        side="bottom"
        align="start"
        className="p-0 w-[var(--radix-popover-trigger-width"
      >
        <Command>
          <CommandInput placeholder="Search..." />

          <CommandList>
            <CommandEmpty>No option found.</CommandEmpty>

            <CommandGroup>
              {options.map((item) => (
                <CommandItem
                  key={item.id}
                  onSelect={() => {
                    onChange(item.id);
                    setOpen(false);
                  }}
                >
                  {item.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
