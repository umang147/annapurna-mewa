'use client';

import Link from 'next/link';
import type { AnchorHTMLAttributes, MouseEvent, ReactNode } from 'react';

type EventValue = string | number | boolean | null | undefined;

type TrackedLinkProps = {
  href: string;
  eventName: string;
  eventParams?: Record<string, EventValue>;
  children: ReactNode;
  className?: string;
  external?: boolean;
} & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href' | 'onClick' | 'children'>;

declare global {
  interface Window {
    gtag?: (
      command: 'event',
      eventName: string,
      params?: Record<string, EventValue>,
    ) => void;
  }
}

function trackEvent(eventName: string, eventParams: Record<string, EventValue> = {}) {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') {
    return;
  }

  window.gtag('event', eventName, {
    event_category: 'engagement',
    ...eventParams,
  });
}

export default function TrackedLink({
  href,
  eventName,
  eventParams,
  children,
  className,
  external,
  target,
  rel,
  ...props
}: TrackedLinkProps) {
  const handleClick = (_event: MouseEvent<HTMLAnchorElement>) => {
    trackEvent(eventName, {
      link_url: href,
      ...eventParams,
    });
  };

  if (external || href.startsWith('http')) {
    return (
      <a
        {...props}
        href={href}
        target={target}
        rel={rel}
        className={className}
        onClick={handleClick}
      >
        {children}
      </a>
    );
  }

  return (
    <Link {...props} href={href} className={className} onClick={handleClick}>
      {children}
    </Link>
  );
}
