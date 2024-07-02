import { useSearch } from "@/context/SearchContext";

const RelatedSearchTerms = () => {
  const { data } = useSearch();
  return (
    <div className="flex flex-wrap items-center gap-2">
      {data?.refinements?.map((term, index) => (
        <div
          key={index}
          className="bg-gray-200 whitespace-nowrap transition-all delay-100 border border-gray-200 text-gray-50 px-2 py-1 rounded-md text-sm cursor-pointer hover:bg-gray-300"
        >
          {term.q}
        </div>
      ))}
    </div>
  );
};

export default RelatedSearchTerms;
