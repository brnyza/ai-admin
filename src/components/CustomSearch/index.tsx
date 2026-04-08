import { Input } from '@bluemarble/bm-components'

import { InputAdornment, useMediaQuery } from '@mui/material'
import { MdSearch } from 'react-icons/md'

interface ICustomSearchProps {
  searchValue: string
  setSearchValue: (value: string) => void
  label: string
}

export function CustomSearch({ searchValue, setSearchValue, label }: ICustomSearchProps) {
  const isMobileVersion = useMediaQuery('(max-width: 500px)')

  return (
    <Input
      withFormik={false}
      sx={{
        maxWidth: isMobileVersion ? '100%' : 250,
        height: isMobileVersion ? '3.5rem' : '2.5rem'
      }}
      size={isMobileVersion ? 'medium' : 'small'}
      value={searchValue}
      name=""
      label={label}
      onChange={({ target }) => {
        setSearchValue(target.value)
      }}
      InputProps={{
        endAdornment: (
          <InputAdornment position="start">
            <MdSearch size={isMobileVersion ? '1.5rem' : '1rem'} />
          </InputAdornment>
        )
      }}
    />
  )
}
