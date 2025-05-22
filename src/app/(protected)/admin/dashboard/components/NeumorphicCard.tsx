import { motion } from 'framer-motion';
import React, { useState } from 'react';

type NeumorphicCardProps = {
  title: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
  delay?: number;
  expandable?: boolean;
  defaultExpanded?: boolean;
};

/**
 * NeumorphicCard Component
 * A card with neumorphic styling that can be expanded/collapsed
 */
const NeumorphicCard: React.FC<NeumorphicCardProps> = ({
  title,
  children,
  icon,
  delay = 0,
  expandable = false,
  defaultExpanded = true,
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: delay * 0.1 }}
      className="bg-white rounded-xl p-6 shadow-neumorph hover:shadow-neumorph-hover transition-all duration-300"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          {icon && (
            <div className="p-2 rounded-lg bg-[#0089AD] bg-opacity-10 text-[#0089AD]">
              {icon}
            </div>
          )}
          <h2 className="text-xl font-semibold">{title}</h2>
        </div>
        {expandable && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-[#0089AD] focus:ring-opacity-50"
            aria-label={isExpanded ? 'Collapse' : 'Expand'}
          >
            {isExpanded ? (
              <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            )}
          </button>
        )}
      </div>
      {(!expandable || isExpanded) && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.2 }}
        >
          {children}
        </motion.div>
      )}
    </motion.div>
  );
};

export default NeumorphicCard;
