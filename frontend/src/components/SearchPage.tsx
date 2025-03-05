import React, { useEffect, useState } from 'react'
import { fetchTradeMarks, FilterOptions } from '../api/api';
import SearchBar from './SearchBar';
import Filters from './Filters';
import logo from '../assets/trademarkia-logo.png'
import { MdOutlineFilterAlt } from "react-icons/md";
import { MdOutlineShare } from "react-icons/md";
import { MdOutlineSort } from "react-icons/md";

interface Trademark {
    id: string
  name: string
  company: string
  registrationNumber: string
  registrationDate: string
  status: "Live / Registered"
  statusDate: string
  filingDate: string
  classes: string[]
  description: string
}

interface Owner {
    id: string
    name: string
  }

const trademarks: Trademark[] = Array(10)
.fill(null)
.map((_, index) => ({
  id: `${index + 1}`,
  name: "Meta Logo",
  company: "FACEBOOK INC.",
  registrationNumber: "88713620",
  registrationDate: "26 Jan 2020",
  status: "Live / Registered",
  statusDate: "26 Jun 2020",
  filingDate: "26 Dec 2017",
  classes: ["45", "8", "9"],
  description: "Computer services, Social Media, Networking, Virtual Communities, Community",
}))

 // Mock data for owners
 const owners: Owner[] = [
    { id: "1", name: "Tesla, Inc." },
    { id: "2", name: "LEGALFORCE RAPC" },
    { id: "3", name: "Squareit Inc." },
    { id: "4", name: "Spaceit Inc." },
  ]

