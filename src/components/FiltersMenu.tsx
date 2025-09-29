'use client';

import { useState, useRef, useEffect } from 'react';
import { countries, Country } from '@/lib/countries';

interface FiltersMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function FiltersMenu({ isOpen, onClose }: FiltersMenuProps) {
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
    // TODO: Apply filters logic
    console.log('Applying filters:', {
      interests,
      preferredCountries,
      nonPreferredCountries
    });
    onClose();
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={onClose}
        />
      )}

      {/* Filters Menu */}
      <div className={`fixed top-0 left-0 h-full w-80 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex justify-between items-center p-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">Filters</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            {/* Interests Section */}
            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-3">Interests</h3>
              <input
                type="text"
                placeholder="Type an interest and press Enter"
                value={interestInput}
                onChange={(e) => setInterestInput(e.target.value)}
                onKeyDown={handleInterestKeyDown}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
              />
              <div className="flex flex-wrap gap-2 mt-3">
                {interests.map((interest, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
                  >
                    {interest}
                    <button
                      onClick={() => removeInterest(interest)}
                      className="hover:bg-green-200 rounded-full p-0.5"
                    >
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Preferred Countries Section */}
            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-3">Preferred Countries</h3>
              <div className="flex flex-wrap gap-2 mb-3">
                {preferredCountries.map((country) => (
                  <span
                    key={country.code}
                    className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                  >
                    <span className="text-base">{country.flag}</span>
                    {country.name}
                    <button
                      onClick={() => removePreferredCountry(country.code)}
                      className="hover:bg-blue-200 rounded-full p-0.5"
                    >
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </span>
                ))}
              </div>
              <div className="relative" ref={preferredInputRef}>
                <input
                  type="text"
                  placeholder="Type name"
                  value={preferredSearch}
                  onChange={(e) => {
                    setPreferredSearch(e.target.value);
                    setShowPreferredDropdown(true);
                  }}
                  onFocus={() => setShowPreferredDropdown(true)}
                  disabled={preferredCountries.length >= 3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none disabled:bg-gray-100"
                />
                {showPreferredDropdown && preferredCountries.length < 3 && (
                  <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto z-10">
                    {getFilteredCountries(preferredSearch, preferredCountries, nonPreferredCountries).map((country) => (
                      <button
                        key={country.code}
                        onClick={() => addPreferredCountry(country)}
                        className="w-full px-3 py-2 text-left hover:bg-gray-50 flex items-center gap-2"
                      >
                        <span className="text-base">{country.flag}</span>
                        {country.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Non-Preferred Countries Section */}
            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-3">Non-Preferred Countries</h3>
              <div className="flex flex-wrap gap-2 mb-3">
                {nonPreferredCountries.map((country) => (
                  <span
                    key={country.code}
                    className="inline-flex items-center gap-2 px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm"
                  >
                    <span className="text-base">{country.flag}</span>
                    {country.name}
                    <button
                      onClick={() => removeNonPreferredCountry(country.code)}
                      className="hover:bg-red-200 rounded-full p-0.5"
                    >
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </span>
                ))}
              </div>
              <div className="relative" ref={nonPreferredInputRef}>
                <input
                  type="text"
                  placeholder="Type name"
                  value={nonPreferredSearch}
                  onChange={(e) => {
                    setNonPreferredSearch(e.target.value);
                    setShowNonPreferredDropdown(true);
                  }}
                  onFocus={() => setShowNonPreferredDropdown(true)}
                  disabled={nonPreferredCountries.length >= 3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none disabled:bg-gray-100"
                />
                {showNonPreferredDropdown && nonPreferredCountries.length < 3 && (
                  <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto z-10">
                    {getFilteredCountries(nonPreferredSearch, nonPreferredCountries, preferredCountries).map((country) => (
                      <button
                        key={country.code}
                        onClick={() => addNonPreferredCountry(country)}
                        className="w-full px-3 py-2 text-left hover:bg-gray-50 flex items-center gap-2"
                      >
                        <span className="text-base">{country.flag}</span>
                        {country.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Apply Button */}
          <div className="p-4 border-t border-gray-200">
            <button
              onClick={handleApply}
              className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>
    </>
  );
}