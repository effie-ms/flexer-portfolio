"use client";

import {useClickOutside} from "@/hooks/useClickOutside";
import clsx from "clsx";
import {ReactNode, useRef, useState} from "react";
import {InfiniteList} from "./InfiniteList";

interface DropdownProps<T> {
  options: T[];
  selectedKey: string | null;
  onChange: (key: string) => void;
  renderButton: (
    selected: T | null,
    isOpen: boolean,
    toggle: () => void
  ) => ReactNode;
  renderOption: (option: T, isSelected: boolean) => ReactNode;
  className?: string;
}

export function Dropdown<T extends {key: string}>({
  options,
  selectedKey,
  onChange,
  renderButton,
  renderOption,
  className,
}: DropdownProps<T>) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const selected = options.find((opt) => opt.key === selectedKey) || null;

  useClickOutside(ref, () => setOpen(false));

  const handleSelect = (key: string) => {
    onChange(key);
    setOpen(false);
  };

  return (
    <div
      ref={ref}
      className={clsx(
        "relative w-full transition-all duration-300 ease-in-out",
        className
      )}
    >
      {renderButton(selected, open, () => setOpen((prev) => !prev))}

      {open && (
        <div className="absolute top-full z-10 w-full mt-1 bg-white/10 text-white text-sm rounded-lg max-h-60 overflow-y-auto shadow-lg backdrop-blur-md flex flex-col">
          <InfiniteList
            items={options}
            renderItem={(option, idx) => (
              <div
                key={`${option.key}-${idx}`}
                className="px-3 py-2 cursor-pointer hover:bg-cyan-500/20 transition"
                onClick={() => handleSelect(option.key)}
              >
                {renderOption(option, option.key === selectedKey)}
              </div>
            )}
          />
        </div>
      )}
    </div>
  );
}
