'use client';

import { useState, useRef, useEffect } from 'react';
import { countries, Country } from '@/lib/countries';
import { playSound } from '@/lib/audio';

export interface UserFilters {
  interests: string[];
  preferredCountries: string[]; // country codes
  nonPreferredCountries: string[]; // country codes
}

interface FiltersMenuProps {
  isOpen: boolean;
  onClose: () => void;
  filters?: UserFilters;
  onApplyFilters?: (filters: UserFilters) => void;
}

export default function FiltersMenu({ isOpen, onClose, filters, onApplyFilters }: FiltersMenuProps) {
  const [interests, setInterests] = useState<string[]>([]);
  const [interestInput, setInterestInput] = useState('');
  const [preferredCountries, setPreferredCountries] = useState<Country[]>([]);
  const [nonPreferredCountries, setNonPreferredCountries] = useState<Country[]>([]);
  const [preferredSearch, setPreferredSearch] = useState('');
  const [nonPreferredSearch, setNonPreferredSearch] = useState('');
  const [showPreferredDropdown, setShowPreferredDropdown] = useState(false);
  const [showNonPreferredDropdown, setShowNonPreferredDropdown] = useState(false);

  const preferredInputRef = useRef<HTMLInputElement>(null);
  const nonPreferredInputRef = useRef<HTMLInputElement>(null);

  // Initialize from filters prop
  useEffect(() => {
    if (filters) {
      setInterests(filters.interests || []);
      const preferred = filters.preferredCountries
        .map(code => countries.find(c => c.code === code))
        .filter((c): c is Country => c !== undefined);
      const nonPreferred = filters.nonPreferredCountries
        .map(code => countries.find(c => c.code === code))
        .filter((c): c is Country => c !== undefined);
      setPreferredCountries(preferred);
      setNonPreferredCountries(nonPreferred);
    }
  }, [filters]);

  // Handle interest input
  const handleInterestKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && interestInput.trim()) {
      if (!interests.includes(interestInput.trim())) {
        setInterests([...interests, interestInput.trim()]);
      }
      setInterestInput('');
    }
  };

  const removeInterest = (interest: string) => {
    setInterests(interests.filter(i => i !== interest));
  };

  // Filter countries based on search and existing selections
  const getFilteredCountries = (search: string, selected: Country[], other: Country[]) => {
    return countries.filter(country =>
      country.name.toLowerCase().includes(search.toLowerCase()) &&
      !selected.some(s => s.code === country.code) &&
      !other.some(s => s.code === country.code)
    );
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

  // Handle clicking outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (preferredInputRef.current && !preferredInputRef.current.contains(event.target as Node)) {
        setShowPreferredDropdown(false);
      }
      if (nonPreferredInputRef.current && !nonPreferredInputRef.current.contains(event.target as Node)) {
        setShowNonPreferredDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleApply = () => {
    const filters: UserFilters = {
      interests,
      preferredCountries: preferredCountries.map(c => c.code),
      nonPreferredCountries: nonPreferredCountries.map(c => c.code)
    };

    console.log('Applying filters:', filters);
    onApplyFilters?.(filters);
    onClose();
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            zIndex: 40
          }}
          onClick={onClose}
        />
      )}

      {/* Filters Menu Panel */}
      <div style={{
        position: 'fixed',
        top: 0,
        right: 0,
        height: '100%',
        width: '320px',
        background: 'var(--bg-secondary)',
        borderLeft: '1px solid var(--border-primary)',
        boxShadow: '-4px 0 24px rgba(0, 0, 0, 0.15)',
        zIndex: 50,
        transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: 'var(--space-lg)',
          borderBottom: '1px solid var(--border-primary)'
        }}>
          <h2 style={{
            fontSize: '20px',
            fontWeight: 600,
            color: 'var(--text-primary)'
          }}>
            Filters
          </h2>
          <button
            onClick={onClose}
            style={{
              width: '36px',
              height: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'transparent',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              color: 'var(--text-secondary)',
              transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
            onMouseEnter={(e) => {
              playSound('/hover.mp3', 0.3);
              e.currentTarget.style.background = 'var(--bg-tertiary)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
            }}
          >
            <svg style={{ width: '20px', height: '20px' }} fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: 'var(--space-lg)'
        }}>
          {/* Interests Section */}
          <div style={{ marginBottom: 'var(--space-xl)' }}>
            <h3 style={{
              fontSize: '16px',
              fontWeight: 600,
              color: 'var(--text-primary)',
              marginBottom: 'var(--space-md)'
            }}>
              Interests
            </h3>
            <input
              type="text"
              placeholder="Type an interest and press Enter"
              value={interestInput}
              onChange={(e) => setInterestInput(e.target.value)}
              onKeyDown={handleInterestKeyDown}
              style={{
                width: '100%',
                padding: 'var(--space-sm) var(--space-md)',
                background: 'var(--bg-tertiary)',
                border: '1px solid var(--border-primary)',
                borderRadius: '8px',
                color: 'var(--text-primary)',
                fontSize: '14px',
                outline: 'none',
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = 'var(--accent)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-primary)';
              }}
            />
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 'var(--space-xs)',
              marginTop: 'var(--space-md)'
            }}>
              {interests.map((interest, index) => (
                <span
                  key={index}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 'var(--space-xs)',
                    padding: '6px 12px',
                    background: 'var(--bg-tertiary)',
                    border: '1px solid var(--border-secondary)',
                    borderRadius: '16px',
                    fontSize: '13px',
                    color: 'var(--text-secondary)',
                    fontWeight: 500
                  }}
                >
                  {interest}
                  <button
                    onClick={() => removeInterest(interest)}
                    onMouseEnter={() => playSound('/hover.mp3', 0.3)}
                    style={{
                      background: 'none',
                      border: 'none',
                      padding: 0,
                      cursor: 'pointer',
                      color: 'var(--text-tertiary)',
                      display: 'flex',
                      alignItems: 'center',
                      transition: 'color 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      playSound('/hover.mp3', 0.3);
                      e.currentTarget.style.color = 'var(--error)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = 'var(--text-tertiary)';
                    }}
                  >
                    <svg style={{ width: '12px', height: '12px' }} fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Preferred Countries Section */}
          <div style={{ marginBottom: 'var(--space-xl)' }}>
            <h3 style={{
              fontSize: '16px',
              fontWeight: 600,
              color: 'var(--text-primary)',
              marginBottom: 'var(--space-md)'
            }}>
              Preferred Countries
            </h3>
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 'var(--space-xs)',
              marginBottom: 'var(--space-md)'
            }}>
              {preferredCountries.map((country) => (
                <span
                  key={country.code}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 'var(--space-xs)',
                    padding: '6px 12px',
                    background: 'var(--bg-tertiary)',
                    border: '1px solid var(--border-secondary)',
                    borderRadius: '16px',
                    fontSize: '13px',
                    color: 'var(--text-secondary)',
                    fontWeight: 500
                  }}
                >
                  <span>{country.flag}</span>
                  {country.name}
                  <button
                    onClick={() => removePreferredCountry(country.code)}
                    style={{
                      background: 'none',
                      border: 'none',
                      padding: 0,
                      cursor: 'pointer',
                      color: 'var(--text-tertiary)',
                      display: 'flex',
                      alignItems: 'center',
                      transition: 'color 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      playSound('/hover.mp3', 0.3);
                      e.currentTarget.style.color = 'var(--error)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = 'var(--text-tertiary)';
                    }}
                  >
                    <svg style={{ width: '12px', height: '12px' }} fill="currentColor" viewBox="0 0 20 20">
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
                  background: preferredCountries.length >= 3 ? 'var(--bg-tertiary)' : 'var(--bg-tertiary)',
                  border: '1px solid var(--border-primary)',
                  borderRadius: '8px',
                  color: 'var(--text-primary)',
                  fontSize: '14px',
                  outline: 'none',
                  opacity: preferredCountries.length >= 3 ? 0.5 : 1,
                  cursor: preferredCountries.length >= 3 ? 'not-allowed' : 'text',
                  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
                onFocus={(e) => {
                  if (preferredCountries.length < 3) {
                    e.currentTarget.style.borderColor = 'var(--accent)';
                  }
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border-primary)';
                }}
              />
              {showPreferredDropdown && preferredCountries.length < 3 && (
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  right: 0,
                  marginTop: '4px',
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-primary)',
                  borderRadius: '8px',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                  maxHeight: '200px',
                  overflowY: 'auto',
                  zIndex: 10
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
                        fontSize: '14px',
                        textAlign: 'left',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 'var(--space-sm)',
                        transition: 'background 0.2s'
                      }}
                      onMouseEnter={(e) => {
                        playSound('/hover.mp3', 0.3);
                        e.currentTarget.style.background = 'var(--bg-tertiary)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'transparent';
                      }}
                    >
                      <span>{country.flag}</span>
                      {country.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Non-Preferred Countries Section */}
          <div>
            <h3 style={{
              fontSize: '16px',
              fontWeight: 600,
              color: 'var(--text-primary)',
              marginBottom: 'var(--space-md)'
            }}>
              Non-Preferred Countries
            </h3>
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 'var(--space-xs)',
              marginBottom: 'var(--space-md)'
            }}>
              {nonPreferredCountries.map((country) => (
                <span
                  key={country.code}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 'var(--space-xs)',
                    padding: '6px 12px',
                    background: 'var(--bg-tertiary)',
                    border: '1px solid var(--border-secondary)',
                    borderRadius: '16px',
                    fontSize: '13px',
                    color: 'var(--text-secondary)',
                    fontWeight: 500
                  }}
                >
                  <span>{country.flag}</span>
                  {country.name}
                  <button
                    onClick={() => removeNonPreferredCountry(country.code)}
                    style={{
                      background: 'none',
                      border: 'none',
                      padding: 0,
                      cursor: 'pointer',
                      color: 'var(--text-tertiary)',
                      display: 'flex',
                      alignItems: 'center',
                      transition: 'color 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      playSound('/hover.mp3', 0.3);
                      e.currentTarget.style.color = 'var(--error)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = 'var(--text-tertiary)';
                    }}
                  >
                    <svg style={{ width: '12px', height: '12px' }} fill="currentColor" viewBox="0 0 20 20">
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
                  background: nonPreferredCountries.length >= 3 ? 'var(--bg-tertiary)' : 'var(--bg-tertiary)',
                  border: '1px solid var(--border-primary)',
                  borderRadius: '8px',
                  color: 'var(--text-primary)',
                  fontSize: '14px',
                  outline: 'none',
                  opacity: nonPreferredCountries.length >= 3 ? 0.5 : 1,
                  cursor: nonPreferredCountries.length >= 3 ? 'not-allowed' : 'text',
                  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
                onFocus={(e) => {
                  if (nonPreferredCountries.length < 3) {
                    e.currentTarget.style.borderColor = 'var(--accent)';
                  }
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border-primary)';
                }}
              />
              {showNonPreferredDropdown && nonPreferredCountries.length < 3 && (
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  right: 0,
                  marginTop: '4px',
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-primary)',
                  borderRadius: '8px',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                  maxHeight: '200px',
                  overflowY: 'auto',
                  zIndex: 10
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
                        fontSize: '14px',
                        textAlign: 'left',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 'var(--space-sm)',
                        transition: 'background 0.2s'
                      }}
                      onMouseEnter={(e) => {
                        playSound('/hover.mp3', 0.3);
                        e.currentTarget.style.background = 'var(--bg-tertiary)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'transparent';
                      }}
                    >
                      <span>{country.flag}</span>
                      {country.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Apply Button */}
        <div style={{
          padding: 'var(--space-lg)',
          borderTop: '1px solid var(--border-primary)'
        }}>
          <button
            onClick={handleApply}
            style={{
              width: '100%',
              padding: 'var(--space-md)',
              background: 'var(--accent)',
              border: 'none',
              borderRadius: '8px',
              color: 'white',
              fontSize: '14px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 'var(--space-sm)'
            }}
            onMouseEnter={(e) => {
              playSound('/hover.mp3', 0.3);
              e.currentTarget.style.opacity = '0.9';
              e.currentTarget.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = '1';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            Apply Filters
          </button>
        </div>
      </div>
    </>
  );
}