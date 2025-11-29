import React from 'react';

const CompanyCard = ({
  companyName = 'Acme Corp',
  companyTagline = 'Innovation at Work',
  companyLogo = 'A'
}) => {
  return (
    <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-100 shadow-md w-36 sm:w-44 md:w-48 p-2 sm:p-3 mx-auto">
      <div className="flex items-center gap-1.5 sm:gap-2">
        <div className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 bg-gradient-to-br from-gray-900 to-gray-700 rounded-md sm:rounded-lg flex items-center justify-center text-white font-bold text-xs sm:text-sm flex-shrink-0">
          {companyLogo}
        </div>
        <div className="min-w-0">
          <h1 className="text-xs sm:text-sm font-semibold text-gray-900 truncate">{companyName}</h1>
          <p className="text-[8px] sm:text-[10px] text-gray-500 truncate">{companyTagline}</p>
        </div>
      </div>
    </div>
  );
};

export { CompanyCard };
