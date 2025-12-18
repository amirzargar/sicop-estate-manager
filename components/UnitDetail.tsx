import React, { useState, useMemo } from 'react';
import { Unit, Estate, UnitHistory, ServiceRequest, UserRole, RentPayment } from '../types';
import { 
  ArrowLeft, Building, User, Users, Phone, Mail, FileText, History, 
  DollarSign, Calendar, FileSignature, CheckCircle, XCircle, AlertCircle, 
  Upload, Paperclip, Briefcase, FileSpreadsheet, PlusCircle, TrendingUp,
  Edit2, Save, X
} from 'lucide-react';

interface UnitDetailProps {
  unit: Unit;
  estate?: Estate;
  userRole: UserRole;
  requests: ServiceRequest[];
  onUpdateUnit: (updatedUnit: Unit) => void;
  onRequestAdd: (request: Partial<ServiceRequest>) => void;
  onRequestUpdate: (id: string, status: 'APPROVED' | 'REJECTED', comments?: string) => void;
  onBack: () => void;
}

export const UnitDetail: React.FC<UnitDetailProps> = ({ 
  unit, 
  estate, 
  userRole, 
  requests, 
  onUpdateUnit,
  onRequestAdd, 
  onRequestUpdate, 
  onBack 
}) => {
  const [activeTab, setActiveTab] = useState<'info' | 'lease' | 'rent' | 'history' | 'requests'>('info');
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [isEditingUnit, setIsEditingUnit] = useState(false);
  
  // Dynamic Request State
  const [requestType, setRequestType] = useState<string>('CONTACT_CHANGE');
  const [description, setDescription] = useState('');
  const [document, setDocument] = useState<File | null>(null);
  const [payload, setPayload] = useState<any>({});

  // Unit Edit Form State
  const [editFormData, setEditFormData] = useState<Partial<Unit>>({});

  // Payment Form State
  const [newPayment, setNewPayment] = useState<Partial<RentPayment>>({
    date: new Date().toISOString().split('T')[0],
    amount: unit.monthlyRent,
    period: '',
    status: 'PAID'
  });

  const unitRequests = requests.filter(r => r.targetId === unit.id);

  const rentSummary = useMemo(() => {
    const history = unit.rentHistory || [];
    const totalPaid = history.reduce((sum, p) => sum + p.amount, 0);
    const lastPayment = history[0] ? history[0].date : 'No records';
    return { totalPaid, lastPayment };
  }, [unit]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setDocument(e.target.files[0]);
    }
  };

  const startEditing = () => {
    setEditFormData({
      proprietorName: unit.proprietorName,
      lineOfActivity: unit.lineOfActivity,
      employeeCount: unit.employeeCount,
      contactEmail: unit.contactEmail,
      contactPhone: unit.contactPhone,
      constitution: unit.constitution,
      monthlyRent: unit.monthlyRent
    });
    setIsEditingUnit(true);
  };

  const handleSaveUnitEdit = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedPayload = { ...editFormData };

    if (userRole === UserRole.ADMIN) {
      onUpdateUnit({ ...unit, ...updatedPayload } as Unit);
      setIsEditingUnit(false);
      alert("Unit details updated successfully.");
    } else if (userRole === UserRole.MANAGER) {
      onRequestAdd({
        targetId: unit.id,
        targetName: unit.name,
        estateId: unit.estateId,
        type: 'UNIT_EDIT',
        description: `Request to update core unit details by Estate Manager.`,
        status: 'SUBMITTED_TO_MANAGER',
        requestDate: new Date().toISOString().split('T')[0],
        requesterRole: userRole,
        payload: updatedPayload
      });
      setIsEditingUnit(false);
      alert("Update request submitted for Admin approval.");
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
    <div className="space-y-6 animate-fade-in relative">
      {/* Header */}
      <div className="flex items-center justify-between">
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
        <div className="flex items-center gap-3">
          {(userRole === UserRole.ADMIN || userRole === UserRole.MANAGER) && (
            <button 
              onClick={startEditing}
              className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors text-sm font-semibold"
            >
              <Edit2 className="w-4 h-4" /> Edit Details
            </button>
          )}
          <div className={`px-3 py-1.5 rounded-full text-xs font-bold border ${
            unit.rentStatus === 'PAID' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 
            unit.rentStatus === 'OVERDUE' ? 'bg-red-50 text-red-700 border-red-200' : 'bg-amber-50 text-amber-700 border-amber-200'
          }`}>
            Status: {unit.rentStatus}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 overflow-x-auto no-scrollbar">
        <TabButton active={activeTab === 'info'} onClick={() => setActiveTab('info')} label="Information" />
        <TabButton active={activeTab === 'lease'} onClick={() => setActiveTab('lease')} label="Lease Details" />
        <TabButton active={activeTab === 'rent'} onClick={() => setActiveTab('rent')} label="Rent Ledger" icon={<FileSpreadsheet className="w-4 h-4" />} />
        <TabButton active={activeTab === 'history'} onClick={() => setActiveTab('history')} label="Unit History" />
        <TabButton 
          active={activeTab === 'requests'} 
          onClick={() => setActiveTab('requests')} 
          label="Service Requests" 
          badge={unitRequests.filter(r => r.status !== 'APPROVED' && r.status !== 'REJECTED').length}
        />
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
                  <DetailRow label="Agreement Date" value={unit.rentAgreementDate} />
                </div>
              </div>

              <div className="space-y-6">
                <SectionHeader icon={<DollarSign className="w-5 h-5" />} title="Financial Overview" />
                <div className="space-y-4">
                   <DetailRow label="Monthly Rent" value={`₹${unit.monthlyRent.toLocaleString()}`} />
                   <DetailRow label="Last Payment Date" value={unit.lastRentPaymentDate} />
                   <DetailRow label="Annual Revenue" value={`₹${(unit.monthlyRent * 12).toLocaleString()}`} icon={<TrendingUp className="w-4 h-4 text-emerald-500" />} />
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'rent' && (
          <div className="space-y-6">
             <div className="flex justify-between items-center">
                <SectionHeader icon={<FileSpreadsheet className="w-5 h-5" />} title="Financial Rent Ledger" />
                {(userRole === UserRole.ADMIN || userRole === UserRole.MANAGER) && (
                   <button 
                     onClick={() => setShowPaymentForm(!showPaymentForm)}
                     className="flex items-center gap-2 text-sm bg-emerald-600 text-white px-3 py-1.5 rounded-lg hover:bg-emerald-700 transition-colors"
                   >
                     <PlusCircle className="w-4 h-4" /> Record Payment
                   </button>
                )}
             </div>

             {/* Rent Summary Cards */}
             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                   <p className="text-xs text-slate-500 font-medium mb-1">Total Rent Paid</p>
                   <p className="text-xl font-bold text-slate-900">₹{rentSummary.totalPaid.toLocaleString()}</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                   <p className="text-xs text-slate-500 font-medium mb-1">Last Payment</p>
                   <p className="text-xl font-bold text-slate-900">{rentSummary.lastPayment}</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                   <p className="text-xs text-slate-500 font-medium mb-1">Next Due Date</p>
                   <p className="text-xl font-bold text-amber-600">Pending Calc.</p>
                </div>
             </div>

             {showPaymentForm && (
                <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-lg animate-fade-in-down mb-6">
                   <h4 className="font-semibold text-emerald-800 mb-3 flex items-center gap-2">
                      <TrendingUp className="w-4 h-4" /> Log New Payment Receipt
                   </h4>
                   <form className="grid grid-cols-1 md:grid-cols-4 gap-4" onSubmit={(e) => { e.preventDefault(); alert('Payment recording simulated.'); setShowPaymentForm(false); }}>
                      <div>
                         <label className="block text-xs font-semibold text-emerald-900 mb-1">Payment Date</label>
                         <input type="date" className="w-full border border-emerald-200 rounded p-2 text-sm" value={newPayment.date} onChange={e => setNewPayment({...newPayment, date: e.target.value})} />
                      </div>
                      <div>
                         <label className="block text-xs font-semibold text-emerald-900 mb-1">Amount (₹)</label>
                         <input type="number" className="w-full border border-emerald-200 rounded p-2 text-sm" value={newPayment.amount} onChange={e => setNewPayment({...newPayment, amount: Number(e.target.value)})} />
                      </div>
                      <div>
                         <label className="block text-xs font-semibold text-emerald-900 mb-1">Period (Month/Year)</label>
                         <input type="text" placeholder="e.g. June 2024" className="w-full border border-emerald-200 rounded p-2 text-sm" value={newPayment.period} onChange={e => setNewPayment({...newPayment, period: e.target.value})} />
                      </div>
                      <div className="flex items-end">
                         <button type="submit" className="w-full bg-emerald-600 text-white rounded p-2 text-sm font-bold hover:bg-emerald-700">Save Entry</button>
                      </div>
                   </form>
                </div>
             )}

             <div className="border border-slate-200 rounded-xl overflow-hidden">
                <table className="w-full text-left text-sm">
                   <thead className="bg-slate-50 text-slate-600 font-medium border-b border-slate-200">
                      <tr>
                         <th className="px-6 py-3">Date</th>
                         <th className="px-6 py-3">Period</th>
                         <th className="px-6 py-3">Receipt No.</th>
                         <th className="px-6 py-3 text-right">Amount</th>
                         <th className="px-6 py-3 text-center">Status</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-100">
                      {unit.rentHistory && unit.rentHistory.length > 0 ? unit.rentHistory.map(payment => (
                         <tr key={payment.id} className="hover:bg-slate-50 transition-colors">
                            <td className="px-6 py-4 text-slate-600 font-medium">{payment.date}</td>
                            <td className="px-6 py-4 text-slate-600">{payment.period}</td>
                            <td className="px-6 py-4 font-mono text-slate-500 text-xs">{payment.receiptNumber || 'N/A'}</td>
                            <td className="px-6 py-4 text-right font-bold text-slate-800">₹{payment.amount.toLocaleString()}</td>
                            <td className="px-6 py-4">
                               <div className="flex justify-center">
                                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                     payment.status === 'PAID' ? 'bg-emerald-100 text-emerald-700' :
                                     payment.status === 'PARTIAL' ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'
                                  }`}>
                                     {payment.status}
                                  </span>
                               </div>
                            </td>
                         </tr>
                      )) : (
                         <tr>
                            <td colSpan={5} className="px-6 py-12 text-center text-slate-400 italic">
                               No payment history available for this unit.
                            </td>
                         </tr>
                      )}
                   </tbody>
                </table>
             </div>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="space-y-6">
            <SectionHeader icon={<History className="w-5 h-5" />} title="Unit Configuration Log" />
            <div className="space-y-4">
              {unit.history.length === 0 ? (
                <p className="text-slate-500 italic text-center py-8">No configuration history records found.</p>
              ) : (
                unit.history.map((record) => (
                  <div key={record.id} className="flex gap-4 p-4 bg-slate-50 rounded-lg border border-slate-100">
                    <div className="flex-shrink-0 mt-1">
                      <div className="w-2 h-2 rounded-full bg-blue-500 ring-4 ring-blue-100"></div>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                         <span className="font-semibold text-slate-800 text-sm">
                           {record.type.replace(/_/g, ' ')}
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
                            <label className="cursor-pointer bg-white border border-blue-200 hover:bg-blue-50 text-blue-700 px-4 py-2 rounded-md flex items-center gap-2 text-sm transition-colors shadow-sm">
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
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                      <button type="button" onClick={() => setShowRequestForm(false)} className="px-3 py-1.5 text-slate-600 hover:bg-slate-200 rounded-md text-sm">Cancel</button>
                      <button type="submit" className="px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm">Submit Application</button>
                    </div>
                 </form>
               </div>
            )}

            <div className="space-y-4">
              {unitRequests.length === 0 ? (
                <div className="text-center py-12 bg-slate-50 rounded-lg border border-dashed border-slate-300">
                  <FileSignature className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  <p className="text-slate-500">No service requests found.</p>
                </div>
              ) : (
                unitRequests.map((request) => (
                  <div key={request.id} className="bg-slate-50 border border-slate-200 rounded-lg p-4 transition-all hover:shadow-sm">
                    <div className="flex justify-between items-start mb-2">
                       <div className="flex items-center gap-2">
                          <span className={`p-1.5 rounded-full ${request.type.includes('CHANGE') ? 'bg-purple-100 text-purple-600' : 'bg-gray-100 text-gray-600'}`}>
                            <FileSignature className="w-4 h-4" />
                          </span>
                          <span className="font-semibold text-slate-800 text-sm">{request.type.replace(/_/g, ' ')}</span>
                       </div>
                       <div className={`px-2.5 py-0.5 rounded-full text-xs font-bold flex items-center gap-1 ${
                         request.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-700' :
                         request.status === 'REJECTED' ? 'bg-red-100 text-red-700' :
                         request.status === 'FORWARDED_TO_ADMIN' ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'
                       }`}>
                         {request.status.replace(/_/g, ' ')}
                       </div>
                    </div>
                    <p className="text-sm text-slate-600 mb-2 ml-8">{request.description}</p>
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

      {/* Edit Modal */}
      {isEditingUnit && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[110] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-fade-in-down">
            <div className="bg-slate-900 p-6 text-white flex justify-between items-center">
               <div className="flex items-center gap-3">
                  <Edit2 className="w-6 h-6 text-blue-400" />
                  <div>
                    <h3 className="text-xl font-bold">Edit Industrial Unit Details</h3>
                    <p className="text-xs text-slate-400">Updating profile for {unit.name}</p>
                  </div>
               </div>
               <button onClick={() => setIsEditingUnit(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                  <X className="w-6 h-6" />
               </button>
            </div>
            
            <form onSubmit={handleSaveUnitEdit} className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                   <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Proprietor Name</label>
                   <input 
                     type="text" required className="w-full border border-slate-200 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                     value={editFormData.proprietorName}
                     onChange={e => setEditFormData({...editFormData, proprietorName: e.target.value})}
                   />
                </div>
                <div>
                   <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Constitution Type</label>
                   <select 
                     className="w-full border border-slate-200 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                     value={editFormData.constitution}
                     onChange={e => setEditFormData({...editFormData, constitution: e.target.value})}
                   >
                      <option value="Proprietorship">Proprietorship</option>
                      <option value="Partnership">Partnership</option>
                      <option value="Private Limited">Private Limited</option>
                      <option value="Public Limited">Public Limited</option>
                   </select>
                </div>
                <div className="md:col-span-2">
                   <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Line of Activity</label>
                   <input 
                     type="text" required className="w-full border border-slate-200 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                     value={editFormData.lineOfActivity}
                     onChange={e => setEditFormData({...editFormData, lineOfActivity: e.target.value})}
                   />
                </div>
                <div>
                   <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Monthly Rent (₹)</label>
                   <input 
                     type="number" required className="w-full border border-slate-200 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                     value={editFormData.monthlyRent}
                     onChange={e => setEditFormData({...editFormData, monthlyRent: Number(e.target.value)})}
                   />
                </div>
                <div>
                   <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Employee Count</label>
                   <input 
                     type="number" required className="w-full border border-slate-200 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                     value={editFormData.employeeCount}
                     onChange={e => setEditFormData({...editFormData, employeeCount: Number(e.target.value)})}
                   />
                </div>
                <div>
                   <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Contact Email</label>
                   <input 
                     type="email" required className="w-full border border-slate-200 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                     value={editFormData.contactEmail}
                     onChange={e => setEditFormData({...editFormData, contactEmail: e.target.value})}
                   />
                </div>
                <div>
                   <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Contact Phone</label>
                   <input 
                     type="text" required className="w-full border border-slate-200 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                     value={editFormData.contactPhone}
                     onChange={e => setEditFormData({...editFormData, contactPhone: e.target.value})}
                   />
                </div>
              </div>

              {userRole === UserRole.MANAGER && (
                <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl flex gap-3">
                   <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0" />
                   <p className="text-sm text-amber-800">
                     <strong>Note:</strong> As a Manager, saving these changes will create a formal update request for Admin approval before they are applied.
                   </p>
                </div>
              )}

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                 <button 
                  type="button" onClick={() => setIsEditingUnit(false)}
                  className="px-6 py-2.5 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors font-semibold"
                 >
                   Discard Changes
                 </button>
                 <button 
                  type="submit"
                  className="px-8 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-bold shadow-lg shadow-blue-900/20 flex items-center gap-2"
                 >
                   <Save className="w-4 h-4" /> {userRole === UserRole.ADMIN ? 'Save Changes' : 'Submit for Approval'}
                 </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const TabButton = ({ active, onClick, label, badge, icon }: { active: boolean, onClick: () => void, label: string, badge?: number, icon?: React.ReactNode }) => (
  <button
    onClick={onClick}
    className={`px-6 py-3 text-sm font-medium border-b-2 transition-all whitespace-nowrap flex items-center gap-2 relative ${
      active ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
    }`}
  >
    {icon}
    {label}
    {badge ? (
      <span className="bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-full text-[10px] font-bold">
        {badge}
      </span>
    ) : null}
  </button>
);

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