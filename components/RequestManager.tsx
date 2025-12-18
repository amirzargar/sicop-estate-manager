
import React, { useState } from 'react';
import { ServiceRequest, UserRole, User } from '../types';
import { CheckCircle, XCircle, Clock, FileSignature, AlertCircle, Building, Factory, Briefcase, Paperclip, Send, User as UserIcon } from 'lucide-react';

interface RequestManagerProps {
  requests: ServiceRequest[];
  users: User[];
  onApprove: (request: ServiceRequest) => void;
  onForward: (requestId: string, remarks: string) => void;
  onReject: (requestId: string, comments: string) => void;
  userRole: UserRole;
}

export const RequestManager: React.FC<RequestManagerProps> = ({ requests, users, onApprove, onForward, onReject, userRole }) => {
  // Logic for Admin: See FORWARDED_TO_ADMIN and PENDING (Direct requests from Manager)
  // Logic for Manager: See SUBMITTED_TO_MANAGER
  
  const pendingRequests = requests.filter(r => {
      // Ensure we don't show processed requests in pending
      if (r.status === 'APPROVED' || r.status === 'REJECTED') return false;

      if (userRole === UserRole.ADMIN) {
          // Admin sees items forwarded by manager OR items that go directly to admin 
          return r.status === 'FORWARDED_TO_ADMIN' || r.status === 'PENDING';
      }
      if (userRole === UserRole.MANAGER) {
          return r.status === 'SUBMITTED_TO_MANAGER';
      }
      return false;
  });

  const pastRequests = requests.filter(r => {
      if (userRole === UserRole.MANAGER) {
           // Manager sees what they have forwarded or processed
           return r.status === 'FORWARDED_TO_ADMIN' || r.status === 'APPROVED' || r.status === 'REJECTED';
      }
      // Admin sees history
      return r.status === 'APPROVED' || r.status === 'REJECTED';
  }).sort((a,b) => new Date(b.requestDate).getTime() - new Date(a.requestDate).getTime());

  const getIcon = (type: string) => {
    switch(type) {
      case 'NEW_UNIT': return <Factory className="w-4 h-4" />;
      case 'ESTATE_EDIT': return <Building className="w-4 h-4" />;
      default: return <FileSignature className="w-4 h-4" />;
    }
  };

  // Fix: Explicitly defining props type to allow 'key' when used as a JSX component
  const RequestCard = ({ req, isPending }: { req: ServiceRequest, isPending: boolean, key?: string }) => {
      const [remarks, setRemarks] = useState('');
      const [showRemarksInput, setShowRemarksInput] = useState(false);

      const handleForwardClick = () => {
          if (remarks.trim()) {
              onForward(req.id, remarks);
              setShowRemarksInput(false);
          }
      }

      // Logic to resolve "Assigned To"
      const getAssigneeInfo = () => {
          if (userRole === UserRole.ADMIN) {
              // For Admin, show which Manager is handling the estate
              const manager = users.find(u => 
                  u.role === UserRole.MANAGER && 
                  req.estateId && 
                  u.assignedEstateIds?.includes(req.estateId)
              );
              return { 
                name: manager ? manager.name : 'System Direct', 
                badgeClass: 'bg-indigo-50 text-indigo-700 border-indigo-100' 
              };
          } else if (userRole === UserRole.MANAGER) {
              // For Manager, show if it's currently with them or escalated to Admin
              if (req.status === 'FORWARDED_TO_ADMIN') {
                  return { name: 'Administrator', badgeClass: 'bg-blue-50 text-blue-700 border-blue-100' };
              }
              return { name: 'Local Manager (Me)', badgeClass: 'bg-slate-50 text-slate-700 border-slate-100' };
          }
          return null;
      };

      const assignee = getAssigneeInfo();

      return (
        <div className={`border rounded-lg p-4 mb-3 transition-all ${isPending ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-50 border-slate-100 opacity-75'}`}>
          <div className="flex justify-between items-start mb-2">
            <div className="flex items-center gap-2">
              <span className={`p-2 rounded-full ${
                req.type === 'NEW_UNIT' ? 'bg-purple-100 text-purple-600' :
                req.type === 'ESTATE_EDIT' ? 'bg-blue-100 text-blue-600' :
                'bg-amber-100 text-amber-600'
              }`}>
                {getIcon(req.type)}
              </span>
              <div>
                <h4 className="font-semibold text-slate-800 text-sm">{req.type.replace(/_/g, ' ')}</h4>
                <p className="text-xs text-slate-500">
                   Target: <span className="font-medium text-slate-700">{req.targetName}</span>
                   {req.requesterRole && <span className="ml-2 text-slate-400">by {req.requesterRole.toLowerCase()}</span>}
                </p>
              </div>
            </div>
            <div className={`px-2 py-1 rounded text-[10px] font-bold flex items-center gap-1 uppercase tracking-tight ${
                req.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-700' :
                req.status === 'REJECTED' ? 'bg-red-100 text-red-700' :
                req.status === 'FORWARDED_TO_ADMIN' ? 'bg-blue-100 text-blue-700' :
                'bg-amber-100 text-amber-700'
            }`}>
                {req.status === 'APPROVED' && <CheckCircle className="w-3 h-3"/>}
                {req.status === 'REJECTED' && <XCircle className="w-3 h-3"/>}
                {(req.status === 'SUBMITTED_TO_MANAGER' || req.status === 'PENDING') && <Clock className="w-3 h-3"/>}
                {req.status === 'FORWARDED_TO_ADMIN' && <Briefcase className="w-3 h-3"/>}
                {req.status.replace(/_/g, ' ')}
            </div>
          </div>
          
          <div className="ml-10 space-y-2">
            <p className="text-sm text-slate-600">{req.description}</p>
            
            {/* New "Assigned To" Field */}
            {assignee && (
               <div className={`flex items-center gap-2 px-2 py-1 rounded border text-[11px] w-fit font-medium ${assignee.badgeClass}`}>
                  <UserIcon className="w-3 h-3" />
                  <span className="opacity-70">Assigned To:</span>
                  <span>{assignee.name}</span>
               </div>
            )}

            {req.documentName && (
                <div className="flex items-center gap-2 text-[11px] text-blue-600 bg-blue-50 w-fit px-2 py-1 rounded border border-blue-100">
                    <Paperclip className="w-3 h-3" /> 
                    <a href="#" onClick={(e) => e.preventDefault()} className="hover:underline font-medium">View: {req.documentName}</a>
                </div>
            )}
    
            {req.payload && (
               <div className="bg-slate-50 p-2 rounded border border-slate-200 text-[10px] text-slate-500 font-mono overflow-x-auto">
                 Changes: {JSON.stringify(req.payload).substring(0, 80)}...
               </div>
            )}
            
            {req.managerRemarks && (
                 <div className="text-xs text-slate-500 bg-slate-100 p-2 rounded border border-slate-200">
                    <span className="font-semibold text-slate-700">Manager Remarks:</span> {req.managerRemarks}
                 </div>
            )}
    
            <div className="flex justify-between items-center text-[11px] text-slate-400 pt-2 border-t border-slate-100">
                <span>Requested: {req.requestDate}</span>
                {isPending && (
                    <div className="flex gap-2">
                        {userRole === UserRole.MANAGER && (
                            <>
                                <button 
                                    onClick={() => onReject(req.id, 'Rejected by Manager')}
                                    className="px-3 py-1.5 border border-red-200 text-red-600 rounded hover:bg-red-50 font-medium transition-colors"
                                >
                                    Reject
                                </button>
                                {showRemarksInput ? (
                                    <div className="flex items-center gap-2">
                                        <input 
                                            autoFocus
                                            type="text" 
                                            placeholder="Add remarks..." 
                                            className="border border-blue-300 rounded px-2 py-1 text-[11px] text-slate-800 w-32"
                                            value={remarks}
                                            onChange={e => setRemarks(e.target.value)}
                                        />
                                        <button 
                                            onClick={handleForwardClick}
                                            className="px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                                        >
                                            <Send className="w-3 h-3" />
                                        </button>
                                    </div>
                                ) : (
                                    <button 
                                        onClick={() => setShowRemarksInput(true)}
                                        className="px-3 py-1.5 bg-blue-600 text-white rounded hover:bg-blue-700 font-medium transition-colors shadow-sm flex items-center gap-1"
                                    >
                                        Forward to Admin <Send className="w-3 h-3" />
                                    </button>
                                )}
                            </>
                        )}
                        
                        {userRole === UserRole.ADMIN && (
                            <>
                                <button 
                                    onClick={() => onReject(req.id, 'Rejected by Admin')}
                                    className="px-3 py-1.5 border border-red-200 text-red-600 rounded hover:bg-red-50 font-medium transition-colors"
                                >
                                    Reject
                                </button>
                                <button 
                                    onClick={() => onApprove(req)}
                                    className="px-3 py-1.5 bg-emerald-600 text-white rounded hover:bg-emerald-700 font-medium transition-colors shadow-sm"
                                >
                                    Approve & Apply
                                </button>
                            </>
                        )}
                    </div>
                )}
            </div>
            {req.comments && <div className="mt-2 text-[10px] text-red-500 italic">Rejection Reason: {req.comments}</div>}
          </div>
        </div>
      );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full overflow-hidden">
      <div className="flex flex-col h-full bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
         <div className="p-4 border-b border-slate-200 bg-amber-50 flex justify-between items-center">
             <div className="flex items-center gap-2">
                 <AlertCircle className="w-5 h-5 text-amber-600"/>
                 <h3 className="font-bold text-amber-900">
                    {userRole === UserRole.MANAGER ? 'Requests for Review' : 'Pending Admin Approvals'}
                 </h3>
             </div>
             <span className="bg-amber-200 text-amber-800 text-xs px-2 py-0.5 rounded-full font-bold">{pendingRequests.length}</span>
         </div>
         <div className="p-4 overflow-y-auto flex-1 bg-slate-50/50">
             {pendingRequests.length === 0 ? (
                 <div className="h-full flex flex-col items-center justify-center text-slate-400">
                     <CheckCircle className="w-12 h-12 mb-2 text-slate-200" />
                     <p>All caught up! No pending requests.</p>
                 </div>
             ) : pendingRequests.map(req => <RequestCard key={req.id} req={req} isPending={true} />)}
         </div>
      </div>

      <div className="flex flex-col h-full bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
         <div className="p-4 border-b border-slate-200 bg-slate-50">
             <h3 className="font-bold text-slate-700">Request History</h3>
         </div>
         <div className="p-4 overflow-y-auto flex-1">
            {pastRequests.length === 0 ? (
                 <div className="text-center text-slate-400 mt-10">No history available.</div>
             ) : pastRequests.map(req => <RequestCard key={req.id} req={req} isPending={false} />)}
         </div>
      </div>
    </div>
  );
};
