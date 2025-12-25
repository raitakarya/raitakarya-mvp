// Modern, Beautiful Job Card Component - Professional Design

import { Link } from 'react-router-dom';
import VerifiedBadge from './VerifiedBadge';
import WhatsAppButton from './WhatsAppButton';
import { formatDistance } from '../utils/distance';

interface ModernJobCardProps {
  job: any;
  onApply?: (jobId: string) => void;
  hasApplied?: boolean;
  userRole?: 'WORKER' | 'FARMER';
  showActions?: boolean;
}

export default function ModernJobCard({
  job,
  onApply,
  hasApplied = false,
  userRole = 'WORKER',
  showActions = true
}: ModernJobCardProps) {
  const statusColors = {
    OPEN: 'bg-green-100 text-green-700 border-green-200',
    IN_PROGRESS: 'bg-blue-100 text-blue-700 border-blue-200',
    COMPLETED: 'bg-gray-100 text-gray-700 border-gray-200',
    CANCELLED: 'bg-red-100 text-red-700 border-red-200'
  };

  return (
    <div className="group bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-green-200 hover:-translate-y-1">
      {/* Job Photos - Beautiful Grid */}
      {job.photos && job.photos.length > 0 && (
        <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200">
          <div className={`grid ${job.photos.length === 1 ? 'grid-cols-1' : job.photos.length === 2 ? 'grid-cols-2' : 'grid-cols-3'} h-full gap-0.5`}>
            {job.photos.slice(0, 3).map((photo: string, idx: number) => (
              <div key={idx} className="relative overflow-hidden">
                <img
                  src={photo}
                  alt={`${job.title} - Photo ${idx + 1}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
            ))}
          </div>

          {/* Status Badge - Overlay */}
          <div className="absolute top-3 left-3">
            <span className={`px-3 py-1 rounded-full text-xs font-bold border backdrop-blur-sm ${statusColors[job.status as keyof typeof statusColors]}`}>
              {job.status}
            </span>
          </div>

          {/* Distance Badge - Top Right */}
          {job.distance !== null && (
            <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-2xl px-4 py-2 shadow-lg">
              <div className="flex flex-col items-end">
                <span className="text-2xl font-black text-blue-600">{formatDistance(job.distance)}</span>
                <span className="text-xs text-gray-600 font-medium">away</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Content */}
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <h3 className="text-2xl font-bold text-gray-900 mb-1 group-hover:text-green-600 transition-colors">
              {job.title}
            </h3>
            <p className="text-gray-600 line-clamp-2 leading-relaxed">
              {job.description}
            </p>
          </div>
        </div>

        {/* Details Grid - Modern Layout */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          {/* Wage */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-3 border border-green-100">
            <div className="text-xs text-gray-600 font-medium mb-1">Wage/Day</div>
            <div className="text-2xl font-black text-green-600">₹{job.wagePerDay}</div>
          </div>

          {/* Duration */}
          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-3 border border-blue-100">
            <div className="text-xs text-gray-600 font-medium mb-1">Duration</div>
            <div className="text-2xl font-black text-blue-600">{job.duration} days</div>
          </div>

          {/* Workers Needed */}
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-3 border border-purple-100">
            <div className="text-xs text-gray-600 font-medium mb-1">Workers</div>
            <div className="text-2xl font-black text-purple-600">{job.workersNeeded}</div>
          </div>

          {/* Total Earning */}
          <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-3 border border-orange-100">
            <div className="text-xs text-gray-600 font-medium mb-1">Total Pay</div>
            <div className="text-2xl font-black text-orange-600">₹{job.wagePerDay * job.duration}</div>
          </div>
        </div>

        {/* Location */}
        <div className="flex items-center gap-2 text-gray-600 mb-4 bg-gray-50 rounded-lg p-3">
          <svg className="w-5 h-5 flex-shrink-0 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
          </svg>
          <span className="font-medium">{job.location}</span>
        </div>

        {/* Skills */}
        {job.requiredSkills && job.requiredSkills.length > 0 && (
          <div className="mb-4">
            <div className="text-xs text-gray-500 font-medium mb-2">Required Skills:</div>
            <div className="flex flex-wrap gap-2">
              {job.requiredSkills.map((skill: string, idx: number) => (
                <span
                  key={idx}
                  className="px-3 py-1 bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 rounded-full text-sm font-medium border border-green-200"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Farmer Info */}
        {job.farmer && (
          <div className="pt-4 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {job.farmer.profileImage ? (
                  <img
                    src={job.farmer.profileImage}
                    alt={job.farmer.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-green-200"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center">
                    <span className="text-white text-xl font-bold">
                      {job.farmer.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-gray-900">{job.farmer.name}</span>
                    <VerifiedBadge hasPhoto={!!job.farmer.profileImage} size="sm" />
                  </div>
                  <span className="text-xs text-gray-500">Posted by Farmer</span>
                </div>
              </div>

              {userRole === 'WORKER' && (
                <WhatsAppButton
                  phoneNumber={job.farmer.phone}
                  message={`Hello, I'm interested in your job: ${job.title}`}
                  size="sm"
                />
              )}
            </div>
          </div>
        )}

        {/* Actions */}
        {showActions && userRole === 'WORKER' && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            {hasApplied ? (
              <div className="flex items-center justify-center gap-2 py-3 bg-gray-100 rounded-xl">
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="font-bold text-gray-700">Already Applied</span>
              </div>
            ) : (
              <button
                onClick={() => onApply?.(job.id)}
                className="w-full py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-bold hover:shadow-lg hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2"
              >
                Apply Now
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
