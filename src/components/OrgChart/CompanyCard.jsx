import React from 'react';

const CompanyCard = ({
  companyName = 'Acme Corp',
  companyTagline = 'Innovation at Work',
  companyLogo = 'A'
}) => {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-md w-48 p-3 mx-auto">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-gradient-to-br from-gray-900 to-gray-700 rounded-lg flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
          {companyLogo}
        </div>
        <div className="min-w-0">
          <h1 className="text-sm font-semibold text-gray-900 truncate">{companyName}</h1>
          <p className="text-[10px] text-gray-500 truncate">{companyTagline}</p>
        </div>
      </div>
    </div>
  );
};

export { CompanyCard };
