import React, { useState } from 'react'
import { FilterOptions } from '../api/api'

interface FiltersProps {
    onApplyFilters: (filters: FilterOptions) => void;
}
const Filters:React.FC<FiltersProps> = ({onApplyFilters}) => {
    const [filters, setFilters] = useState<FilterOptions> ( {
        attorneys: [],
        lawFirms: [],
        owners: [],
        status: [],
    });

  return (
    <div className=''>
        <h3>Filters</h3>
        <input type="text" />
    </div>
  )
}

export default Filters