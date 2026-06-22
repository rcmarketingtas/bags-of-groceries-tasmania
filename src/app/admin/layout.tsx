/**
 * Root admin layout — strips the public Header and Footer.
 * Child route groups ((dashboard)) add their own sidebar.
 */
export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
