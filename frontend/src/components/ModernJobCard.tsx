// Modern, Beautiful Job Card Component - Professional Design

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
    OPEN: 'bg-gradient-to-r from-green-500 to-emerald-500 text-white',
    IN_PROGRESS: 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white',
    COMPLETED: 'bg-gradient-to-r from-gray-500 to-slate-500 text-white',
    CANCELLED: 'bg-gradient-to-r from-red-500 to-rose-500 text-white'
  };

  return (
    <div className="group bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border-2 border-gray-100 hover:border-green-300 hover:-translate-y-2 hover:scale-[1.02]">
      {/* Job Photos - Beautiful Grid */}
      {job.photos && job.photos.length > 0 && (
        <div className="relative h-56 bg-gradient-to-br from-gray-50 to-gray-100">
          <div className={`grid ${job.photos.length === 1 ? 'grid-cols-1' : job.photos.length === 2 ? 'grid-cols-2' : 'grid-cols-3'} h-full gap-1`}>
            {job.photos.slice(0, 3).map((photo: string, idx: number) => (
              <div key={idx} className="relative overflow-hidden">
                <img
                  src={photo}
                  alt={`${job.title} - Photo ${idx + 1}`}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            ))}
          </div>

          {/* Status Badge - Overlay with Gradient */}
          <div className="absolute top-4 left-4">
            <span className={`px-4 py-2 rounded-2xl text-xs font-bold shadow-lg ${statusColors[job.status as keyof typeof statusColors]}`}>
              {job.status.replace('_', ' ')}
            </span>
          </div>

          {/* Distance Badge - MASSIVE & EYE-CATCHING */}
          {job.distance !== null && (
            <div className="absolute top-4 right-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl px-5 py-3 shadow-2xl transform group-hover:scale-110 transition-transform duration-300">
              <div className="flex flex-col items-end">
                <span className="text-3xl font-black text-white leading-none">{formatDistance(job.distance)}</span>
                <span className="text-xs text-blue-100 font-bold uppercase tracking-wide">away</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Content */}
      <div className="p-7">
        {/* Header */}
        <div className="flex justify-between items-start mb-5">
          <div className="flex-1">
            <h3 className="text-2xl font-black text-gray-900 mb-2 group-hover:text-green-600 transition-colors leading-tight">
              {job.title}
            </h3>
            <p className="text-gray-600 line-clamp-2 leading-relaxed text-base">
              {job.description}
            </p>
          </div>
        </div>

        {/* Details Grid - STUNNING CARDS */}
        <div className="grid grid-cols-2 gap-4 mb-5">
          {/* Wage - PRIMARY FOCUS */}
          <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-4 shadow-md hover:shadow-xl transition-shadow">
            <div className="text-xs text-green-100 font-bold uppercase tracking-wide mb-1">Daily Wage</div>
            <div className="text-3xl font-black text-white">₹{job.wagePerDay.toLocaleString()}</div>
          </div>

          {/* Duration */}
          <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl p-4 shadow-md hover:shadow-xl transition-shadow">
            <div className="text-xs text-blue-100 font-bold uppercase tracking-wide mb-1">Duration</div>
            <div className="text-3xl font-black text-white">{job.duration} days</div>
          </div>

          {/* Workers Needed */}
          <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl p-4 shadow-md hover:shadow-xl transition-shadow">
            <div className="text-xs text-purple-100 font-bold uppercase tracking-wide mb-1">Workers</div>
            <div className="text-3xl font-black text-white">{job.workersNeeded}</div>
          </div>

          {/* Total Earning - HIGHLIGHT */}
          <div className="bg-gradient-to-br from-orange-500 to-amber-600 rounded-2xl p-4 shadow-md hover:shadow-xl transition-shadow relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10"></div>
            <div className="text-xs text-orange-100 font-bold uppercase tracking-wide mb-1">Total Pay</div>
            <div className="text-3xl font-black text-white">₹{(job.wagePerDay * job.duration).toLocaleString()}</div>
          </div>
        </div>

        {/* Location - Beautiful Badge */}
        <div className="flex items-center gap-3 text-gray-700 mb-5 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4 border border-gray-200">
          <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
          </div>
          <span className="font-bold text-lg">{job.location}</span>
        </div>

        {/* Skills - Premium Pills */}
        {job.requiredSkills && job.requiredSkills.length > 0 && (
          <div className="mb-5">
            <div className="text-xs text-gray-500 font-bold uppercase tracking-wide mb-3">Required Skills</div>
            <div className="flex flex-wrap gap-2">
              {job.requiredSkills.map((skill: string, idx: number) => (
                <span
                  key={idx}
                  className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl text-sm font-bold shadow-md hover:shadow-lg hover:scale-105 transition-all"
                >
                  ✓ {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Farmer Info - PREMIUM */}
        {job.farmer && (
          <div className="pt-5 border-t-2 border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {job.farmer.profileImage ? (
                  <div className="relative">
                    <img
                      src={job.farmer.profileImage}
                      alt={job.farmer.name}
                      className="w-14 h-14 rounded-2xl object-cover border-3 border-white shadow-lg"
                    />
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white"></div>
                  </div>
                ) : (
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center shadow-lg">
                    <span className="text-white text-2xl font-bold">
                      {job.farmer.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-black text-gray-900 text-lg">{job.farmer.name}</span>
                    <VerifiedBadge hasPhoto={!!job.farmer.profileImage} size="md" />
                  </div>
                  <span className="text-sm text-gray-500 font-medium">Farmer • Posted Job</span>
                </div>
              </div>

              {userRole === 'WORKER' && (
                <WhatsAppButton
                  phoneNumber={job.farmer.phone}
                  message={`Hello, I'm interested in your job: ${job.title}`}
                  size="md"
                />
              )}
            </div>
          </div>
        )}

        {/* Actions - MEGA BUTTON */}
        {showActions && userRole === 'WORKER' && (
          <div className="mt-6 pt-5 border-t-2 border-gray-100">
            {hasApplied ? (
              <div className="flex items-center justify-center gap-3 py-4 bg-gradient-to-r from-gray-100 to-gray-200 rounded-2xl border-2 border-gray-300">
                <div className="w-8 h-8 bg-gradient-to-r from-gray-500 to-gray-600 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="font-black text-gray-700 text-lg">Already Applied</span>
              </div>
            ) : (
              <button
                onClick={() => onApply?.(job.id)}
                className="w-full py-5 bg-gradient-to-r from-green-600 via-emerald-600 to-green-600 text-white rounded-2xl font-black text-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3 relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:translate-x-full transition-transform duration-1000"></div>
                <span>Apply Now</span>
                <svg className="w-6 h-6 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
