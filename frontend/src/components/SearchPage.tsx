import React, { useEffect, useState } from 'react'
import { fetchTradeMarks, FilterOptions } from '../api/api';
import SearchBar from './SearchBar';
import Filters from './Filters';
import logo from '../assets/trademarkia-logo.png'
import { MdOutlineFilterAlt } from "react-icons/md";
import { MdOutlineShare } from "react-icons/md";
import { MdOutlineSort } from "react-icons/md";
import { FiSearch } from 'react-icons/fi';
import { FaRotate } from "react-icons/fa6";
import bottleicon from '../assets/bottle-icon1.svg'

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
<div className="flex  gap-15">
        {/* Trademark list */}
        <div className="flex-1">
          {/* Table header */}
          <div className="grid grid-cols-4 gap-4 border-b pb-2 mb-4 text-[#313131] font-bold">
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
                  <div className="font-bold">{trademark.name}</div>
                  <div className="text-sm text-gray-600">{trademark.company}</div>
                  <div className="text-sm font-semibold  mt-2">{trademark.registrationNumber}</div>
                  <div className="text-xs text-gray-600">{trademark.registrationDate}</div>
                </div>
                <div className='flex flex-col justify-between'> 
                    <div>
                  <div className="flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                    <span className="text-green-500 font-bold">{trademark.status}</span>
                  </div>
                  <div className="text-xs mt-1 flex">
                    <span className="mr-1">on</span>
                    <p className='font-bold'>{trademark.statusDate}</p>
                  </div>
                  </div>
                  <div className="flex items-center text-xs font-bold mt-1">
                    <span className="mr-1"><FaRotate className='text-[#EC4A4A]' /></span>
                    {trademark.filingDate}
                  </div>
                </div>
                <div>
                  <div className="text-sm">{trademark.description}</div>
                  <div className="flex mt-2 space-x-2 font-bold">
                    {trademark.classes.map((cls) => (
                      <div key={cls} className="flex items-center text-xs  px-2 py-1 rounded">
                        <img src={bottleicon} alt="icon" />
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
        <div className='space-y-2 flex flex-col w-[200px] md:w-[300px]'>
            {/* Status filter */}
            <div className='flex flex-col  max-w-[296px] h-[230px] md:h-[160px] bg-white rounded-lg shadow-md shadow-neutral-200 p-5'>
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



        {/* Owners filter */}
        <div className='flex flex-col max-w-[296px] h-[265px] bg-white rounded-lg shadow-md shadow-neutral-200 p-5'>
        
        <div className="flex gap-4 mb-2 text-sm md:text-[16px] items-start">

          <button className='font-bold border-b-3 pb-2'>Owners</button>
          <button >Law Firms</button>
          <button >Attorneys</button>
        </div>
            <div className='search mb-3'>
                 <div className="flex items-center relative">
                      <FiSearch className="absolute mx-3 size-5 text-[#636363]"/>
                      <input
                        type="text"
                        placeholder="Search Owners"
                        className=" w-[160px] md:w-[256px] h-[40px] border-1 border-[#D4D4D4] rounded-xl bg-white pl-10"
                      />
                      </div>
            </div>

            <div className="space-y-2 max-h-40 overflow-y-auto">
              {owners.map((owner) => (
                <div key={owner.id} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`owner-${owner.id}`}
                    className="h-4 w-4 text-blue-600 rounded"
                    // checked={selectedOwners.includes(owner.name)}
                    // onChange={() => {
                    //   if (selectedOwners.includes(owner.name)) {
                    //     setSelectedOwners(selectedOwners.filter((o) => o !== owner.name))
                    //   } else {
                    //     setSelectedOwners([...selectedOwners, owner.name])
                    //   }
                    // }}
                  />
                  <label htmlFor={`owner-${owner.id}`} className="ml-2 text-sm">
                    {owner.name}
                  </label>
                </div>
              ))}
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