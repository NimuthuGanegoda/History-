import Link from 'next/link';

interface BreadcrumbsProps {
  readonly items: { label: string; href?: string }[];
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <div className="text-sm mb-4 text-gray-600 dark:text-gray-400">
      {items.map((item) => (
        <span key={item.label}>
          {item.href ? (
            <Link href={item.href} className="text-[var(--accent)] no-underline hover:underline">
              {item.label}
            </Link>
          ) : (
            <span>{item.label}</span>
          )}
          {items.indexOf(item) < items.length - 1 && ' › '}
        </span>
      ))}
    </div>
  );
}
