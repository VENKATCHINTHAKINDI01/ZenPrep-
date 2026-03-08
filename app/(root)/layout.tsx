import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";

import { isAuthenticated, signOut } from "@/lib/actions/auth.action";

const RootLayout = async ({ children }: { children: React.ReactNode }) => {
  const isAuth = await isAuthenticated();
  if (!isAuth) redirect("/sign-in");

  return (
    <div className="root-layout">
      <nav className="flex items-center justify-between px-6 py-4 border-b border-border">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/logo.png" alt="ZenPrep" width={32} height={32} />
          <span className="text-primary-100 font-bold text-xl">ZenPrep</span>
          <span className="text-light-600 text-sm hidden sm:block">
            — Prepare Calmly. Perform Confidently.
          </span>
        </Link>

        <form action={signOut}>
          <button type="submit" className="text-light-400 hover:text-white text-sm transition-colors">
            Sign Out
          </button>
        </form>
      </nav>

      <main className="root-layout-main">
        {children}
      </main>
    </div>
  );
};

export default RootLayout;
