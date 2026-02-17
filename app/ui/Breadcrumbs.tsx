import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

interface BreadcrumbItem {
    label: string;
    href?: string;
}

/**
 * Premium Breadcrumbs Component
 * 
 * Includes JSON-LD BreadcrumbList for Google Search Rich Results.
 */
export default function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": items.map((item, index) => ({
            "@type": "ListItem",
            "position": index + 1,
            "name": item.label,
            "item": item.href ? `https://artisanal-refuge.vercel.app${item.href}` : undefined,
        })),
    };

    return (
        <nav aria-label="Breadcrumb" className="mb-6">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <ol className="flex items-center space-x-2 text-xs font-bold uppercase tracking-widest text-gray-400">
                <li className="flex items-center">
                    <Link href="/" className="hover:text-[#BC6C25] transition-colors flex items-center gap-1">
                        <Home size={12} />
                        <span>Inicio</span>
                    </Link>
                </li>
                {items.map((item, index) => (
                    <li key={index} className="flex items-center space-x-2">
                        <ChevronRight size={12} className="text-gray-300" />
                        {item.href ? (
                            <Link href={item.href as any} className="hover:text-[#BC6C25] transition-colors">
                                {item.label}
                            </Link>
                        ) : (
                            <span className="text-[#BC6C25] truncate max-w-[150px]">{item.label}</span>
                        )}
                    </li>
                ))}
            </ol>
        </nav>
    );
}
