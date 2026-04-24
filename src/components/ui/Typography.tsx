import React from 'react';

type Variant = 'h1' | 'h2' | 'h3' | 'h4' | 'body' | 'label' | 'caption';
type Weight = 'normal' | 'medium' | 'bold' | 'extrabold' | 'black';
type Align = 'left' | 'center' | 'right';

interface TypographyProps {
  variant?: Variant;
  weight?: Weight;
  align?: Align;
  className?: string;
  children: React.ReactNode;
}

export const Typography: React.FC<TypographyProps> = ({
  variant = 'body',
  weight,
  align,
  className = '',
  children
}) => {
  const baseStyles = "text-slate-800 dark:text-slate-100";
  
  const variants: Record<Variant, string> = {
    h1: "text-4xl md:text-5xl tracking-tight",
    h2: "text-2xl md:text-3xl tracking-tight",
    h3: "text-lg md:text-xl",
    h4: "text-base md:text-lg",
    body: "text-base",
    label: "text-sm uppercase tracking-wider",
    caption: "text-xs"
  };

  const weights: Record<Weight, string> = {
    normal: "font-normal",
    medium: "font-medium",
    bold: "font-bold",
    extrabold: "font-extrabold",
    black: "font-black"
  };
  
  const defaultWeights: Record<Variant, Weight> = {
    h1: 'black',
    h2: 'extrabold',
    h3: 'bold',
    h4: 'bold',
    body: 'normal',
    label: 'bold',
    caption: 'normal' // Fixed from text-xs
  };

  const aligns: Record<Align, string> = {
    left: "text-left",
    center: "text-center",
    right: "text-right"
  };

  const finalWeight = weight ? weights[weight] : weights[defaultWeights[variant]];
  const finalAlign = align ? aligns[align] : '';

  const Component = ['h1','h2','h3','h4'].includes(variant) ? variant as any : (variant === 'label' ? 'label' : 'p');

  return React.createElement(
    Component,
    { className: `${baseStyles} ${variants[variant]} ${finalWeight} ${finalAlign} ${className}` },
    children
  );
};
