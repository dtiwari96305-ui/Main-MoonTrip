| Arbitrary Value | Tailwind Class Used | Source File | Line # | Reason |
|-----------------|--------------------|--------------------|--------|--------|
| var(--banner-bg) | bg-[var(--banner-bg)] | dashboard.css | 18 | Preserved CSS variable theme tokens |
| 100 | z-[100] | index.html | 36, 48 | Explicit precision translation |
| 0.85rem | text-[0.85rem] | dashboard.css | 382, 386 | No exact Tailwind text size class |
| 12px | gap-[12px], rounded-[12px] | dashboard.css | Various | Preservation of exact geometric constraints |
| var(--sidebar-bg) | bg-[var(--sidebar-bg)] | dashboard.css | 3755 | Background gradient token matching |
| 240px | w-[240px] | index.html | Layout | Desktop expanded Sidebar width |
| var(--sidebar-width) | w-[var(--sidebar-width)] | dashboard.css | 3754 | Dynamic variable CSS translation |
| 1.15rem | text-[1.15rem] | dashboard.css | 3862 | Logo size mapping |
| -0.02em | tracking-[-0.02em] | dashboard.css | 3864 | Typography mapping |
| 0.08em | tracking-[0.08em] | dashboard.css | Various | Typography mapping |
| cubic-bezier | ease-[cubic-bezier(0.4,0,0.2,1)] | dashboard.css | Various | Exact transition translation |
| 0.2s | duration-[0.2s] | dashboard.css | Various | Explicit duration conversion |
| var(--shadow-sm) | shadow-[var(--shadow-sm)] | dashboard.css | Various | Mapped design system token |
| viewFadeIn | animate-[viewFadeIn...] | dashboard.css | 4072 | Mapped custom keyframe |
| rgba(244,125,91,0.2) | hover:border-[rgba(...)] | dashboard.css | Various | Raw RGBA translation to arbitrary class |
| 0.95rem | text-[0.95rem] | dashboard.css | 3881 | Component text scale mapping |
| 0.75rem | text-[0.75rem] | dashboard.css | 3886 | Component text scale mapping |
| 1.8rem | text-[1.8rem] | dashboard.css | 3907 | Counter size mapping |
| 800 | font-[800] | dashboard.css | Various | Matching exact weight |
| 0.7rem | text-[0.7rem] | dashboard.css | 4016 | Badge typography mapping |
