"use client";

import { useState, useTransition, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Plus, Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { addInventoryItem } from "@/actions/inventory";
import { toast } from "sonner";

const UNITS = [
  { value: "g", label: "Grams (g)", keywords: ["grams", "g"] },
  {
    value: "kg",
    label: "Kilograms (kg)",
    keywords: ["kilograms", "kg", "kilo"],
  },
  {
    value: "ml",
    label: "Milliliters (ml)",
    keywords: ["milliliters", "ml"],
  },
  {
    value: "L",
    label: "Liters (L)",
    keywords: ["liters", "L", "litres"],
  },
  {
    value: "pcs",
    label: "Pieces (pcs)",
    keywords: ["pieces", "pcs", "pc"],
  },
  { value: "oz", label: "Ounces (oz)", keywords: ["ounces", "oz"] },
  {
    value: "lb",
    label: "Pounds (lb)",
    keywords: ["pounds", "lbs"],
  },
  { value: "cup", label: "Cups", keywords: ["cups", "cup"] },
  {
    value: "tbsp",
    label: "Tablespoons (tbsp)",
    keywords: ["tablespoons", "tbsp"],
  },
  {
    value: "tsp",
    label: "Teaspoons (tsp)",
    keywords: ["teaspoons", "tsp"],
  },
  { value: "pack", label: "Packs", keywords: ["packs", "pack"] },
  { value: "box", label: "Boxes", keywords: ["boxes", "box"] },
  { value: "bottle", label: "Bottles", keywords: ["bottles", "bottle"] },
  { value: "can", label: "Cans", keywords: ["cans", "can"] },
  { value: "bag", label: "Bags", keywords: ["bags", "bag"] },
  { value: "roll", label: "Rolls", keywords: ["rolls", "roll"] },
  { value: "sheet", label: "Sheets", keywords: ["sheets", "sheet"] },
];

type FormData = {
  name: string;
  category: string;
  supplier: string;
  purchaseCost: string;
  purchaseQuantity: string;
  unit: string;
};

const initialFormData: FormData = {
  name: "",
  category: "",
  supplier: "",
  purchaseCost: "",
  purchaseQuantity: "",
  unit: "",
};

export function AddInventoryDialog() {
  const [open, setOpen] = useState(false);
  const [unitOpen, setUnitOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [formData, setFormData] = useState<FormData>(initialFormData);

  const unitCostPreview = useMemo(() => {
    const cost = parseFloat(formData.purchaseCost);
    const qty = parseFloat(formData.purchaseQuantity);
    if (isNaN(cost) || isNaN(qty) || qty === 0) return "—";
    const unitCost = cost / qty;
    return unitCost.toLocaleString(undefined, { maximumFractionDigits: 4 });
  }, [formData.purchaseCost, formData.purchaseQuantity]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.category ||
      !formData.purchaseCost ||
      !formData.purchaseQuantity ||
      !formData.unit
    ) {
      toast.error("Please fill in all required fields.");
      return;
    }

    startTransition(async () => {
      try {
        await addInventoryItem({
          name: formData.name,
          category: formData.category,
          supplier: formData.supplier || undefined,
          purchaseCost: formData.purchaseCost,
          purchaseQuantity: formData.purchaseQuantity,
          unit: formData.unit,
        });
        toast.success("Item added successfully!");
        setFormData(initialFormData);
        setOpen(false);
      } catch {
        toast.error("Failed to add item. Please try again.");
      }
    });
  };

  const updateField = <K extends keyof FormData>(
    field: K,
    value: FormData[K],
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Item
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add Inventory Item</DialogTitle>
          <DialogDescription>
            Add a new item to your inventory. Unit cost will be calculated
            automatically.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name *
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => updateField("name", e.target.value)}
                className="col-span-3"
                placeholder="Item name"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="category" className="text-right">
                Category *
              </Label>
              <Select
                value={formData.category}
                onValueChange={(v) => updateField("category", v)}
              >
                <SelectTrigger className="col-span-3 w-full">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="food">Food</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="supplier" className="text-right">
                Supplier
              </Label>
              <Input
                id="supplier"
                value={formData.supplier}
                onChange={(e) => updateField("supplier", e.target.value)}
                className="col-span-3"
                placeholder="Supplier name"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="purchaseCost" className="text-right">
                Purchase Cost *
              </Label>
              <div className="col-span-3 flex items-center gap-2">
                <Input
                  id="purchaseCost"
                  type="number"
                  step="any"
                  value={formData.purchaseCost}
                  onChange={(e) => updateField("purchaseCost", e.target.value)}
                  placeholder="0.00"
                />
              </div>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="purchaseQuantity" className="text-right">
                Purchase Qty *
              </Label>
              <Input
                id="purchaseQuantity"
                type="number"
                step="any"
                value={formData.purchaseQuantity}
                onChange={(e) =>
                  updateField("purchaseQuantity", e.target.value)
                }
                className="col-span-3"
                placeholder="0"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Unit *</Label>
              <Popover open={unitOpen} onOpenChange={setUnitOpen} modal={true}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={unitOpen}
                    className="col-span-3 justify-between"
                  >
                    {formData.unit
                      ? (UNITS.find((u) => u.value === formData.unit)?.label ??
                        formData.unit)
                      : "Select unit..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[300px] p-0">
                  <Command>
                    <CommandInput placeholder="Search unit..." />
                    <CommandList>
                      <CommandEmpty>No unit found.</CommandEmpty>
                      <CommandGroup>
                        {UNITS.map((unit) => (
                          <CommandItem
                            key={unit.value}
                            value={unit.value}
                            keywords={unit.keywords}
                            onSelect={(currentValue) => {
                              updateField(
                                "unit",
                                currentValue === formData.unit
                                  ? ""
                                  : currentValue,
                              );
                              setUnitOpen(false);
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                formData.unit === unit.value
                                  ? "opacity-100"
                                  : "opacity-0",
                              )}
                            />
                            {unit.label}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-muted-foreground text-right">
                Unit Cost
              </Label>
              <div className="text-muted-foreground col-span-3 text-sm">
                {unitCostPreview} {formData.unit && `per ${formData.unit}`}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Adding..." : "Add Item"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
