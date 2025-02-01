import { cn } from "@/lib/utils";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  as?: React.ElementType;
}

export function MaxWithWrapper({
  children,
  className,
  as: Component = "div",
  ...prop
}: Props) {
  return (
    <Component
      className={cn(
        "mx-auto container p-4 space-y-12 md:space-y-16",
        className
      )}
      {...prop}
    >
      {children}
    </Component>
  );
}