const SearchPage:React.FC = () => {

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [filters, setFilters] = useState<FilterOptions>({});
    const [results, setResults] = useState<Trademark[]>([]);
    const [selectedStatus, setSelectedStatus] = useState('')

    useEffect(() => {
        setResults(trademarks)
        
    })

    const handleSearch = async (query: string) => {
        setLoading(true);
        setError("")

        try {
            const data = await fetchTradeMarks(query, filters)
             setResults(data.results || []);
        } catch (error) {
            setError('Failed to fetch results. Please try again.');
        }finally{
            setLoading(false);
        }
    }

    const handleFilterChange = (newFilters: FilterOptions) => {
        setFilters(newFilters)
    }

  return (
    <div className='font-gilroy-medium bg-[#FEFEFE] '>

        <header className=" h-[118px] bg-[#EAF1FF]">
            <div className='bg-[#F8FAFE] flex items-center px-2 h-[112px] '>
            <div className='ml-20 mr-10'>
            <img src={logo} alt="Logo" width="170" height="25" />
            </div>
            <SearchBar onSearch={handleSearch}/>
            </div>
        </header>
        
            

     

        {loading && <p>Searching...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {/* {!loading && results.length === 0 && <p>No results found.</p>} */}

      <div className='xl:mx-[45px] mx-4'>
     <div className='border-b-[#E7E6E6] text-[#4B5563]'>
        <h4>About 159 Trademarks found for "nike"</h4>
     </div>

    {/* Search suggestion */}
     <div className='flex text-[#4B5563] justify-between items-center'>
        {/* Search suggestion left */}
        <div className='flex gap-5 items-center '>
        <h4>Also try searching for</h4>
        <div className='bg-[#FEF7F0] w-[58px] h-[35px] flex items-center justify-center rounded-lg border-2 border-[#E7760E] text-[#E7760E]'>nike*</div>
        <div className='bg-[#FEF7F0] w-[58px] h-[35px] flex items-center justify-center rounded-lg border-2 border-[#E7760E] text-[#E7760E]'>*ike</div>
        
        </div>

        {/* Search suggestion right */}
        <div className='flex items-center gap-5'>
        <div className= ' text-[#575757] rounded-lg border-[#C8C8C8] border flex items-center justify-center h-[42px] w-[95px]'> <MdOutlineFilterAlt />Filter</div>
        <div className= ' text-[#575757] rounded-full border border-[#C8C8C8] flex items-center justify-center h-[32px] w-[32px]'> <MdOutlineShare /></div>
        <div className= ' text-[#575757] rounded-full border border-[#C8C8C8] flex items-center justify-center h-[32px] w-[32px]'> <MdOutlineSort /></div>
        </div>
        
     </div>

      <div>
      <Filters onApplyFilters={handleFilterChange} />


{/* Main content */}
<div className="flex flex-col lg:flex-row gap-6">
        {/* Trademark list */}
        <div className="flex-1">
          {/* Table header */}
          <div className="grid grid-cols-4 gap-4 border-b pb-2 mb-4 font-medium text-gray-700">
            <div>Mark</div>
            <div>Details</div>
            <div>Status</div>
            <div>Class/Description</div>
          </div>

          {/* Table content */}
          <div className="space-y-4">
            {results.map((trademark) => (
              <div key={trademark.id} className="grid grid-cols-4 gap-4 border-b pb-4">
                <div className="flex items-center">
                  <div className="w-16 h-16 bg-gray-100 border flex items-center justify-center relative">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-gray-300 text-3xl">⊕</span>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="font-medium">{trademark.name}</div>
                  <div className="text-sm text-gray-600">{trademark.company}</div>
                  <div className="text-sm text-gray-600 mt-2">{trademark.registrationNumber}</div>
                  <div className="text-sm text-gray-600">{trademark.registrationDate}</div>
                </div>
                <div>
                  <div className="flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                    <span className="text-green-500">{trademark.status}</span>
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    <span className="mr-1">→</span>
                    {trademark.statusDate}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    <span className="mr-1">→</span>
                    {trademark.filingDate}
                  </div>
                </div>
                <div>
                  <div className="text-sm">{trademark.description}</div>
                  <div className="flex mt-2 space-x-2">
                    {trademark.classes.map((cls) => (
                      <div key={cls} className="flex items-center text-xs bg-gray-100 px-2 py-1 rounded">
                        <span className="mr-1">Class</span>
                        <span>{cls}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

            {/* Filter area */}
        <div>
            {/* Status filter */}
            <div className='flex flex-col max-w-[296px] h-[160px] bg-white rounded-lg shadow-md shadow-neutral-200 p-5'>
                <h3 className='font-bold mb-2'>Status</h3>
                <div className='flex flex-wrap h-[37px] gap-1.5'>
                    <button className={ `px-3 py-1.5 rounded-xl border text-sm font-medium transition-colors cursor-pointer ${selectedStatus == 'all' ? "bg-[#EEF4FF] text-[#4380EC] border-[#4380EC]" : "border-[#C8C8C8] hover:bg-gray-50 "}`} 
                    onClick={() => setSelectedStatus('all')
                    }>
                        All
                    </button>
                    <button className={ ` flex items-center justify-center gap-1 px-3 py-1.5 rounded-xl border  text-sm font-medium transition-colors cursor-pointer ${selectedStatus == 'registered' ? "bg-[#EEF4FF] text-[#4380EC] border-[#4380EC]" : "border-[#C8C8C8] hover:bg-gray-50"}`} 
                    onClick={() => setSelectedStatus('registered')
                    }>
                        <div className='w-[10px] h-[10px] bg-green-600 rounded-full'></div>
                        Registered
                    </button>
                    <button className={ `flex items-center justify-center gap-1 px-3 py-1.5 rounded-xl border  text-sm font-medium transition-colors cursor-pointer ${selectedStatus == 'pending' ? "bg-[#EEF4FF] text-[#4380EC] border-[#4380EC]" : "border-[#C8C8C8] hover:bg-gray-50"}`} 
                    onClick={() => setSelectedStatus('pending')
                    }>
                        <div className='w-[10px] h-[10px] bg-[#ECC53C] rounded-full'></div>
                        Pending
                    </button>
                    <button className={ `flex items-center justify-center gap-1 px-3 py-1.5 rounded-xl border  text-sm font-medium transition-colors cursor-pointer ${selectedStatus == 'abandoned' ? "bg-[#EEF4FF] text-[#4380EC] border-[#4380EC]" : "border-[#C8C8C8] hover:bg-gray-50"}`} 
                    onClick={() => setSelectedStatus('abandoned')
                    }>
                        <div className='w-[10px] h-[10px] bg-[#EC3C3C] rounded-full'></div>
                        Abandoned
                    </button>
                    <button className={ `flex items-center justify-center gap-1 px-3 py-1.5 rounded-xl border text-sm font-medium transition-colors cursor-pointer ${selectedStatus == 'others' ? "bg-[#EEF4FF] text-[#4380EC] border-[#4380EC]" : "border-[#C8C8C8] hover:bg-gray-50"}`} 
                    onClick={() => setSelectedStatus('others')
                    }>
                        <div className='w-[10px] h-[10px] bg-[#4380EC] rounded-full'></div>
                        Others
                    </button>
                </div>
            </div>
        </div>
        </div>


        
      </div>
      </div>
      </div>
    
  )
}

export default SearchPage