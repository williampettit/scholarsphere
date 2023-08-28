import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

export function SiteLogoText(props: React.HTMLAttributes<HTMLDivElement>) {
  const { className, ...otherProps } = props;
  return (
    <div
      className={cn(
        "flex items-center text-xl font-semibold tracking-tight",
        className
      )}
      {...otherProps}
    >
      {siteConfig.name}
    </div>
  );
}
