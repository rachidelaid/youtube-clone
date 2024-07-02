import { useSearch } from "@/context/SearchContext";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";

const Navbar = () => {
  const router = useRouter();
  const { setData, setIsLoading } = useSearch();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { searchTerm } = e.currentTarget.elements;

    if (searchTerm.value.trim()) {
      setIsLoading(true);

      const res = await fetch("/api/search", {
        method: "POST",
        body: JSON.stringify({ query: searchTerm.value }),
      });
      const data = await res.json();

      setData(data);
      setIsLoading(false);

      router.push("/");
    }
  };

  return (
    <div className="flex items-center justify-between p-4">
      <Link href="/">
        <Image src="/logo.svg" alt="youtube logo" width={90} height={20} />
      </Link>

      <form
        onSubmit={handleSubmit}
        className="rounded-full border border-gray-100 pl-3 flex items-center overflow-hidden"
      >
        <input
          className="bg-transparent outline-none w-80 ring-0"
          type="text"
          placeholder="Search"
          id="searchTerm"
        />

        <button
          className="px-3 py-2 border-l border-gray-100 bg-gray-200"
          type="submit"
        >
          <svg
            enable-background="new 0 0 24 24"
            height="24"
            viewBox="0 0 24 24"
            width="24"
            focusable="false"
            fill="white"
          >
            <path d="m20.87 20.17-5.59-5.59C16.35 13.35 17 11.75 17 10c0-3.87-3.13-7-7-7s-7 3.13-7 7 3.13 7 7 7c1.75 0 3.35-.65 4.58-1.71l5.59 5.59.7-.71zM10 16c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6z"></path>
          </svg>
        </button>
      </form>
    </div>
  );
};

export default Navbar;
