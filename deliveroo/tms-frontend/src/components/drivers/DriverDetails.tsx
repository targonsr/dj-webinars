import React from 'react';
import { Driver } from '../../model/drivers';
import { 
  User, Mail, Phone, MapPin, Calendar, CreditCard, 
  FileText, AlertCircle, ArrowLeft
} from 'lucide-react';
import { formatDateTime, formatDate } from '../../utils/dateUtils';

interface DriverDetailsProps {
  driver: Driver;
  onBack: () => void;
}

export const DriverDetails: React.FC<DriverDetailsProps> = ({
  driver,
  onBack
}) => {
  const getStatusColor = (status: Driver['status']) => {
    const colors = {
      'active': 'bg-green-100 text-green-800',
      'on-route': 'bg-blue-100 text-blue-800',
      'resting': 'bg-yellow-100 text-yellow-800',
      'off-duty': 'bg-gray-100 text-gray-800',
      'sick-leave': 'bg-red-100 text-red-800'
    };
    return colors[status];
  };

  const isLicenseExpiringSoon = () => {
    const threeMonthsFromNow = new Date();
    threeMonthsFromNow.setMonth(threeMonthsFromNow.getMonth() + 3);
    return driver.licenseExpiry < threeMonthsFromNow;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="mb-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Drivers
        </button>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{driver.name}</h2>
            <p className="text-gray-600">Driver Details & Information</p>
          </div>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(driver.status)}`}>
            {driver.status.replace('-', ' ').toUpperCase()}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Information */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-blue-600" />
              Personal Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Full Name</label>
                <p className="text-gray-900">{driver.name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Employee ID</label>
                <p className="text-gray-900">{driver.id}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Email</label>
                <p className="text-gray-900 flex items-center gap-2">
                  <Mail className="w-4 h-4 text-gray-400" />
                  {driver.email}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Phone</label>
                <p className="text-gray-900 flex items-center gap-2">
                  <Phone className="w-4 h-4 text-gray-400" />
                  {driver.phone}
                </p>
              </div>
            </div>

            <div className="mt-4">
              <label className="text-sm font-medium text-gray-500">Address</label>
              <p className="text-gray-900 flex items-start gap-2">
                <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                <span>
                  {driver.address.street}<br />
                  {driver.address.postalCode} {driver.address.city}<br />
                  {driver.address.country}
                </span>
              </p>
            </div>
          </div>

          {/* Employment Information */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-blue-600" />
              Employment Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Contract Type</label>
                <p className="text-gray-900 capitalize">{driver.contractType.replace('-', ' ')}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Annual Salary</label>
                <p className="text-gray-900 font-medium">
                  {driver.salary.toLocaleString()} {driver.currency}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Hire Date</label>
                <p className="text-gray-900">{formatDate(driver.hireDate)}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Years of Service</label>
                <p className="text-gray-900">
                  {Math.floor((Date.now() - driver.hireDate.getTime()) / (365.25 * 24 * 60 * 60 * 1000))} years
                </p>
              </div>
            </div>
          </div>

          {/* License Information */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" />
              License Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">License Number</label>
                <p className="text-gray-900 font-mono">{driver.licenseNumber}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Expiry Date</label>
                <p className={`flex items-center gap-2 ${isLicenseExpiringSoon() ? 'text-red-600' : 'text-gray-900'}`}>
                  {isLicenseExpiringSoon() && <AlertCircle className="w-4 h-4" />}
                  {formatDate(driver.licenseExpiry)}
                  {isLicenseExpiringSoon() && <span className="text-xs">(Expires Soon!)</span>}
                </p>
              </div>
            </div>
          </div>

          {/* Emergency Contact */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-blue-600" />
              Emergency Contact
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Name</label>
                <p className="text-gray-900">{driver.emergencyContact.name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Phone</label>
                <p className="text-gray-900">{driver.emergencyContact.phone}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Relationship</label>
                <p className="text-gray-900">{driver.emergencyContact.relationship}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Current Location */}
          {driver.currentLocation && (
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-blue-600" />
                Current Location
              </h3>
              
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  <span>{driver.currentLocation.address}</span>
                </div>
              </div>
            </div>
          )}

          {/* Quick Stats */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Routes:</span>
                <span className="font-medium">{driver.routes.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Active Routes:</span>
                <span className="font-medium text-blue-600">
                  {driver.routes.filter(r => r.status === 'active').length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Completed Routes:</span>
                <span className="font-medium text-green-600">
                  {driver.routes.filter(r => r.status === 'completed').length}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};