import React, { useState } from 'react';
import { Unit, Estate, UnitHistory, ServiceRequest, UserRole } from '../types';
import { ArrowLeft, Building, User, Users, Phone, Mail, FileText, History, DollarSign, Calendar, FileSignature, CheckCircle, XCircle, AlertCircle, Upload, Paperclip, Briefcase } from 'lucide-react';

interface UnitDetailProps {
  unit: Unit;
  estate?: Estate;
  userRole: UserRole;
  requests: ServiceRequest[];
  onRequestAdd: (request: Partial<ServiceRequest>) => void;
  onRequestUpdate: (id: string, status: 'APPROVED' | 'REJECTED', comments?: string) => void;
  onBack: () => void;
}

export const UnitDetail: React.FC<UnitDetailProps> = ({ 
  unit, 
  estate, 
  userRole, 
  requests, 
  onRequestAdd, 
  onRequestUpdate, 
  onBack 
}) => {
  const [activeTab, setActiveTab] = useState<'info' | 'lease' | 'history' | 'requests'>('info');
  const [showRequestForm, setShowRequestForm] = useState(false);
  
  // Dynamic Request State
  const [requestType, setRequestType] = useState<string>('CONTACT_CHANGE');
  const [description, setDescription] = useState('');
  const [document, setDocument] = useState<File | null>(null);
  
  // Specific Payloads
  const [payload, setPayload] = useState<any>({});

  const unitRequests = requests.filter(r => r.targetId === unit.id);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setDocument(e.target.files[0]);
    }
  };

  const handleSubmitRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (description.trim()) {
      
      if (!document && userRole === UserRole.UNIT_HOLDER) {
          alert("Documentary evidence is required.");
          return;
      }

      onRequestAdd({
        targetId: unit.id,
        targetName: unit.name,
        estateId: unit.estateId,
        type: requestType as any,
        description: description,
        status: 'SUBMITTED_TO_MANAGER',
        requestDate: new Date().toISOString().split('T')[0],
        requesterRole: userRole,
        payload: payload,
        documentName: document ? document.name : 'No Document'
      });
      setShowRequestForm(false);
      setDescription('');
      setDocument(null);
      setPayload({});
      setRequestType('CONTACT_CHANGE');
    }
  };

  const renderRequestInputs = () => {
      switch(requestType) {
          case 'CONTACT_CHANGE':
              return (
                  <div className="grid grid-cols-2 gap-4">
                      <div>
                          <label className="block text-xs font-medium text-blue-900 mb-1">New Phone Number</label>
                          <input 
                            type="text" className="w-full border border-blue-200 rounded p-2 text-sm"
                            placeholder={unit.contactPhone}
                            onChange={e => setPayload({...payload, contactPhone: e.target.value})}
                          />
                      </div>
                      <div>
                          <label className="block text-xs font-medium text-blue-900 mb-1">New Email Address</label>
                          <input 
                            type="email" className="w-full border border-blue-200 rounded p-2 text-sm"
                            placeholder={unit.contactEmail}
                            onChange={e => setPayload({...payload, contactEmail: e.target.value})}
                          />
                      </div>
                  </div>
              );
           case 'PROPRIETOR_CHANGE':
               return (
                   <div>
                        <label className="block text-xs font-medium text-blue-900 mb-1">New Proprietor Name</label>
                        <input 
                            type="text" className="w-full border border-blue-200 rounded p-2 text-sm"
                            placeholder={unit.proprietorName}
                            onChange={e => setPayload({...payload, proprietorName: e.target.value})}
                        />
                   </div>
               );
            case 'NAME_CHANGE':
               return (
                   <div>
                        <label className="block text-xs font-medium text-blue-900 mb-1">New Unit Name</label>
                        <input 
                            type="text" className="w-full border border-blue-200 rounded p-2 text-sm"
                            placeholder={unit.name}
                            onChange={e => setPayload({...payload, name: e.target.value})}
                        />
                   </div>
               );
            case 'ACTIVITY_CHANGE':
                return (
                   <div>
                        <label className="block text-xs font-medium text-blue-900 mb-1">New Line of Activity</label>
                        <input 
                            type="text" className="w-full border border-blue-200 rounded p-2 text-sm"
                            placeholder={unit.lineOfActivity}
                            onChange={e => setPayload({...payload, lineOfActivity: e.target.value})}
                        />
                   </div>
                );
             case 'EMPLOYEE_CHANGE':
                return (
                   <div>
                        <label className="block text-xs font-medium text-blue-900 mb-1">Updated Employee Count</label>
                        <input 
                            type="number" className="w-full border border-blue-200 rounded p-2 text-sm"
                            placeholder={unit.employeeCount.toString()}
                            onChange={e => setPayload({...payload, employeeCount: Number(e.target.value)})}
                        />
                   </div>
                );
             case 'CONSTITUTION_CHANGE':
                return (
                   <div>
                        <label className="block text-xs font-medium text-blue-900 mb-1">New Constitution Type</label>
                        <select 
                             className="w-full border border-blue-200 rounded p-2 text-sm bg-white"
                             onChange={e => setPayload({...payload, constitution: e.target.value})}
                        >
                            <option value="">Select Type...</option>
                            <option value="Proprietorship">Proprietorship</option>
                            <option value="Partnership">Partnership</option>
                            <option value="Private Limited">Private Limited</option>
                            <option value="Public Limited">Public Limited</option>
                        </select>
                   </div>
                );
          default:
              return null;
      }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-4">
        {userRole !== UserRole.UNIT_HOLDER && (
          <button onClick={onBack} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
            <ArrowLeft className="w-5 h-5 text-slate-600" />
          </button>
        )}
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{unit.name}</h1>
          <p className="text-slate-500 text-sm flex items-center gap-2">
            <Building className="w-3 h-3" /> {estate?.name} &bull; {estate?.location}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 overflow-x-auto">
        <button
          onClick={() => setActiveTab('info')}
          className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === 'info' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
        >
          General Information
        </button>
        <button
          onClick={() => setActiveTab('lease')}
          className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === 'lease' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
        >
          Lease & Rent
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === 'history' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
        >
          History & Changes
        </button>
        <button
          onClick={() => setActiveTab('requests')}
          className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap flex items-center gap-2 ${activeTab === 'requests' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
        >
          Service Requests
          {unitRequests.filter(r => r.status !== 'APPROVED' && r.status !== 'REJECTED').length > 0 && (
            <span className="bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-full text-xs">
              {unitRequests.filter(r => r.status !== 'APPROVED' && r.status !== 'REJECTED').length}
            </span>
          )}
        </button>
      </div>

      {/* Content */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 min-h-[400px]">
        {activeTab === 'info' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <SectionHeader icon={<User className="w-5 h-5" />} title="Proprietor Details" />
              <div className="space-y-4">
                <DetailRow label="Proprietor Name" value={unit.proprietorName} />
                <DetailRow label="Constitution" value={unit.constitution || 'N/A'} icon={<FileText className="w-4 h-4 text-slate-400" />} />
                <DetailRow label="Contact Phone" value={unit.contactPhone} icon={<Phone className="w-4 h-4 text-slate-400" />} />
                <DetailRow label="Contact Email" value={unit.contactEmail} icon={<Mail className="w-4 h-4 text-slate-400" />} />
              </div>
            </div>
            
            <div className="space-y-6">
              <SectionHeader icon={<Building className="w-5 h-5" />} title="Business Details" />
              <div className="space-y-4">
                <DetailRow label="Line of Activity" value={unit.lineOfActivity} />
                <DetailRow label="Number of Employees" value={unit.employeeCount.toString()} icon={<Users className="w-4 h-4 text-slate-400" />} />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'lease' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <SectionHeader icon={<FileText className="w-5 h-5" />} title="Lease Agreement" />
                <div className="space-y-4">
                  <DetailRow label="Lease Deed Date" value={unit.leaseDeedDate} icon={<Calendar className="w-4 h-4 text-slate-400" />} />
                  <DetailRow label="Duration" value={`${unit.leaseDurationYears} Years`} />
                  <DetailRow label="Expiry Date" value="Calculated automatically..." />
                </div>
              </div>

              <div className="space-y-6">
                <SectionHeader icon={<DollarSign className="w-5 h-5" />} title="Rent Details" />
                <div className="space-y-4">
                   <div className="flex justify-between items-center py-2 border-b border-slate-50">
                      <span className="text-sm text-slate-500">Current Status</span>
                      <span className={`px-2 py-1 rounded text-xs font-bold ${
                        unit.rentStatus === 'PAID' ? 'bg-emerald-100 text-emerald-700' : 
                        unit.rentStatus === 'OVERDUE' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                      }`}>
                        {unit.rentStatus}
                      </span>
                   </div>
                   <DetailRow label="Monthly Rent" value={`₹${unit.monthlyRent.toLocaleString()}`} />
                   <DetailRow label="Last Payment" value={unit.lastRentPaymentDate} />
                   <DetailRow label="Agreement Date" value={unit.rentAgreementDate} />
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="space-y-6">
            <SectionHeader icon={<History className="w-5 h-5" />} title="Unit History Log" />
            <div className="space-y-4">
              {unit.history.length === 0 ? (
                <p className="text-slate-500 italic text-center py-8">No history records found for this unit.</p>
              ) : (
                unit.history.map((record) => (
                  <div key={record.id} className="flex gap-4 p-4 bg-slate-50 rounded-lg border border-slate-100">
                    <div className="flex-shrink-0 mt-1">
                      <div className="w-2 h-2 rounded-full bg-blue-500 ring-4 ring-blue-100"></div>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                         <span className="font-semibold text-slate-800 text-sm">
                           {record.type.replace('_', ' ')}
                         </span>
                         <span className="text-xs text-slate-400">{record.date}</span>
                      </div>
                      <p className="text-sm text-slate-600">{record.description}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === 'requests' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center border-b border-slate-100 pb-2">
              <SectionHeader icon={<FileSignature className="w-5 h-5" />} title="Service Requests" />
              {userRole === UserRole.UNIT_HOLDER && !showRequestForm && (
                <button 
                  onClick={() => setShowRequestForm(true)}
                  className="bg-blue-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  New Request
                </button>
              )}
            </div>

            {showRequestForm && (
               <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 animate-fade-in-down mb-6">
                 <h4 className="font-semibold text-blue-800 mb-3">Apply for Change</h4>
                 <form onSubmit={handleSubmitRequest} className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-blue-900 mb-1">Request Type</label>
                      <select 
                        className="w-full border border-blue-200 rounded-md p-2 bg-white text-sm"
                        value={requestType}
                        onChange={e => {
                            setRequestType(e.target.value);
                            setPayload({});
                        }}
                      >
                        <option value="CONTACT_CHANGE">Change of Contact (Phone/Email)</option>
                        <option value="ACTIVITY_CHANGE">Change in Line of Activity</option>
                        <option value="PROPRIETOR_CHANGE">Change in Proprietor Name</option>
                        <option value="CONSTITUTION_CHANGE">Change in Constitution</option>
                        <option value="EMPLOYEE_CHANGE">Change in No. of Employees</option>
                        <option value="NAME_CHANGE">Change of Unit Name</option>
                        <option value="LEASE_RENEWAL">Lease Renewal</option>
                        <option value="OTHER">Other Service</option>
                      </select>
                    </div>
                    
                    {renderRequestInputs()}

                    <div>
                      <label className="block text-sm font-medium text-blue-900 mb-1">Description/Reason</label>
                      <textarea 
                        className="w-full border border-blue-200 rounded-md p-2 bg-white h-24 text-sm"
                        placeholder="Please describe the details of your request..."
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                        required
                      />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-blue-900 mb-1 flex items-center gap-2">
                            Documentary Evidence <span className="text-red-500">*</span>
                        </label>
                        <div className="flex items-center gap-2 mt-1">
                            <label className="cursor-pointer bg-white border border-blue-200 hover:bg-blue-50 text-blue-700 px-4 py-2 rounded-md flex items-center gap-2 text-sm transition-colors">
                                <Upload className="w-4 h-4" />
                                {document ? 'Change File' : 'Upload PDF/JPEG'}
                                <input 
                                    type="file" 
                                    accept=".pdf,.jpg,.jpeg,.png"
                                    className="hidden"
                                    onChange={handleFileChange}
                                    required
                                />
                            </label>
                            {document && (
                                <span className="text-sm text-slate-600 flex items-center gap-1">
                                    <Paperclip className="w-3 h-3" /> {document.name}
                                </span>
                            )}
                        </div>
                        <p className="text-xs text-slate-400 mt-1">Please upload relevant documentary proof to support your request.</p>
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                      <button 
                        type="button" 
                        onClick={() => setShowRequestForm(false)}
                        className="px-3 py-1.5 text-slate-600 hover:bg-slate-200 rounded-md text-sm"
                      >
                        Cancel
                      </button>
                      <button 
                        type="submit" 
                        className="px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
                      >
                        Submit Application
                      </button>
                    </div>
                 </form>
               </div>
            )}

            <div className="space-y-4">
              {unitRequests.length === 0 ? (
                <div className="text-center py-12 bg-slate-50 rounded-lg border border-dashed border-slate-300">
                  <FileSignature className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  <p className="text-slate-500">No service requests found.</p>
                  {userRole === UserRole.UNIT_HOLDER && (
                    <p className="text-xs text-slate-400 mt-1">Submit a new request to get started.</p>
                  )}
                </div>
              ) : (
                unitRequests.map((request) => (
                  <div key={request.id} className="bg-slate-50 border border-slate-200 rounded-lg p-4 transition-all hover:shadow-sm">
                    <div className="flex justify-between items-start mb-2">
                       <div className="flex items-center gap-2">
                          <span className={`p-1.5 rounded-full ${
                            request.type.includes('CHANGE') ? 'bg-purple-100 text-purple-600' :
                            'bg-gray-100 text-gray-600'
                          }`}>
                            <FileSignature className="w-4 h-4" />
                          </span>
                          <span className="font-semibold text-slate-800 text-sm">{request.type.replace(/_/g, ' ')}</span>
                       </div>
                       <div className={`px-2.5 py-0.5 rounded-full text-xs font-bold flex items-center gap-1 ${
                         request.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-700' :
                         request.status === 'REJECTED' ? 'bg-red-100 text-red-700' :
                         request.status === 'FORWARDED_TO_ADMIN' ? 'bg-blue-100 text-blue-700' :
                         'bg-amber-100 text-amber-700'
                       }`}>
                         {request.status === 'APPROVED' && <CheckCircle className="w-3 h-3"/>}
                         {request.status === 'REJECTED' && <XCircle className="w-3 h-3"/>}
                         {(request.status === 'SUBMITTED_TO_MANAGER' || request.status === 'PENDING') && <AlertCircle className="w-3 h-3"/>}
                         {request.status === 'FORWARDED_TO_ADMIN' && <Briefcase className="w-3 h-3"/>}
                         {request.status.replace(/_/g, ' ')}
                       </div>
                    </div>
                    
                    <p className="text-sm text-slate-600 mb-2 ml-8">{request.description}</p>
                    
                    {request.documentName && (
                        <div className="ml-8 mb-2 flex items-center gap-2 text-xs text-blue-600 bg-blue-50 w-fit px-2 py-1 rounded">
                            <Paperclip className="w-3 h-3" /> Document: {request.documentName}
                        </div>
                    )}
                    
                    {request.managerRemarks && (
                         <div className="ml-8 mb-2 text-xs text-slate-500 bg-slate-100 p-2 rounded border border-slate-200">
                            <span className="font-semibold text-slate-700">Manager Remarks:</span> {request.managerRemarks}
                         </div>
                    )}

                    <div className="flex items-center justify-between text-xs text-slate-400 ml-8 border-t border-slate-200 pt-2 mt-2">
                       <span>Requested on {request.requestDate}</span>
                       {request.comments && <span className="text-red-500 italic">Note: {request.comments}</span>}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const SectionHeader = ({ icon, title }: { icon: React.ReactNode, title: string }) => (
  <div className="flex items-center gap-2 text-slate-800 mb-2 border-b border-slate-100 pb-2">
    <span className="text-blue-600">{icon}</span>
    <h3 className="font-semibold">{title}</h3>
  </div>
);

const DetailRow = ({ label, value, icon }: { label: string, value: string, icon?: React.ReactNode }) => (
  <div className="flex justify-between items-center py-2 border-b border-slate-50 group">
    <div className="flex items-center gap-2 text-sm text-slate-500">
      {icon}
      <span>{label}</span>
    </div>
    <span className="text-sm font-medium text-slate-800">{value}</span>
  </div>
);
