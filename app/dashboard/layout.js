
export default function RootLayout({ children }) {
  return (
    <>
      <nav>sidebar</nav>
      <main>
        {children}
      </main>
    </>
  );
}
