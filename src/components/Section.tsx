import { ReactNode } from 'react';

interface SectionProps {
  readonly children: ReactNode;
  readonly title?: string;
  readonly className?: string;
}

export default function Section({ children, title, className = '' }: SectionProps) {
  return (
    <section className={`py-20 ${className}`}>
      <div className="max-w-[980px] mx-auto px-5">
        {title && (
          <h2 className="text-[40px] md:text-[48px] font-semibold text-center mb-16 text-gray-900 dark:text-white tracking-tight leading-tight">
            {title}
          </h2>
        )}
        {children}
      </div>
    </section>
  );
}
