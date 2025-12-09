import React from 'react';
import { Paper, InputBase, IconButton } from '@mui/material';
import { Search, Clear } from '@mui/icons-material';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ 
  value, 
  onChange, 
  placeholder = "Search books..." 
}) => {
  return (
    <Paper
      component="form"
      sx={{
        p: '2px 4px',
        display: 'flex',
        alignItems: 'center',
        width: '100%',
        maxWidth: 600,
        mb: 3,
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      }}
    >
      <IconButton sx={{ p: '10px' }} aria-label="search">
        <Search />
      </IconButton>
      <InputBase
        sx={{ ml: 1, flex: 1 }}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        inputProps={{ 'aria-label': 'search books' }}
      />
      {value && (
        <IconButton onClick={() => onChange('')}>
          <Clear />
        </IconButton>
      )}
    </Paper>
  );
};

export default SearchBar;