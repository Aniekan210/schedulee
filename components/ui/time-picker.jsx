import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Clock, ChevronUp, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export function TimePicker({ value, onChange, className, size = "default" }) {
  const [time, setTime] = useState("09:00");
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (value) setTime(value);
  }, [value]);

  const updateTime = (newTime) => {
    if (/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(newTime)) {
      setTime(newTime);
      onChange?.(newTime);
    }
  };

  const incrementHour = () => {
    let [h, m] = time.split(":").map(Number);
    h = (h + 1) % 24;
    updateTime(`${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`);
  };

  const decrementHour = () => {
    let [h, m] = time.split(":").map(Number);
    h = (h - 1 + 24) % 24;
    updateTime(`${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`);
  };

  const incrementMinute = () => {
    let [h, m] = time.split(":").map(Number);
    m += 5;
    if (m >= 60) {
      m = 0;
      h = (h + 1) % 24;
    }
    updateTime(`${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`);
  };

  const decrementMinute = () => {
    let [h, m] = time.split(":").map(Number);
    m -= 5;
    if (m < 0) {
      m = 55;
      h = (h - 1 + 24) % 24;
    }
    updateTime(`${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`);
  };

  const handleInputChange = (e) => {
    const val = e.target.value;
    if (val === "" || /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(val)) {
      updateTime(val);
    }
  };

  const formatDisplayTime = (t) => {
    const [h, m] = t.split(":").map(Number);
    const d = new Date();
    d.setHours(h, m);
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true });
  };

  const sizeClasses = {
    default: "w-[120px]",
    sm: "w-[100px] text-sm",
  };

  const buttonSizeClasses = {
    default: "h-8 w-8 p-0",
    sm: "h-6 w-6 p-0",
  };

  const inputSizeClasses = {
    default: "w-12",
    sm: "w-10 text-sm",
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "justify-start text-left font-normal",
            sizeClasses[size],
            !time && "text-muted-foreground",
            className
          )}
        >
          <Clock className="mr-2 h-4 w-4" />
          {time ? formatDisplayTime(time) : <span>Pick a time</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-auto p-0"
        align="start"
        onPointerDownOutside={(e) => {
          const isInsidePopover = e.target.closest('[role="dialog"]');
          if (!isInsidePopover) {
            setIsOpen(false);
          } else {
            e.preventDefault();
          }
        }}
      >
        <div 
          className="p-3 space-y-4"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-center gap-2">
            <div className="flex flex-col items-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  incrementHour();
                }}
                className={buttonSizeClasses[size]}
              >
                <ChevronUp className="h-4 w-4" />
              </Button>
              <Input
                type="text"
                value={time.split(":")[0]}
                readOnly
                className={cn("text-center", inputSizeClasses[size])}
                onClick={(e) => e.stopPropagation()}
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  decrementHour();
                }}
                className={buttonSizeClasses[size]}
              >
                <ChevronDown className="h-4 w-4" />
              </Button>
            </div>
            <span className="text-lg">:</span>
            <div className="flex flex-col items-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  incrementMinute();
                }}
                className={buttonSizeClasses[size]}
              >
                <ChevronUp className="h-4 w-4" />
              </Button>
              <Input
                type="text"
                value={time.split(":")[1]}
                readOnly
                className={cn("text-center", inputSizeClasses[size])}
                onClick={(e) => e.stopPropagation()}
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  decrementMinute();
                }}
                className={buttonSizeClasses[size]}
              >
                <ChevronDown className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <Input
            type="time"
            value={time}
            onChange={handleInputChange}
            step="300"
            className="w-full"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      </PopoverContent>
    </Popover>
  );
}