'use client';

import { useState, useRef, useEffect } from 'react';
import { countries, Country } from '@/lib/countries';
import { UserFilters } from './FiltersMenu';

interface FilterDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  filters: UserFilters;
  onFiltersChange: (filters: UserFilters) => void;
  anchorRef: React.RefObject<HTMLDivElement | null>;
}

export default function FilterDropdown({
  isOpen,
  onClose,
  filters,
  onFiltersChange,
  anchorRef
}: FilterDropdownProps) {
  const [preferredCountries, setPreferredCountries] = useState<Country[]>([]);
  const [nonPreferredCountries, setNonPreferredCountries] = useState<Country[]>([]);
  const [preferredSearch, setPreferredSearch] = useState('');
  const [nonPreferredSearch, setNonPreferredSearch] = useState('');
  const [showPreferredDropdown, setShowPreferredDropdown] = useState(false);
  const [showNonPreferredDropdown, setShowNonPreferredDropdown] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const preferredInputRef = useRef<HTMLInputElement>(null);
  const nonPreferredInputRef = useRef<HTMLInputElement>(null);

  // Initialize from filters
  useEffect(() => {
    const preferred = filters.preferredCountries
      .map(code => countries.find(c => c.code === code))
      .filter((c): c is Country => c !== undefined);
    const nonPreferred = filters.nonPreferredCountries
      .map(code => countries.find(c => c.code === code))
      .filter((c): c is Country => c !== undefined);

    setPreferredCountries(preferred);
    setNonPreferredCountries(nonPreferred);
  }, [filters]);

  // Close dropdown when clicking outside
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        anchorRef.current &&
        !anchorRef.current.contains(event.target as Node)
      ) {
        handleApply();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, preferredCountries, nonPreferredCountries]);

  const getFilteredCountries = (search: string, selected: Country[], other: Country[]) => {
    return countries.filter(country =>
      country.name.toLowerCase().includes(search.toLowerCase()) &&
      !selected.some(s => s.code === country.code) &&
      !other.some(s => s.code === country.code)
    ).slice(0, 8); // Limit to 8 results
  };

  const addPreferredCountry = (country: Country) => {
    if (preferredCountries.length < 3) {
      setPreferredCountries([...preferredCountries, country]);
      setPreferredSearch('');
      setShowPreferredDropdown(false);
    }
  };

  const removePreferredCountry = (countryCode: string) => {
    setPreferredCountries(preferredCountries.filter(c => c.code !== countryCode));
  };

  const addNonPreferredCountry = (country: Country) => {
    if (nonPreferredCountries.length < 3) {
      setNonPreferredCountries([...nonPreferredCountries, country]);
      setNonPreferredSearch('');
      setShowNonPreferredDropdown(false);
    }
  };

  const removeNonPreferredCountry = (countryCode: string) => {
    setNonPreferredCountries(nonPreferredCountries.filter(c => c.code !== countryCode));
  };

  const handleApply = () => {
    const updatedFilters: UserFilters = {
      ...filters,
      preferredCountries: preferredCountries.map(c => c.code),
      nonPreferredCountries: nonPreferredCountries.map(c => c.code)
    };
    onFiltersChange(updatedFilters);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      ref={dropdownRef}
      style={{
        width: '100%',
        padding: 'var(--space-md)',
        animation: 'slideDown 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
      }}
    >
      {/* Preferred Countries */}
      <div style={{ marginBottom: 'var(--space-lg)' }}>
        <h3 style={{
          fontSize: '14px',
          fontWeight: 600,
          color: 'var(--text-primary)',
          marginBottom: 'var(--space-sm)'
        }}>
          ✅ Preferred Countries
        </h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-xs)', marginBottom: 'var(--space-sm)' }}>
          {preferredCountries.map((country) => (
            <span
              key={country.code}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 'var(--space-xs)',
                padding: '6px 12px',
                background: 'rgba(34, 197, 94, 0.15)',
                border: '1px solid rgba(34, 197, 94, 0.3)',
                borderRadius: '12px',
                fontSize: '13px',
                color: '#86efac'
              }}
            >
              <span>{country.flag}</span>
              <span>{country.name}</span>
              <button
                onClick={() => removePreferredCountry(country.code)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'inherit',
                  cursor: 'pointer',
                  padding: 0,
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <svg style={{ width: '14px', height: '14px' }} fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </span>
          ))}
        </div>
        <div style={{ position: 'relative' }} ref={preferredInputRef}>
          <input
            type="text"
            placeholder="Search countries..."
            value={preferredSearch}
            onChange={(e) => {
              setPreferredSearch(e.target.value);
              setShowPreferredDropdown(true);
            }}
            onFocus={() => setShowPreferredDropdown(true)}
            disabled={preferredCountries.length >= 3}
            style={{
              width: '100%',
              padding: 'var(--space-sm) var(--space-md)',
              background: 'var(--bg-tertiary)',
              border: '1px solid var(--border-primary)',
              borderRadius: '8px',
              color: 'var(--text-primary)',
              fontSize: '13px',
              outline: 'none'
            }}
          />
          {showPreferredDropdown && preferredCountries.length < 3 && preferredSearch && (
            <div style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              marginTop: '4px',
              background: 'var(--bg-tertiary)',
              border: '1px solid var(--border-primary)',
              borderRadius: '8px',
              maxHeight: '160px',
              overflowY: 'auto',
              zIndex: 101
            }}>
              {getFilteredCountries(preferredSearch, preferredCountries, nonPreferredCountries).map((country) => (
                <button
                  key={country.code}
                  onClick={() => addPreferredCountry(country)}
                  style={{
                    width: '100%',
                    padding: 'var(--space-sm) var(--space-md)',
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--text-primary)',
                    fontSize: '13px',
                    textAlign: 'left',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--space-sm)',
                    transition: 'background 0.15s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-primary)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  <span>{country.flag}</span>
                  <span>{country.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Non-Preferred Countries */}
      <div>
        <h3 style={{
          fontSize: '14px',
          fontWeight: 600,
          color: 'var(--text-primary)',
          marginBottom: 'var(--space-sm)'
        }}>
          ❌ Avoid Countries
        </h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-xs)', marginBottom: 'var(--space-sm)' }}>
          {nonPreferredCountries.map((country) => (
            <span
              key={country.code}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 'var(--space-xs)',
                padding: '6px 12px',
                background: 'rgba(239, 68, 68, 0.15)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                borderRadius: '12px',
                fontSize: '13px',
                color: '#fca5a5'
              }}
            >
              <span>{country.flag}</span>
              <span>{country.name}</span>
              <button
                onClick={() => removeNonPreferredCountry(country.code)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'inherit',
                  cursor: 'pointer',
                  padding: 0,
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <svg style={{ width: '14px', height: '14px' }} fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </span>
          ))}
        </div>
        <div style={{ position: 'relative' }} ref={nonPreferredInputRef}>
          <input
            type="text"
            placeholder="Search countries..."
            value={nonPreferredSearch}
            onChange={(e) => {
              setNonPreferredSearch(e.target.value);
              setShowNonPreferredDropdown(true);
            }}
            onFocus={() => setShowNonPreferredDropdown(true)}
            disabled={nonPreferredCountries.length >= 3}
            style={{
              width: '100%',
              padding: 'var(--space-sm) var(--space-md)',
              background: 'var(--bg-tertiary)',
              border: '1px solid var(--border-primary)',
              borderRadius: '8px',
              color: 'var(--text-primary)',
              fontSize: '13px',
              outline: 'none'
            }}
          />
          {showNonPreferredDropdown && nonPreferredCountries.length < 3 && nonPreferredSearch && (
            <div style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              marginTop: '4px',
              background: 'var(--bg-tertiary)',
              border: '1px solid var(--border-primary)',
              borderRadius: '8px',
              maxHeight: '160px',
              overflowY: 'auto',
              zIndex: 101
            }}>
              {getFilteredCountries(nonPreferredSearch, nonPreferredCountries, preferredCountries).map((country) => (
                <button
                  key={country.code}
                  onClick={() => addNonPreferredCountry(country)}
                  style={{
                    width: '100%',
                    padding: 'var(--space-sm) var(--space-md)',
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--text-primary)',
                    fontSize: '13px',
                    textAlign: 'left',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--space-sm)',
                    transition: 'background 0.15s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-primary)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  <span>{country.flag}</span>
                  <span>{country.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            maxHeight: 0;
          }
          to {
            opacity: 1;
            maxHeight: 500px;
          }
        }
      `}</style>
    </div>
  );
}
