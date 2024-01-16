"use client";

import { useEffect, useState } from "react";

import { CheckIcon } from "@radix-ui/react-icons";
import { useCookies } from "next-client-cookies";
import { useTheme } from "next-themes";

import {
  possibleThemeConfigRadiusValues,
  useThemeConfig,
} from "@/hooks/use-theme-config";
import { themes } from "@/lib/themes";
import { entries, groupBy } from "@/lib/utils";
import { cn } from "@/lib/utils";
import {
  DEFAULT_FONT_KEY,
  FONT_COOKIE_NAME,
  FONT_MAP,
  FONT_TYPES,
} from "@/styles/fonts";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/components/ui/use-toast";

function FontCustomizer() {
  const cookies = useCookies();

  const defaultFontValue: string =
    cookies.get(FONT_COOKIE_NAME) || DEFAULT_FONT_KEY;

  function onFontValueChange(value: string) {
    // validate font
    if (!Object.keys(FONT_MAP).includes(value)) {
      throw new Error("Invalid font");
    }

    // set font cookie and refresh the page
    cookies.set(FONT_COOKIE_NAME, value);
    window.location.reload();
    toast({ title: "Font updated" });
  }

  return (
    <Select
      required
      onValueChange={onFontValueChange}
      defaultValue={defaultFontValue}
    >
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder="Select a font" />
      </SelectTrigger>

      <SelectContent
        className="!max-h-[300px] overflow-y-auto"
        style={{ maxHeight: "300px" }}
      >
        {entries(
          groupBy(entries(FONT_MAP), ([_, { type }]) => FONT_TYPES[type].label),
        ).map(([key, values]) => (
          <SelectGroup key={key}>
            <SelectLabel className="text-center font-bold">{key}</SelectLabel>
            {values
              .sort(([_, { label: labelA }], [__, { label: labelB }]) =>
                labelA.localeCompare(labelB),
              )
              .map(([key, { label }]) => (
                <SelectItem key={key} value={key}>
                  {label}
                </SelectItem>
              ))}
          </SelectGroup>
        ))}
      </SelectContent>
    </Select>
  );
}

export function ThemeCustomizer() {
  const [mounted, setMounted] = useState<boolean>(false);
  const [themeConfig, setThemeConfig] = useThemeConfig();
  const { setTheme: setMode, resolvedTheme: mode } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="flex flex-1 flex-col space-y-4 md:space-y-6">
      <div className="space-y-2">
        <Label>Font</Label>
        <FontCustomizer />
      </div>

      <div className="space-y-2">
        <Label>Color</Label>
        <div className="grid grid-cols-4 gap-2">
          {themes.map((theme) => {
            const isActive = themeConfig.theme === theme.name;

            return mounted ? (
              <Button
                variant="outline"
                size="sm"
                key={theme.name}
                onClick={() => {
                  setThemeConfig({
                    ...themeConfig,
                    theme: theme.name,
                  });
                }}
                className={cn("justify-start", {
                  "border-2 border-primary": isActive,
                })}
                style={
                  {
                    "--theme-primary": `hsl(${
                      theme.activeColor[mode === "dark" ? "dark" : "light"]
                    })`,
                  } as React.CSSProperties
                }
              >
                <span
                  className={cn(
                    "mr-1 flex h-5 w-5 shrink-0 -translate-x-1 items-center justify-center rounded-full bg-[--theme-primary]",
                  )}
                >
                  {isActive && <CheckIcon className="h-4 w-4 text-white" />}
                </span>

                {theme.label}
              </Button>
            ) : (
              <Skeleton className="h-8 w-full" key={theme.name} />
            );
          })}
        </div>
      </div>

      <div className="space-y-2">
        <Label>Radius</Label>
        <div className="grid grid-cols-6 gap-2">
          {possibleThemeConfigRadiusValues.map((value) => {
            return (
              <Button
                variant="outline"
                size="sm"
                key={value}
                onClick={() => {
                  setThemeConfig({
                    ...themeConfig,
                    radius: value,
                  });
                }}
                className={cn({
                  "border-2 border-primary": themeConfig.radius === value,
                })}
              >
                {value}
              </Button>
            );
          })}
        </div>
      </div>

      <div className="space-y-2">
        <Label>Mode</Label>
        <div className="grid grid-cols-1 gap-2">
          {mounted ? (
            <RadioGroup
              onValueChange={setMode}
              defaultValue={mode}
              className="grid max-w-md grid-cols-2 gap-8 pt-2"
            >
              <Label className="[&:has([data-state=checked])>div]:border-primary">
                <RadioGroupItem value="light" className="sr-only" />
                <div className="items-center rounded-md border-2 border-muted p-1 hover:border-accent">
                  <div className="space-y-2 rounded-sm bg-[#ecedef] p-2">
                    <div className="space-y-2 rounded-md bg-white p-2 shadow-sm">
                      <div className="h-2 w-[80px] rounded-lg bg-[#ecedef]" />
                      <div className="h-2 w-[100px] rounded-lg bg-[#ecedef]" />
                    </div>
                    <div className="flex items-center space-x-2 rounded-md bg-white p-2 shadow-sm">
                      <div className="h-4 w-4 rounded-full bg-[#ecedef]" />
                      <div className="h-2 w-[100px] rounded-lg bg-[#ecedef]" />
                    </div>
                    <div className="flex items-center space-x-2 rounded-md bg-white p-2 shadow-sm">
                      <div className="h-4 w-4 rounded-full bg-[#ecedef]" />
                      <div className="h-2 w-[100px] rounded-lg bg-[#ecedef]" />
                    </div>
                  </div>
                </div>
                <span className="block w-full p-2 text-center font-normal">
                  Light
                </span>
              </Label>

              <Label className="[&:has([data-state=checked])>div]:border-primary">
                <RadioGroupItem value="dark" className="sr-only" />
                <div className="items-center rounded-md border-2 border-muted bg-popover p-1 hover:bg-accent hover:text-accent-foreground">
                  <div className="space-y-2 rounded-sm bg-slate-950 p-2">
                    <div className="space-y-2 rounded-md bg-slate-800 p-2 shadow-sm">
                      <div className="h-2 w-[80px] rounded-lg bg-slate-400" />
                      <div className="h-2 w-[100px] rounded-lg bg-slate-400" />
                    </div>
                    <div className="flex items-center space-x-2 rounded-md bg-slate-800 p-2 shadow-sm">
                      <div className="h-4 w-4 rounded-full bg-slate-400" />
                      <div className="h-2 w-[100px] rounded-lg bg-slate-400" />
                    </div>
                    <div className="flex items-center space-x-2 rounded-md bg-slate-800 p-2 shadow-sm">
                      <div className="h-4 w-4 rounded-full bg-slate-400" />
                      <div className="h-2 w-[100px] rounded-lg bg-slate-400" />
                    </div>
                  </div>
                </div>
                <span className="block w-full p-2 text-center font-normal">
                  Dark
                </span>
              </Label>
            </RadioGroup>
          ) : (
            <>
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
