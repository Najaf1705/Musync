// components/CustomToast.js
import React from 'react';
import toast from 'react-hot-toast';
import { FiCheckCircle, FiXCircle, FiInfo, FiX } from 'react-icons/fi';

export default function CustomToast({ t, message, type }) {
  const styleMap = {
    success: {
      bg: 'border border-green-500 bg-green-50 text-green-700 shadow-md hover:shadow-lg',
      Icon: FiCheckCircle,
    },
    error: {
      bg: 'border border-red-500 bg-red-50 text-red-700 shadow-md hover:shadow-lg',
      Icon: FiXCircle,
    },
    info: {
      bg: 'border border-yellow-500 bg-yellow-50 text-yellow-700 shadow-md hover:shadow-lg',
      Icon: FiInfo,
    },
  };

  const { bg, Icon } = styleMap[type] || styleMap.info;

  return (
    <div
      className={`w-72 max-w-sm px-4 py-4 rounded flex items-center justify-between gap-3 ${bg}`}
    >
      <div className="flex items-center gap-2">
        <Icon className="w-5 h-5" />
        <span className="text-sm">{message}</span>
      </div>
      <button onClick={() => toast.dismiss(t.id)} className="text-lg font-bold">
        <FiX className="w-5 h-5" />
      </button>
    </div>
  );
}
