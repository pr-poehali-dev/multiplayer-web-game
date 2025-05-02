
import React from "react";
import * as LucideIcons from "lucide-react";

export interface IconProps extends React.SVGProps<SVGSVGElement> {
  name: keyof typeof LucideIcons | string;
  color?: string;
  size?: number;
  strokeWidth?: number;
  fallback?: keyof typeof LucideIcons;
}

const Icon = ({
  name,
  color,
  size = 24,
  strokeWidth = 2,
  fallback = "CircleAlert",
  ...props
}: IconProps) => {
  // Проверяем существование компонента
  const IconComponent = (LucideIcons as any)[name] || (LucideIcons as any)[fallback];

  if (!IconComponent) {
    console.warn(`Icon ${name} not found and fallback ${fallback} also not found`);
    return null;
  }

  return (
    <IconComponent
      color={color}
      size={size}
      strokeWidth={strokeWidth}
      {...props}
    />
  );
};

export default Icon;
