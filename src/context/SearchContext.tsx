import Loading from "@/components/Loading";
import {
  Dispatch,
  SetStateAction,
  createContext,
  useContext,
  useState,
} from "react";
import { Result } from "ytsr";

const SearchContext = createContext<{
  data?: Result;
  setData: Dispatch<SetStateAction<undefined>>;
  setIsLoading: (isLoading: boolean) => void;
}>({
  data: undefined,
  setData: () => {},
  setIsLoading: (isLoading: boolean) => {},
});

export const SearchProvider = ({ children }: { children: React.ReactNode }) => {
  const [data, setData] = useState(undefined);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <SearchContext.Provider value={{ data, setData, setIsLoading }}>
      {isLoading && <Loading />}
      {children}
    </SearchContext.Provider>
  );
};

export const useSearch = () => useContext(SearchContext);
