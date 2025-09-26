export const MessageSkeleton = () => (
  <div className="flex flex-col space-y-2">
    <div className="flex items-center space-x-2">
      <div className="w-8 h-8 bg-gray-300 rounded-full animate-pulse"></div>
      <div className="h-4 bg-gray-300 rounded w-1/4 animate-pulse"></div>
    </div>
    <div className="h-12 bg-gray-300 rounded animate-pulse"></div>
  </div>
);

export const TeamMemberSkeleton = () => (
  <div className="flex items-center gap-3 p-3 bg-background/50 rounded-lg border border-border">
    <div className="w-10 h-10 bg-gray-300 rounded-full animate-pulse"></div>
    <div className="flex-1 space-y-2">
      <div className="h-4 bg-gray-300 rounded w-3/4 animate-pulse"></div>
      <div className="h-3 bg-gray-300 rounded w-1/2 animate-pulse"></div>
    </div>
    <div className="w-2 h-2 bg-gray-300 rounded-full animate-pulse"></div>
  </div>
);

export const HackathonDetailSkeleton = () => (
  <div className="space-y-3">
    <div className="h-6 bg-gray-300 rounded w-full animate-pulse"></div>
    <div className="h-4 bg-gray-300 rounded w-2/3 animate-pulse"></div>
    <div className="h-4 bg-gray-300 rounded w-1/2 animate-pulse"></div>
  </div>
);