import React, { useCallback, useEffect, useMemo, useState } from "react";
import { fetchTradeMarks } from "../api/api";
import SearchBar from "./SearchBar";
import logo from "../assets/trademarkia-logo.png";
import { MdOutlineFilterAlt } from "react-icons/md";
import { MdOutlineShare } from "react-icons/md";
import { MdOutlineSort } from "react-icons/md";
import { FiSearch } from "react-icons/fi";
import { FaRotate } from "react-icons/fa6";
import bottleicon from "../assets/bottle-icon1.svg";
import image from "../assets/Image Unavailable.svg";
import toast from "react-hot-toast";
import { useSearchParams } from "react-router-dom";

interface Trademark {
  id: string;
  registrationNumber: string;
  registrationDate: string;
  filingDate: string;
  statusDate: string;
  renewalDate: string;
  markIdentification: string;
  currentOwner: string;
  description: string[];
  classes: string[];
  status: string;
}

const SearchPage: React.FC = () => {
  const [results, setResults] = useState<Trademark[]>([]);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [owners, setOwners] = useState<{ name: string; count: number }[]>([]);
  const [attorneys, setAttorneys] = useState<{ name: string; count: number }[]>(
    []
  );
  const [lawFirms, setLawFirms] = useState<{ name: string; count: number }[]>(
    []
  );
  const [selectedOwners, setSelectedOwners] = useState<string[]>([]);
  const [selectedAttorneys, setSelectedAttorneys] = useState<string[]>([]);
  const [selectedLawFirms, setSelectedLawFirms] = useState<string[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<string>("owners");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");

  const [searchParams, setSearchParams] = useSearchParams();

  // Determine the correct list to display based on the active filter
  const filteredList =
    selectedFilter === "owners"
      ? owners
      : selectedFilter === "attorneys"
      ? attorneys
      : lawFirms;

  // Determine the state for selected items
  const selectedItems =
    selectedFilter === "owners"
      ? selectedOwners
      : selectedFilter === "attorneys"
      ? selectedAttorneys
      : selectedLawFirms;

  const handleSelection = (name: string) => {
    if (selectedItems.includes(name)) {
      if (selectedFilter === "owners") {
        setSelectedOwners(selectedOwners.filter((o) => o !== name));
      } else if (selectedFilter === "attorneys") {
        setSelectedAttorneys(selectedAttorneys.filter((o) => o !== name));
      } else {
        setSelectedLawFirms(selectedLawFirms.filter((o) => o !== name));
      }
    } else {
      if (selectedFilter === "owners") {
        setSelectedOwners([...selectedOwners, name]);
      } else if (selectedFilter === "attorneys") {
        setSelectedAttorneys([...selectedAttorneys, name]);
      } else {
        setSelectedLawFirms([...selectedLawFirms, name]);
      }
    }
  };

  const filters = useMemo(
    () => ({
      status: [selectedStatus],
      owners: selectedOwners || [],
      attorneys: selectedAttorneys || [],
      lawFirms: selectedLawFirms || [],
    }),
    [selectedStatus, selectedOwners, selectedAttorneys, selectedLawFirms]
  );

  useEffect(() => {
    const params: Record<string, string> = {};

    if (selectedStatus) params.status = selectedStatus;
    if (selectedOwners.length) params.owners = selectedOwners.join(",");
    if (searchValue) params.query = searchValue;

    setSearchParams(params);
  }, [selectedStatus, selectedOwners, searchValue]);

  useEffect(() => {
    const statusFromURL = searchParams.get("status") || "";
    const ownersFromURL = searchParams.get("owners")?.split(",") || [];
    const queryFromURL = searchParams.get("query") || "nike";

    setSelectedStatus((prev) =>
      prev !== statusFromURL ? statusFromURL : prev
    );
    setSelectedOwners((prev) =>
      JSON.stringify(prev) !== JSON.stringify(ownersFromURL)
        ? ownersFromURL
        : prev
    );
    setSearchValue((prev) => (prev !== queryFromURL ? queryFromURL : prev));
  }, []);

  useEffect(() => {
    handleSearch(searchValue);
  }, [filters]);

  const handleSearch = useCallback(
    async (query: string) => {
      if (query.length == 0) query = "nike";
      setSearchValue(query);

      try {
        const searchToast = toast.promise(fetchTradeMarks(query, filters), {
          loading: "Searching...",
          success: "Search completed successfully!",
          error: "Failed to fetch results. Please try again.",
        });
        const response = await searchToast;

        if (!response || !response.body) {
          throw new Error("Invalid response format");
        }

        type HitType = {
          _id: string;
          _source: {
            registration_number?: string;
            registration_date?: number;
            filing_date?: number;
            status_date?: number;
            renewal_date?: number;
            mark_identification?: string;
            current_owner?: string;
            mark_description_description?: string[];
            class_codes?: string[];
            status_type?: string;
          };
        };

        type BucketType = { key: string; doc_count: number };

        const hits: HitType[] = response.body?.hits?.hits || [];
        const resultData: Trademark[] = hits.map((hit) => {
          const source = hit._source;

          return {
            id: hit._id,
            registrationNumber: source.registration_number || "NA",
            registrationDate: source.registration_date
              ? new Date(source.registration_date * 1000).toLocaleDateString()
              : "NA",
            filingDate: source.filing_date
              ? new Date(source.filing_date * 1000).toLocaleDateString()
              : "N/A",
            statusDate: source.status_date
              ? new Date(source.status_date * 1000).toLocaleDateString()
              : "N/A",
            renewalDate: source.renewal_date
              ? new Date(source.renewal_date * 1000).toLocaleDateString()
              : "N/A",
            markIdentification: source.mark_identification || "N/A",
            currentOwner: source.current_owner || "N/A",
            description: source.mark_description_description || [],
            classes: source.class_codes || [],
            status: source.status_type || "N/A",
          };
        });

        const ownersData: { name: string; count: number }[] =
          response.body.aggregations.current_owners.buckets.map(
            (bucket: BucketType) => ({
              name: bucket.key,
              count: bucket.doc_count,
            })
          );

        const attorneysData: { name: string; count: number }[] =
          response.body.aggregations.attorneys.buckets.map(
            (bucket: BucketType) => ({
              name: bucket.key,
              count: bucket.doc_count,
            })
          );
        const lawfirmsData: { name: string; count: number }[] =
          response.body.aggregations.law_firms.buckets.map(
            (bucket: BucketType) => ({
              name: bucket.key,
              count: bucket.doc_count,
            })
          );

        setResults(resultData);
        setOwners(ownersData);
        setAttorneys(attorneysData);
        setLawFirms(lawfirmsData);

        if (resultData.length === 0) toast.error("No results found!");
      } catch (error) {
        console.error("Failed to fetch results. Please try again.");
        setResults([])
      } finally {
      }
    },
    [filters]
  );

  //copy URL
  const copyLink = () => {
    const searchURL = window.location.href;
    navigator.clipboard.writeText(searchURL);
    toast.success("Search link copied!");
  };

  return (
    <div className="font-gilroy-medium bg-[#FEFEFE] ">
      <header className="h-auto bg-[#EAF1FF]">
        <div className="bg-[#F8FAFE] flex flex-wrap items-center px-4 py-3 sm:py-4 md:px-6 lg:px-10 h-auto">
          {/* Logo Container */}
          <div className="flex-shrink-0 max-w-[170px] sm:max-w-[150px] md:max-w-[160px] lg:max-w-[170px]">
            <img src={logo} alt="Logo" className="w-full h-auto" />
          </div>

          <div className="flex-1 flex justify-center sm:ml-6 mt-3 md:mt-0">
            <SearchBar onSearch={handleSearch} />
          </div>
        </div>
      </header>

      <div className="xl:mx-[45px] mx-4">
        {searchValue.length > 0 && results.length > 0 && (
          <div className="border-b border-b-[#E7E6E6] text-[#4B5563] py-4 font-bold">
            <h4>
              About {results.length} Trademarks found for "{searchValue}"
            </h4>
          </div>
        )}

        {/* Search suggestion */}
        <div className="flex text-[#4B5563] justify-between items-center py-8 font-bold">
          {/* Search suggestion left */}
          <div className="flex gap-5 items-center ">
            <h4>Also try searching for</h4>
            <div className="bg-[#FEF7F0] w-[58px] h-[35px] flex items-center justify-center rounded-lg border-2 border-[#E7760E] text-[#E7760E] text-xs">
              nike*
            </div>
            <div className="bg-[#FEF7F0] w-[58px] h-[35px] flex items-center justify-center rounded-lg border-2 border-[#E7760E] text-[#E7760E] text-xs">
              *ike
            </div>
          </div>

          {/* Search suggestion right */}
          <div className="flex items-center gap-5">
            <div className=" text-[#575757] rounded-lg border-[#C8C8C8] border flex items-center justify-center h-[42px] w-[95px] cursor-pointer">
              {" "}
              <MdOutlineFilterAlt />
              Filter
            </div>
            <div
              className=" text-[#575757] rounded-full border border-[#C8C8C8] flex items-center justify-center h-[32px] w-[32px] cursor-pointer"
              onClick={copyLink}
            >
              {" "}
              <MdOutlineShare />
            </div>
            <div className=" text-[#575757] rounded-full border border-[#C8C8C8] flex items-center justify-center h-[32px] w-[32px] cursor-pointer">
              {" "}
              <MdOutlineSort />
            </div>
          </div>
        </div>


<div>
          {/* Main content */}
          <div className="flex  gap-15 w-full">
            {/* Trademark list */}
            {
    results.length > 0 ? (

            <div className="flex-1">
              {/* Table header */}
              <div className="grid grid-cols-4 gap-4 border-b border-b-[#E7E6E6] pb-2 mb-4 text-[#313131] font-bold">
                <div>Mark</div>
                <div>Details</div>
                <div>Status</div>
                <div>Class/Description</div>
              </div>

              {/* Table content */}
              <div className="space-y-4">
                {results.map((trademark) => (
                  <div
                    key={trademark.id}
                    className="grid grid-cols-4 gap-4 pb-4"
                  >
                    <div className="flex items-center">
                      <div className="w-[160px] h-[120px] bg-white drop-shadow-xl rounded-lg flex items-center justify-center relative">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <img src={image} alt="image" />
                        </div>
                      </div>
                    </div>
                    <div>
                      <div className="font-bold">
                        {trademark.markIdentification}
                      </div>
                      <div className="text-sm text-gray-600">
                        {trademark.currentOwner}
                      </div>
                      <div className="text-sm font-semibold  mt-2">
                        {trademark.registrationNumber}
                      </div>
                      <div className="text-xs text-gray-600">
                        {trademark.registrationDate}
                      </div>
                    </div>
                    <div className="flex flex-col justify-between">
                      <div>
                        <div className="flex items-center">
                          <span
                            className={`w-2 h-2  rounded-full mr-2 ${
                              trademark.status == "registered"
                                ? "bg-green-500"
                                : trademark.status == "pending"
                                ? "bg-[#ECC53C]"
                                : trademark.status == "abandoned"
                                ? "bg-[#EC3C3C]"
                                : "bg-[#4380EC]"
                            } `}
                          ></span>
                          <span
                            className={`font-bold ${
                              trademark.status == "registered"
                                ? "text-green-500"
                                : trademark.status == "pending"
                                ? "text-[#ECC53C]"
                                : trademark.status == "abandoned"
                                ? "text-[#EC3C3C]"
                                : "text-[#4380EC]"
                            }`}
                          >
                            {trademark.status}
                          </span>
                        </div>
                        <div className="text-xs mt-1 flex">
                          <span className="mr-1">on</span>
                          <p className="font-bold">{trademark.statusDate}</p>
                        </div>
                      </div>
                      <div className="flex items-center text-xs font-bold mt-1">
                        <span className="mr-1">
                          <FaRotate className="text-[#EC4A4A]" />
                        </span>
                        {trademark.renewalDate}
                      </div>
                    </div>
                    <div className="overflow-hidden">
                      <div className="text-sm line-clamp-2">
                        {trademark.description}
                      </div>
                      <div className="mt-2 overflow-x-auto">
                        <div className="flex items-center font-bold overflow-x-hidden whitespace-nowrap">
                          {trademark.classes.map((cls, index) => (
                            <div
                              key={`${cls}-${index}`}
                              className="flex items-center text-xs mr-4 flex-shrink-0 line-clamp-1"
                            >
                              <img
                                src={bottleicon || ""}
                                alt="icon"
                                className="w-4 h-4 mr-1"
                              />
                              <span className="mr-1">Class</span>
                              <span>{cls}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
    ): (
        <div className="text-center w-full">
            <h1 className="text-2xl text-gray-500 uppercase font-bold">No Results Found</h1>
        </div>
    )}

            {/* Filter area */}
            <div className="space-y-2 flex flex-col w-[200px] md:w-[300px]">
              {/* Status filter */}
              <div className="flex flex-col  max-w-[296px] h-[230px] md:h-[160px] bg-white rounded-lg shadow-md shadow-neutral-200 p-5">
                <h3 className="font-bold mb-2">Status</h3>
                <div className="flex flex-wrap h-[37px] gap-1.5">
                  <button
                    className={`px-3 py-1.5 rounded-xl border text-sm font-medium transition-colors cursor-pointer ${
                      selectedStatus == "all"
                        ? "bg-[#EEF4FF] text-[#4380EC] border-[#4380EC]"
                        : "border-[#C8C8C8] hover:bg-gray-50 "
                    }`}
                    onClick={() => setSelectedStatus("all")}
                  >
                    All
                  </button>
                  <button
                    className={` flex items-center justify-center gap-1 px-3 py-1.5 rounded-xl border  text-sm font-medium transition-colors cursor-pointer ${
                      selectedStatus == "registered"
                        ? "bg-[#EEF4FF] text-[#4380EC] border-[#4380EC]"
                        : "border-[#C8C8C8] hover:bg-gray-50"
                    }`}
                    onClick={() => setSelectedStatus("registered")}
                  >
                    <div className="w-[10px] h-[10px] bg-green-600 rounded-full"></div>
                    Registered
                  </button>
                  <button
                    className={`flex items-center justify-center gap-1 px-3 py-1.5 rounded-xl border  text-sm font-medium transition-colors cursor-pointer ${
                      selectedStatus == "pending"
                        ? "bg-[#EEF4FF] text-[#4380EC] border-[#4380EC]"
                        : "border-[#C8C8C8] hover:bg-gray-50"
                    }`}
                    onClick={() => setSelectedStatus("pending")}
                  >
                    <div className="w-[10px] h-[10px] bg-[#ECC53C] rounded-full"></div>
                    Pending
                  </button>
                  <button
                    className={`flex items-center justify-center gap-1 px-3 py-1.5 rounded-xl border  text-sm font-medium transition-colors cursor-pointer ${
                      selectedStatus == "abandoned"
                        ? "bg-[#EEF4FF] text-[#4380EC] border-[#4380EC]"
                        : "border-[#C8C8C8] hover:bg-gray-50"
                    }`}
                    onClick={() => setSelectedStatus("abandoned")}
                  >
                    <div className="w-[10px] h-[10px] bg-[#EC3C3C] rounded-full"></div>
                    Abandoned
                  </button>
                  <button
                    className={`flex items-center justify-center gap-1 px-3 py-1.5 rounded-xl border text-sm font-medium transition-colors cursor-pointer ${
                      selectedStatus == "others"
                        ? "bg-[#EEF4FF] text-[#4380EC] border-[#4380EC]"
                        : "border-[#C8C8C8] hover:bg-gray-50"
                    }`}
                    onClick={() => setSelectedStatus("others")}
                  >
                    <div className="w-[10px] h-[10px] bg-[#4380EC] rounded-full"></div>
                    Others
                  </button>
                </div>
              </div>

              {/* Owners filter */}
              <div className="flex flex-col max-w-[296px] h-[265px] bg-white rounded-lg shadow-md shadow-neutral-200 p-5">
                <div className="flex gap-4 mb-2 text-sm md:text-[16px] items-start">
                  <button
                    className={`font-bold border-b-3 pb-2 ${
                      selectedFilter === "owners"
                        ? "border-black"
                        : "border-transparent"
                    }`}
                    onClick={() => setSelectedFilter("owners")}
                  >
                    Owners
                  </button>
                  <button
                    className={`font-bold border-b-3 pb-2 ${
                      selectedFilter === "lawFirms"
                        ? "border-black"
                        : "border-transparent"
                    }`}
                    onClick={() => setSelectedFilter("lawFirms")}
                  >
                    Law Firms
                  </button>
                  <button
                    className={`font-bold border-b-3 pb-2 ${
                      selectedFilter === "attorneys"
                        ? "border-black"
                        : "border-transparent"
                    }`}
                    onClick={() => setSelectedFilter("attorneys")}
                  >
                    Attorneys
                  </button>
                </div>
                {/* Search Input */}
                <div className="search mb-3">
                  <div className="flex items-center relative">
                    <FiSearch className="absolute mx-3 size-5 text-[#636363]" />
                    <input
                      type="text"
                      placeholder={`Search ${
                        selectedFilter.charAt(0).toUpperCase() +
                        selectedFilter.slice(1)
                      }`}
                      className="w-[160px] md:w-[256px] h-[40px] border-1 border-[#D4D4D4] rounded-xl bg-white pl-10"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>

                {/* Filtered List */}
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {filteredList
                    .filter((item) =>
                      item.name
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase())
                    )
                    .map((item, index) => (
                      <div key={index} className="flex items-center">
                        <input
                          type="checkbox"
                          id={`${selectedFilter}-${item.name}`}
                          className="h-4 w-4 text-blue-600 rounded"
                          checked={selectedItems.includes(item.name)}
                          onChange={() => handleSelection(item.name)}
                        />
                        <label
                          htmlFor={`${selectedFilter}-${item.name}`}
                          className="ml-2 text-sm"
                        >
                          {item.name}
                        </label>
                      </div>
                    ))}
                </div>
              </div>

              {/* Display options */}
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <h3 className="font-bold mb-3">Display</h3>
                <div className="grid grid-cols-2 gap-2 bg-gray-100 p-1 rounded-md">
                  <button
                    className={`py-2 text-sm font-bold rounded ${
                      viewMode === "grid"
                        ? "bg-white shadow-sm"
                        : "text-gray-600 hover:bg-gray-200"
                    }`}
                    onClick={() => setViewMode("grid")}
                  >
                    Grid View
                  </button>
                  <button
                    className={`py-2 text-sm font-bold rounded ${
                      viewMode === "list"
                        ? "bg-white shadow-sm"
                        : "text-gray-600 hover:bg-gray-200"
                    }`}
                    onClick={() => setViewMode("list")}
                  >
                    List View
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        
      </div>
    </div>
  );
};

export default SearchPage;
