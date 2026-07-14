import React from 'react'

const LocationSearchPanel = (props) => {
  const { suggestions, onLocationSelect } = props;

  return (
    <div>
      {suggestions && suggestions.length > 0 ? (
        suggestions.map((suggestion, idx) => {
          return (
            <div 
              key={idx} 
              onClick={() => {
                onLocationSelect(suggestion);
                props.setVehiclePanelOpen(false);
                props.setPanelOpen(true);
              }} 
              className='flex gap-4 border-2 p-3 border-gray-50 active:border-black rounded-xl items-center my-2 justify-start cursor-pointer hover:bg-gray-100'
            >
              <h2 className='bg-gray-300 h-9 flex items-center justify-center w-12 rounded-full'>
                <i className="ri-map-pin-fill"></i>
              </h2>
              <h4 className='font-medium'>{suggestion}</h4>
            </div>
          );
        })
      ) : (
        <div className='text-gray-500  '>
          {props.suggestions === undefined ? 'Type to search for locations...' : 'No suggestions found'}
        </div>
      )}
    </div>
  );
};

export default LocationSearchPanel;
