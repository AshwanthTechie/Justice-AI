import React, { useState, useRef, useEffect, useLayoutEffect } from 'react';

const itemStyle = {
  padding: '8px 10px',
  cursor: 'pointer',
  color: '#111'
};

const SearchableSelect = ({ options = [], value = '', onChange, placeholder = '', inputRef: externalInputRef }) => {
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState('');
  const wrapperRef = useRef(null);
  const inputRef = useRef(null);
  const [dropdownRect, setDropdownRect] = useState(null);

  useEffect(() => {
    const onDoc = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);

  useEffect(() => setFilter(value || ''), [value]);

  // If parent passed an external ref, copy the internal input DOM node to it so parent can call focus()
  useEffect(() => {
    if (externalInputRef) {
      // copy the DOM node reference so parent can call .focus()
      externalInputRef.current = inputRef.current;
    }
  }, [externalInputRef]);

  useLayoutEffect(() => {
    if (open && inputRef.current) {
      const rect = inputRef.current.getBoundingClientRect();
      setDropdownRect({ top: rect.bottom, left: rect.left, width: rect.width });
    }
  }, [open, filter]);

  useEffect(() => {
    const onResize = () => {
      if (open && inputRef.current) {
        const rect = inputRef.current.getBoundingClientRect();
        setDropdownRect({ top: rect.bottom, left: rect.left, width: rect.width });
      }
    };
    window.addEventListener('resize', onResize);
    window.addEventListener('scroll', onResize, true);
    return () => {
      window.removeEventListener('resize', onResize);
      window.removeEventListener('scroll', onResize, true);
    };
  }, [open]);

  const filtered = options && options.length
    ? options.filter(o => o.toLowerCase().includes(filter.toLowerCase()))
    : [];

  const handleSelect = (v) => {
    setFilter(v);
    setOpen(false);
    if (onChange) onChange(v);
  };

  return (
    <div ref={wrapperRef} style={{ position: 'relative' }}>
      <input
        ref={inputRef}
        type="text"
        value={filter}
        onChange={(e) => { setFilter(e.target.value); setOpen(true); }}
        onFocus={() => setOpen(true)}
        placeholder={placeholder}
        aria-autocomplete="list"
        style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
      />

      {open && dropdownRect && (
        <div
          role="listbox"
          style={{
            position: 'fixed',
            zIndex: 2000,
            background: 'white',
            color: '#111',
            border: '1px solid #ccc',
            top: dropdownRect.top + 'px',
            left: dropdownRect.left + 'px',
            width: dropdownRect.width + 'px',
            maxHeight: '220px',
            overflowY: 'auto',
            boxSizing: 'border-box'
          }}
        >
          {filtered.length ? (
            filtered.map(opt => (
              <div
                key={opt}
                style={itemStyle}
                onClick={() => handleSelect(opt)}
                onKeyDown={(e) => e.key === 'Enter' && handleSelect(opt)}
                tabIndex={0}
              >
                {opt}
              </div>
            ))
          ) : (
            <div style={{ padding: 8, color: '#666' }}>No matches</div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchableSelect;
