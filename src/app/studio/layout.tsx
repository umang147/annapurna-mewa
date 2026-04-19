export const metadata = {
  title: 'Sanity Studio',
  description: 'Manage Annapurna Mewa Catalog',
};

export default function StudioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <section>{children}</section>;
}
