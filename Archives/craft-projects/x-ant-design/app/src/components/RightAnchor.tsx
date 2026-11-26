import { useEffect, useState } from 'react';
import './RightAnchor.css';

export interface AnchorItem {
  id: string;
  title: string;
  /** 0 = top level, 1 = nested */
  level?: 0 | 1;
}

interface RightAnchorProps {
  items: AnchorItem[];
}

export default function RightAnchor({ items }: RightAnchorProps) {
  const [activeId, setActiveId] = useState<string>(items[0]?.id ?? '');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) {
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: '-80px 0px -70% 0px', threshold: 0 }
    );

    items.forEach((item) => {
      const node = document.getElementById(item.id);
      if (node) observer.observe(node);
    });

    return () => observer.disconnect();
  }, [items]);

  const handleClick = (event: React.MouseEvent, id: string) => {
    event.preventDefault();
    const node = document.getElementById(id);
    if (node) {
      const top = node.getBoundingClientRect().top + window.scrollY - 88;
      window.scrollTo({ top, behavior: 'smooth' });
      setActiveId(id);
    }
  };

  return (
    <nav className="ra-anchor" aria-label="本页目录">
      <div className="ra-anchor-inner x-scroll">
        {items.map((item) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            onClick={(event) => handleClick(event, item.id)}
            className={
              item.level === 1
                ? 'ra-link ra-link-sub'
                : 'ra-link'
            }
            data-active={activeId === item.id || undefined}
          >
            {item.title}
          </a>
        ))}
      </div>
    </nav>
  );
}
